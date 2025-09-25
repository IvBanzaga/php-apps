// content.js - Script de contenido para TimeSession (versión con debug)
(function () {
    if (window.hasRun) return;
    window.hasRun = true;


    let modal = null;
    let validationModal = null;
    let selectedType = null;

    /* TODO: Muestra el modal inicial para iniciar sesión o descanso */
    function showInitialModal() {
        if (modal) {
            return;
        }
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
            // Modal agregado al DOM
            loadClients();
            addModalListeners();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                if (!document.body.contains(modal)) {
                    document.body.appendChild(modal);
                    document.body.style.overflow = 'hidden';
                    // Modal agregado al DOM (tras DOMContentLoaded)
                    loadClients();
                    addModalListeners();
                }
            }, { once: true });
        }
    }

    /* TODO: Oculta y elimina el modal inicial del DOM */
    function hideInitialModal() {
        if (modal) {
            modal.remove();
            modal = null;
            document.body.style.overflow = 'auto';
        }
    }

    /* TODO: Añade listeners a los botones del modal inicial */
    function addModalListeners() {
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

    /* TODO: Maneja la selección de tipo de actividad en el modal */
    function handleActivitySelection(type) {
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

    /* TODO: Resetea la vista del modal a estado inicial */
    function resetModalView() {
        modal.querySelector('#clientSection').classList.add('hidden');
        modal.querySelector('#taskSection').classList.add('hidden');
        modal.querySelector('#breakSection').classList.add('hidden');
        selectedType = null;
    }

    /* TODO: Carga la lista de clientes en el select del modal */
    function loadClients() {
        const select = modal.querySelector('#clientSelect');
        select.innerHTML = '<option value="">Seleccionar cliente...</option>';

        chrome.runtime.sendMessage({ action: "getClients" }, (response) => {
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

    /* TODO: Inicia una nueva sesión con los datos del modal */
    function startSession() {

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


        chrome.runtime.sendMessage(sessionData, (response) => {
            if (response && response.success) {
                hideInitialModal();
            } else {
            }
        });
    }

    /* TODO: Inicia un descanso con la duración indicada en el modal */
    function startBreak() {
        const minutes = parseInt(modal.querySelector('#breakMinutes').value, 10);
        if (minutes > 0) {
            chrome.runtime.sendMessage({ action: "startBreak", minutes }, (response) => {
                hideInitialModal();
            });
        }
    }

    // Listener para mensajes del background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        
        if (request.action === "showInitialModal") {
            showInitialModal();
        } else if (request.action === "showValidationModal") {
            // Aquí puedes agregar la lógica para el modal de validación
        }
    });

    // Función para forzar mostrar modal (para debugging)
    window.timeSessionForceModal = function() {
        showInitialModal();
    };

    // Auto-check cuando se carga la página
    
    // Verificar estado actual
    chrome.runtime.sendMessage({ action: "checkState" }, (response) => {
        
        // Si no hay sesión activa ni descanso, mostrar modal
        if (!response || (!response.currentSession && !response.breakInfo)) {
            // No hay sesión activa, mostrando modal inicial
            showInitialModal();
        } else {
            // Hay sesión/descanso activo, no mostrar modal
        }
    });

    // También escuchar cuando la página se enfoca (por si acaso)
    window.addEventListener('focus', () => {
        chrome.runtime.sendMessage({ action: "checkState" }, (response) => {
            if (!response || (!response.currentSession && !response.breakInfo)) {
                // Solo mostrar si no hay modal ya
                if (!modal) {
                    // Mostrando modal por enfoque de ventana
                    showInitialModal();
                }
            }
        });
    });

    // Content script configurado completamente
})();