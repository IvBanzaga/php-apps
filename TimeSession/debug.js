// debug.js - Script de depuración para TimeSession

// Función para mostrar el estado actual del storage
function debugStorage() {
    chrome.storage.local.get(null, (data) => {
        console.log('=== ESTADO ACTUAL DEL STORAGE ===');
        console.log('Clientes:', data.clients);
        console.log('Sesiones:', data.sessions);
        console.log('Sesión actual:', data.currentSession);
        console.log('Info de descanso:', data.breakInfo);
        
        // Verificar integridad de datos
        if (data.clients) {
            const validClients = data.clients.filter(c => c && c.name && c.id);
            const invalidClients = data.clients.length - validClients.length;
            console.log(`Clientes válidos: ${validClients.length}, inválidos: ${invalidClients}`);
        }
        
        if (data.sessions) {
            const validSessions = data.sessions.filter(s => s && s.id && s.startTime);
            const invalidSessions = data.sessions.length - validSessions.length;
            console.log(`Sesiones válidas: ${validSessions.length}, inválidas: ${invalidSessions}`);
        }
    });
}

// Ejecutar debug al cargar
console.log('Debug script cargado. Ejecuta debugStorage() para ver el estado.');