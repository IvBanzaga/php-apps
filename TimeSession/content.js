// content.js - Script de contenido para TimeSession (versión con debug)
(function () {
    if (window.hasRun) return;
    window.hasRun = true;

    console.log('TimeSession: Content script iniciado');

    let modal = null;
    let validationModal = null;
    let selectedType = null;

    // Mostrar modal inicial
    function showInitialModal() {
        console.log('TimeSession: showInitialModal llamado');
        if (modal) {
            console.log('TimeSession: Modal ya existe, no crear otro');
            return;
        }

        console.log('TimeSession: Creando modal');
        modal = document.createElement('div');
        modal.id = 'timesession-modal-container';
        modal.innerHTML = `
            <div class="timesession-overlay"></div>
            <div class="timesession-modal">
                <h2>⏱️ ¿Qué vas a hacer?</h2>
                <button class="option-btn work-btn" data-type="personal">👤 Para mí</button>
                <button class="option-btn work-btn" data-type="client">🏢 Para un cliente</button>
                <button class="option-btn work-btn" data-type="learning">📚 Aprendizaje</button>
                <button class="option-btn work-btn" data-type="programming">💻 Programando</button>
                <button class="option-btn break-btn" data-type="break">☕ No voy a trabajar</button>

                <div id="clientSection" class="hidden">
                    <select id="clientSelect"><option>Cargando clientes...</option></select>
                </div>

                <div id="taskSection" class="hidden">
                    <textarea id="taskDescription" placeholder="Describe la tarea..."></textarea>
                    <button id="startBtn">🚀 Iniciar Sesión</button>
                    <button id="cancelBtn">Cancelar</button>
                </div>

                <div id="breakSection" class="hidden">
                    <input type="number" id="breakMinutes" value="15" min="1">
                    <button id="startBreakBtn">☕ Iniciar Descanso</button>
                    <button id="cancelBreakBtn">Cancelar</button>
                </div>
            </div>
        `;
        if (document.body) {
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            console.log('TimeSession: Modal agregado al DOM');
            loadClients();
            addModalListeners();
        } else {
            console.warn('TimeSession: No existe document.body, esperando DOMContentLoaded');
            window.addEventListener('DOMContentLoaded', () => {
                if (!document.body.contains(modal)) {
                    document.body.appendChild(modal);
                    document.body.style.overflow = 'hidden';
                    console.log('TimeSession: Modal agregado al DOM (tras DOMContentLoaded)');
                    loadClients();
                    addModalListeners();
                }
            }, { once: true });
        }
    }

    function hideInitialModal() {
        console.log('TimeSession: hideInitialModal llamado');
        if (modal) {
            modal.remove();
            modal = null;
            document.body.style.overflow = 'auto';
            console.log('TimeSession: Modal removido');
        }
    }

    function addModalListeners() {
        console.log('TimeSession: Agregando listeners');
        modal.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => handleActivitySelection(btn.dataset.type);
        });
        
        const startBtn = modal.querySelector('#startBtn');
        if (startBtn) startBtn.onclick = startSession;

        const cancelBtn = modal.querySelector('#cancelBtn');
        if (cancelBtn) cancelBtn.onclick = resetModalView;

        const startBreakBtn = modal.querySelector('#startBreakBtn');
        if (startBreakBtn) startBreakBtn.onclick = startBreak;

        const cancelBreakBtn = modal.querySelector('#cancelBreakBtn');
        if (cancelBreakBtn) cancelBreakBtn.onclick = resetModalView;
    }

    function handleActivitySelection(type) {
        console.log('TimeSession: Actividad seleccionada:', type);
        selectedType = type;
        modal.querySelector('#clientSection').classList.add('hidden');
        modal.querySelector('#taskSection').classList.add('hidden');
        modal.querySelector('#breakSection').classList.add('hidden');

        if (type === 'break') {
            modal.querySelector('#breakSection').classList.remove('hidden');
        } else {
            if (type === 'client') {
                modal.querySelector('#clientSection').classList.remove('hidden');
            }
            modal.querySelector('#taskSection').classList.remove('hidden');
        }
    }

    function resetModalView() {
        console.log('TimeSession: resetModalView');
        modal.querySelector('#clientSection').classList.add('hidden');
        modal.querySelector('#taskSection').classList.add('hidden');
        modal.querySelector('#breakSection').classList.add('hidden');
        selectedType = null;
    }

    function loadClients() {
        console.log('TimeSession: Cargando clientes');
        const select = modal.querySelector('#clientSelect');
        select.innerHTML = '<option value="">Seleccionar cliente...</option>';

        chrome.runtime.sendMessage({ action: "getClients" }, (response) => {
            console.log('TimeSession: Clientes recibidos:', response);
            if (response && response.length) {
                response.forEach(client => {
                    if (!client || !client.name) return;
                    const option = document.createElement('option');
                    option.value = client.name;
                    option.textContent = client.name;
                    select.appendChild(option);
                });
            }
        });
    }

    function startSession() {
        console.log('TimeSession: startSession');

        const description = modal.querySelector('#taskDescription').value.trim();
        let client = null;

        // Mapeo de nombres legibles
        const typeLabels = {
            personal: 'Personal',
            client: 'Cliente',
            learning: 'Aprendizaje',
            programming: 'Programando',
            break: 'Descanso'
        };

        if (selectedType === 'client') {
            const select = modal.querySelector('#clientSelect');
            client = select ? select.value : null;
            if (!client) {
                alert("Por favor, selecciona un cliente.");
                return;
            }
        }

        let defaultDesc = '';
        if (description) {
            defaultDesc = description;
        } else if (selectedType === 'client' && client) {
            defaultDesc = `Sesión Cliente ${client}`;
        } else {
            defaultDesc = `Sesión de ${typeLabels[selectedType] || selectedType}`;
        }

        const sessionData = {
            action: "startSession",
            session: {
                type: selectedType,
                description: defaultDesc,
                client,
                startTime: Date.now()
            }
        };

        console.log('TimeSession: Enviando mensaje startSession:', sessionData);

        chrome.runtime.sendMessage(sessionData, (response) => {
            console.log('TimeSession: Respuesta startSession:', response);
            if (response && response.success) {
                hideInitialModal();
            } else {
                console.error('TimeSession: Error al iniciar sesión:', response);
            }
        });
    }

    function startBreak() {
        console.log('TimeSession: startBreak');
        const minutes = parseInt(modal.querySelector('#breakMinutes').value, 10);
        if (minutes > 0) {
            chrome.runtime.sendMessage({ action: "startBreak", minutes }, (response) => {
                console.log('TimeSession: Respuesta startBreak:', response);
                hideInitialModal();
            });
        }
    }

    // Listener para mensajes del background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('TimeSession: Mensaje recibido en content script:', request);
        
        if (request.action === "showInitialModal") {
            console.log('TimeSession: Mostrando modal por mensaje');
            showInitialModal();
        } else if (request.action === "showValidationModal") {
            // Aquí puedes agregar la lógica para el modal de validación
            console.log('TimeSession: Debería mostrar modal de validación');
        }
    });

    // Función para forzar mostrar modal (para debugging)
    window.timeSessionForceModal = function() {
        console.log('TimeSession: Forzando modal desde consola');
        showInitialModal();
    };

    // Auto-check cuando se carga la página
    console.log('TimeSession: Verificando estado inicial');
    
    // Verificar estado actual
    chrome.runtime.sendMessage({ action: "checkState" }, (response) => {
        console.log('TimeSession: Estado actual:', response);
        
        // Si no hay sesión activa ni descanso, mostrar modal
        if (!response || (!response.currentSession && !response.breakInfo)) {
            console.log('TimeSession: No hay sesión activa, mostrando modal inicial');
            showInitialModal();
        } else {
            console.log('TimeSession: Hay sesión/descanso activo, no mostrar modal');
        }
    });

    // También escuchar cuando la página se enfoca (por si acaso)
    window.addEventListener('focus', () => {
        console.log('TimeSession: Ventana enfocada, verificando estado');
        chrome.runtime.sendMessage({ action: "checkState" }, (response) => {
            if (!response || (!response.currentSession && !response.breakInfo)) {
                // Solo mostrar si no hay modal ya
                if (!modal) {
                    console.log('TimeSession: Mostrando modal por enfoque de ventana');
                    showInitialModal();
                }
            }
        });
    });

    console.log('TimeSession: Content script configurado completamente');
})();