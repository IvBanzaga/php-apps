// dashboard.js - JavaScript optimizado para el dashboard

console.log('Dashboard cargado');

// Variable global para sesiones
let sessions = [];

document.addEventListener('DOMContentLoaded', () => {
    if (typeof debugStorage === 'function') debugStorage();

    // Log completo de storage al cargar el dashboard
    chrome.storage.local.get(null, (data) => {
        console.log('Dashboard: Storage completo al cargar:', JSON.stringify(data));
    });

    loadDashboardData();
    // Mostrar barra de sesión o descanso actual (función reutilizable)
    function updateSessionBar() {
        chrome.storage.local.get(['currentSession', 'breakInfo'], data => {
            const bar = document.getElementById('currentSessionBar');
            if (!bar) return;
            if (data.breakInfo) {
                // Mostrar barra de descanso
                bar.style.display = 'block';
                bar.innerHTML = `
                    <div style="background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:600;">☕ Descanso activo</div>
                            <div style="color:#666; font-size:14px;">Tiempo restante</div>
                        </div>
                        <div style="text-align:right">
                            <div id="breakTime" style="font-weight:700; font-size:18px; color:#ff9800;">${getBreakTime(data.breakInfo)}</div>
                            <div style="margin-top:8px; display:flex; gap:8px; justify-content:flex-end;">
                                <button id="endBreakBtn" class="btn-small btn-danger">⏹️ Finalizar descanso</button>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('endBreakBtn').onclick = () => {
                    chrome.runtime.sendMessage({ action: 'endBreak' }, () => {
                        bar.style.display = 'none';
                        loadDashboardData();
                    });
                };
            } else if (data.currentSession) {
                // Mostrar barra de sesión normal (ya está en el HTML)
                bar.style.display = 'block';
            } else {
                bar.style.display = 'none';
            }
        });
    }
    // Llamar al cargar
    updateSessionBar();
    // Escuchar cambios en el storage para breakInfo y currentSession
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && (changes.breakInfo || changes.currentSession)) {
            updateSessionBar();
        }
    });
// Función para mostrar el tiempo restante de descanso
function getBreakTime(breakInfo) {
    if (!breakInfo || !breakInfo.endTime) return '';
    const ms = breakInfo.endTime - Date.now();
    if (ms <= 0) return '0m 00s';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}m ${sec.toString().padStart(2, '0')}s`;
}

    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('cleanDataBtn').addEventListener('click', cleanCorruptedData);
    document.getElementById('resetAllBtn').addEventListener('click', resetAllData);
    document.getElementById('addClientBtn').addEventListener('click', addClient);

    // Abrir página de opciones/configuración
    const optionsBtn = document.getElementById('openOptionsBtn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('options.html'));
            }
        });
    }
});

function addModalListeners() {
    modal.querySelectorAll('.option-btn').forEach(btn => {
        btn.onclick = () => handleActivitySelection(btn.dataset.type);
    });

    // Aquí se conecta el botón “Agregar” con la función addNewClient
    modal.querySelector('#addClientBtn').onclick = addNewClient;

    modal.querySelector('#startBtn').onclick = startSession;
    modal.querySelector('#cancelBtn').onclick = resetModalView;
    modal.querySelector('#startBreakBtn').onclick = startBreak;
    modal.querySelector('#cancelBreakBtn').onclick = resetModalView;
}



function loadDashboardData() {
    chrome.storage.local.get(['sessions', 'clients'], (data) => {
        sessions = data.sessions || [];
        const clients = data.clients || [];

        console.log('Datos cargados:', { sessions: sessions.length, clients: clients.length });

        updateStats(sessions, clients);
        renderClientsList(clients);
        updateClientSelect(clients);
        renderSessionsList(sessions);
    });
}

function updateStats(sessions, clients) {
    // Filtrar sesiones finalizadas (tienen endTime y duration)
    const completedSessions = sessions.filter(s => s.endTime && typeof s.duration === 'number');
    const totalTimeMins = completedSessions.reduce((sum, s) => sum + Math.round(s.duration / (1000 * 60)), 0);
    let totalTimeHours = 0;
    let avgSessionMins = 0;
    if (completedSessions.length > 0 && totalTimeMins > 0) {
        totalTimeHours = Math.round(totalTimeMins / 60 * 10) / 10;
        avgSessionMins = Math.round(totalTimeMins / completedSessions.length);
    }
    document.getElementById('totalSessions').textContent = completedSessions.length;
    document.getElementById('totalTime').textContent = (isNaN(totalTimeHours) ? 0 : totalTimeHours) + 'h';
    document.getElementById('totalClients').textContent = clients.length;
    document.getElementById('avgSession').textContent = (isNaN(avgSessionMins) ? 0 : avgSessionMins) + 'm';
}

function renderSessionsList(sessions) {
    const container = document.getElementById('sessionsList');
    console.log('Dashboard: Sesiones recibidas para renderizar:', sessions);
    if (!sessions || sessions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>🕐 No hay sesiones registradas</h3>
                <p>Inicia tu primera sesión para ver el historial aquí</p>
            </div>`;
        return;
    }

    container.innerHTML = '';
    const recentSessions = sessions.filter(s => s.endTime)
                                   .sort((a, b) => b.startTime - a.startTime)
                                   .slice(0, 20);

    recentSessions.forEach(session => {
        let duration = 0;
        if (typeof session.startTime === 'number' && typeof session.endTime === 'number') {
            duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
            if (isNaN(duration) || duration < 0) duration = 0;
        }
        const startDate = new Date(session.startTime);
        const endDate = new Date(session.endTime);

        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
            <div class="session-info">
                <div class="session-title">${getTypeIcon(session.type)} ${session.description || 'Sin descripción'}</div>
                <div class="session-meta">
                    ${startDate.toLocaleDateString('es-ES')} • 
                    ${startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - 
                    ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    ${session.client ? ` • Cliente: ${session.client}` : ''}
                </div>
            </div>
            <div class="session-actions">
                <div class="session-duration">${duration}m</div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button class="btn-small edit-session-btn" data-session-id="${session.id}">✏️ Editar</button>
                    <button class="btn-small btn-danger delete-session-btn" data-session-id="${session.id}">🗑️ Eliminar</button>
                </div>
            </div>`;
        container.appendChild(sessionItem);
    });

    createTimeChart(sessions.filter(s => s.endTime));
}

function getTypeIcon(type) {
    const icons = { personal: '👤', client: '💼', learning: '📚', programming: '💻' };
    return icons[type] || '📝';
}

function getTypeLabel(type) {
    const labels = { personal: 'Para mí', client: 'Cliente', learning: 'Aprendizaje', programming: 'Programando' };
    return labels[type] || type;
}

function exportToCSV() {
    chrome.storage.local.get(['sessions'], (data) => {
        const sessions = data.sessions || [];
        if (sessions.length === 0) return alert('No hay sesiones para exportar');

        const headers = ['ID', 'Fecha', 'Inicio', 'Fin', 'Tipo', 'Descripción', 'Cliente', 'Duración (minutos)'];
        const rows = sessions.filter(s => s.endTime).map(s => {
            const duration = Math.round((s.endTime - s.startTime) / (1000 * 60));
            const startDate = new Date(s.startTime);
            const endDate = new Date(s.endTime);
            return [s.id, startDate.toLocaleDateString('es-ES'), startDate.toLocaleTimeString('es-ES'),
                    endDate.toLocaleTimeString('es-ES'), getTypeLabel(s.type), s.description || '', s.client || '', duration];
        });

        const csvContent = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `time_session_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('CSV exportado exitosamente');
    });
}

// Editar y eliminar sesión
function deleteSession(sessionId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sesión?')) return;
    chrome.runtime.sendMessage({ action: 'deleteSession', sessionId }, response => {
        if (response?.success) {
            loadDashboardData();
        } else {
            alert('Error al eliminar la sesión');
        }
    });
}

function editSession(sessionId) {
    chrome.storage.local.get(['sessions'], data => {
        const sessions = data.sessions || [];
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return alert('Sesión no encontrada');

        const newDescription = prompt('Tarea:', session.description || '');
        if (newDescription === null) return;
        const newClient = prompt('Cliente:', session.client || '');
        if (newClient === null) return;
        const newNotes = prompt('Descripción:', session.notes || '');
        if (newNotes === null) return;

        chrome.runtime.sendMessage({
            action: 'editSession',
            sessionId,
            description: newDescription,
            client: newClient,
            notes: newNotes
        }, response => {
            if (response?.success) {
                loadDashboardData();
            } else {
                alert('Error al editar la sesión');
            }
        });
    });
}

// Clientes
function renderClientsList(clients) {
    const container = document.getElementById('clientsList');
    if (!clients || clients.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>👥 No hay clientes registrados</p></div>`;
        return;
    }

    container.innerHTML = '';
    clients.forEach(client => {
        const clientItem = document.createElement('div');
        clientItem.className = 'client-item';
        clientItem.innerHTML = `
            <div class="client-name">👤 ${client.name}</div>
            <div class="client-actions">
                <button class="btn-small btn-danger delete-client-btn" data-client-id="${client.id}">🗑️ Eliminar</button>
                <button class="btn-small btn-primary edit-client-btn" data-client-id="${client.id}">✏️ Editar</button>
            </div>`;
        container.appendChild(clientItem);
    });
}


function updateClientSelect(clients) {
    const select = document.getElementById('selectClient');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccionar cliente</option>';
    clients.forEach(client => {
        const opt = document.createElement('option');
        opt.value = client.name;
        opt.textContent = client.name;
        select.appendChild(opt);
    });
}

function addClient() {
    const input = document.getElementById('newClientName');
    if (!input) return alert('Error: No se encontró el campo de texto para el cliente');

    const clientName = input.value.trim();
    if (!clientName) return alert('Por favor ingresa un nombre para el cliente');

    const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

    chrome.storage.local.get(['clients'], data => {
        const clients = data.clients || [];
        clients.push({ id: clientId, name: clientName });
        chrome.storage.local.set({ clients }, () => {
            input.value = '';
            loadDashboardData(); // recarga la lista de clientes
            alert('Cliente agregado: ' + clientName);
        });
    });
}

function editClient(clientId) {
    if (!clientId) return alert('ID de cliente inválido');
    chrome.storage.local.get(['clients'], data => {
        const clients = data.clients || [];
        const client = clients.find(c => c.id === clientId);
        if (!client) return alert('Cliente no encontrado');

        const newName = prompt('Editar nombre del cliente:', client.name);
        if (newName === null) return; // Cancelado

        chrome.runtime.sendMessage({
            action: 'editClient',
            clientId,
            name: newName.trim()
        }, response => {
            if (response?.success) {
                loadDashboardData();
            } else {
                alert('Error al editar el cliente');
            }
        });
    });
}




function deleteClient(clientId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;
    chrome.runtime.sendMessage({ action: 'deleteClient', clientId }, response => {
        if (response?.success) {
            loadDashboardData();
        } else {
            alert('Error al eliminar el cliente');
        }
    });
}


// Gráfico
let timeChart = null;

// Función principal para crear el gráfico
function createTimeChart(sessions) {
  if (typeof Chart === 'undefined') return console.error('Chart.js no está disponible');

  const canvas = document.getElementById('timeChart');
  if (!canvas) return console.error('Canvas para gráfico no encontrado');
  const ctx = canvas.getContext('2d');

  if (timeChart) timeChart.destroy();

  if (!sessions || sessions.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No hay datos para mostrar', canvas.width / 2, canvas.height / 2);
    return;
  }

  // Agrupar tiempos por tipo
  const timeByType = {};
  sessions.forEach(s => {
    const type = s.type || 'Otros';
    let duration = 0;
    if (typeof s.duration === 'number') duration = s.duration / 60000; // minutos
    else if (s.startTime && s.endTime) duration = (new Date(s.endTime) - new Date(s.startTime)) / 60000;
    if (duration > 0) timeByType[type] = (timeByType[type] || 0) + duration;
  });

  const labels = Object.keys(timeByType).map(getTypeLabel);
  const data = Object.values(timeByType);
  const backgroundColor = generateColors(labels.length);

  // Crear gráfico de barras
  timeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tiempo total (minutos)',
        data,
        backgroundColor,
        borderColor: '#333',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const minutes = ctx.parsed.y;
              return `${ctx.label}: ${formatMinutes(minutes)} (${Math.round(minutes)} min)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Minutos' }
        },
        x: {
          title: { display: true, text: 'Tipo de sesión' }
        }
      }
    }
  });
}


// Filtrar sesiones según rango seleccionado
function filterSessionsByRange(sessions, range) {
  const now = new Date();
  return sessions.filter(s => {
    const start = new Date(s.startTime);
    if (range === 'day') return start.toDateString() === now.toDateString();
    if (range === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return start >= weekStart && start <= weekEnd;
    }
    if (range === 'month') return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
    return true;
  });
}

// Formatear minutos a "Xh Ym"
function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

// Generar colores HSL dinámicos
function generateColors(n) {
  const colors = [];
  for(let i=0;i<n;i++){
    const hue = i * (360 / n);
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
}


// Inicializar select y evento después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const chartRange = document.getElementById('chartRange');
    if (chartRange) {
        chartRange.addEventListener('change', () => {
            const filtered = filterSessionsByRange(sessions, chartRange.value);
            createTimeChart(filtered);
        });
    }
    // Llamar inicialmente el gráfico solo si hay sesiones cargadas
    createTimeChart(sessions);
});



// Limpiar datos corruptos
function cleanCorruptedData() {
    if (!confirm('¿Estás seguro de limpiar datos corruptos? Esta acción no se puede deshacer.')) return;
    chrome.storage.local.get(['clients','sessions'], data => {
        const cleanClients = (data.clients||[]).filter(c => c?.id && c?.name);
        const cleanSessions = (data.sessions||[]).filter(s => s?.id && s?.startTime);

        chrome.storage.local.set({ clients: cleanClients, sessions: cleanSessions }, () => {
            alert(`Limpieza completada:\n- ${data.clients.length-cleanClients.length} clientes corruptos eliminados\n- ${data.sessions.length-cleanSessions.length} sesiones corruptas eliminadas`);
            loadDashboardData();
        });
    });
}

// Event listeners dinámicos
document.addEventListener('click', e => {
    if (e.target.classList.contains('edit-session-btn')) editSession(e.target.dataset.sessionId);
    if (e.target.classList.contains('delete-session-btn')) deleteSession(e.target.dataset.sessionId);
    if (e.target.classList.contains('edit-client-btn')) editClient(e.target.dataset.clientId); // ✅ AGREGADO
    if (e.target.classList.contains('delete-client-btn')) deleteClient(e.target.dataset.clientId);
});


// Reiniciar todos los datos
function resetAllData() {
    if (!confirm('⚠️ Esto eliminará TODOS los datos. ¿Continuar?')) return;
    if (!confirm('🚨 ÚLTIMA CONFIRMACIÓN: Se perderán TODOS los datos permanentemente. ¿Continuar?')) return;

    chrome.runtime.sendMessage({ action: 'resetData' }, response => {
        if (response?.success) {
            alert('✅ Todos los datos han sido eliminados.');
            window.location.reload();
        } else alert('❌ Error al reiniciar los datos');
    });
}
