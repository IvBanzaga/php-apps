// background.js - Service Worker para TimeSession (versión con debug)

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['sessions', 'clients', '__backup_sessions', '__backup_clients'], (data) => {
        let needRestore = false;
        const restoreObj = {};

        if ((!data.sessions || data.sessions.length === 0) && data.__backup_sessions?.length) {
            restoreObj.sessions = data.__backup_sessions;
            needRestore = true;
        }

        if ((!data.clients || data.clients.length === 0) && data.__backup_clients?.length) {
            restoreObj.clients = data.__backup_clients;
            needRestore = true;
        }

        if (needRestore) {
            chrome.storage.local.set(restoreObj, () => {
                console.log('TimeSession: Storage restaurado desde backup');
            });
        }
    });
});


// Inicialización
chrome.runtime.onInstalled.addListener(() => {
    console.log('TimeSession Background: Extension instalada/actualizada');
    chrome.alarms.create('updateIconAlarm', { periodInMinutes: 1 });
});

// Log de storage al arrancar el worker
chrome.storage.local.get(null, (data) => {
    console.log('TimeSession Background: Storage al arrancar worker:', JSON.stringify(data));
    if (data.sessions) {
        console.log('TimeSession Background: Sesiones al arrancar:', JSON.stringify(data.sessions));
    }
});

// Mensajería
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('TimeSession Background: Mensaje recibido', request);

    if (!request?.action) {
        console.log('TimeSession Background: No hay action en el request');
        return;
    }

    // Mapeo de acciones
    const map = {
        deleteClient,
        startSession: function(request, sendResponse) {
            startSession(request, sendResponse);
            return true;
        },
        pauseSession,
        resumeSession,
        endSession,
        startBreak,
        endBreak,
        deleteSession,
        resetData,
        continueSession: () => resetValidationAlarm(),
        showInitialModal: () => showModalInActiveTab('showInitialModal'),
        showBreakModal: () => showModalInActiveTab('showBreakModal'),
        checkState: () => checkState(sendResponse),
        openDashboard: () => openDashboard()
    };
// Abrir dashboard.html en una nueva pestaña
function openDashboard() {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
}

    // Acciones que requieren sendResponse asíncrono explícito
    if (request.action === 'addClient') {
        console.log('TimeSession Background: Procesando addClient');
        addClient(request, sendResponse);
        return true; // << Importante para respuestas asíncronas
    }

    if (request.action === 'getClients') {
        console.log('TimeSession Background: Procesando getClients');
        chrome.storage.local.get('clients', ({ clients = [] }) => {
            console.log('TimeSession Background: Enviando clientes:', clients);
            sendResponse(clients);
        });
        return true; // << Importante para respuestas asíncronas
    }

    // Acciones con manejo directo
    if (map[request.action]) {
        try {
            console.log(`TimeSession Background: Ejecutando ${request.action}`);
            const result = map[request.action](request, sendResponse);
            // Si la función maneja asíncrono, debe retornar true
            if (result === true) return true;
        } catch (err) {
            console.error(`TimeSession Background: Error ejecutando ${request.action}:`, err);
            if (sendResponse) sendResponse({ success: false, error: String(err) });
        }
    } else {
        console.log(`TimeSession Background: Acción no reconocida: ${request.action}`);
    }
});

// Alarmas
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('TimeSession Background: Alarma disparada:', alarm.name);
    if (!alarm) return;
    if (alarm.name === 'sessionValidation') {
        console.log('TimeSession Background: Mostrando modal de validación');
        showModalInActiveTab('showValidationModal');
    } else if (alarm.name === 'breakOver') {
        console.log('TimeSession Background: Descanso terminado');
        endBreak();
        showModalInActiveTab('showInitialModal');
    } else if (alarm.name === 'updateIconAlarm') {
        updateIcon();
    }
});

// Listener para cuando se abren nuevas pestañas
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('TimeSession Background: Nueva pestaña activada:', activeInfo.tabId);
    // Pequeño delay para asegurar que el content script se haya cargado
    setTimeout(() => {
        checkAndShowModalIfNeeded(activeInfo.tabId);
    }, 500);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        console.log('TimeSession Background: Página cargada completamente:', tab.url);
        setTimeout(() => {
            checkAndShowModalIfNeeded(tabId);
        }, 1000);
    }
});

// Función auxiliar para verificar si mostrar modal
function checkAndShowModalIfNeeded(tabId) {
    chrome.storage.local.get(['currentSession', 'breakInfo'], (data) => {
        console.log('TimeSession Background: Estado actual para nueva pestaña:', data);
        
        // Si no hay sesión activa ni descanso, mostrar modal
        if (!data.currentSession && !data.breakInfo) {
            console.log('TimeSession Background: No hay sesión activa, enviando showInitialModal a pestaña', tabId);
            chrome.tabs.sendMessage(tabId, { action: 'showInitialModal' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('TimeSession Background: Error enviando mensaje a pestaña (normal si no hay content script):', chrome.runtime.lastError.message);
                }
            });
        }
    });
}

// ------------------ Storage normalization ------------------
function normalizeStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['clients', 'sessions', 'currentSession', 'breakInfo', 'config'], (data) => {
            console.log('TimeSession Background: Normalizando storage:', data);
            const rawClients = data.clients || [];
            const cleanClients = rawClients.reduce((acc, c) => {
                if (!c) return acc;
                if (typeof c === 'string') acc.push({ id: `client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, name: c });
                else if (typeof c === 'object' && c.name) acc.push({ id: c.id || `client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, name: c.name });
                return acc;
            }, []);
            // Solo limpiar clientes, nunca modificar ni filtrar sesiones
            chrome.storage.local.set({
                clients: cleanClients
            }, () => resolve());
        });
    });
}

function deleteClient({ clientId }, sendResponse) {
    chrome.storage.local.get('clients', ({ clients = [] }) => {
        const updated = (clients || []).filter(c => c && c.id !== clientId);
        chrome.storage.local.set({ clients: updated }, () => {
            console.log('TimeSession Background: Cliente eliminado');
            backupStorage();
            if (sendResponse) sendResponse({ success: true, clients: updated });
        });
    });
}

// ------------------ Data reset ------------------
function resetData(request, sendResponse) {
    console.log('TimeSession Background: Reseteando datos');
    chrome.storage.local.clear(() => {
        chrome.storage.local.set({ clients: [], sessions: [], currentSession: null, breakInfo: null, config: { validationInterval: 60 } }, () => {
            updateIcon();
            if (sendResponse) sendResponse({ success: true });
        });
    });
}

// ------------------ Session lifecycle ------------------
function startSession({ session }, sendResponse) {
    console.log('TimeSession Background: startSession llamado con:', session);
    try {
        endBreak(); // Terminar descanso si existe
        const newSession = { 
            ...session, 
            id: `sess_${Date.now()}`, 
            isPaused: false, 
            initialDuration: 0, 
            pauseTime: null, 
            startTime: Date.now() 
        };
        
        chrome.storage.local.set({ currentSession: newSession }, () => {
            if (chrome.runtime.lastError) {
                console.error('TimeSession Background: Error guardando currentSession:', chrome.runtime.lastError);
                if (sendResponse) sendResponse({ success: false, error: chrome.runtime.lastError.message });
                return;
            }
            resetValidationAlarm();
            updateIcon();
            console.log('TimeSession Background: Sesión iniciada correctamente:', newSession);
            if (sendResponse) sendResponse({ success: true, currentSession: newSession });
        });
    } catch (err) {
        console.error('TimeSession Background: Excepción en startSession:', err);
        if (sendResponse) sendResponse({ success: false, error: String(err) });
    }
}

function pauseSession() {
    console.log('TimeSession Background: pauseSession');
    chrome.storage.local.get('currentSession', ({ currentSession }) => {
        if (currentSession && !currentSession.isPaused) {
            const elapsed = currentSession.startTime ? (Date.now() - currentSession.startTime) : 0;
            currentSession.initialDuration = (currentSession.initialDuration || 0) + elapsed;
            currentSession.isPaused = true;
            currentSession.pauseTime = Date.now();
            currentSession.startTime = null;
            chrome.storage.local.set({ currentSession }, updateIcon);
            console.log('TimeSession Background: Sesión pausada');
        }
    });
}

function resumeSession() {
    console.log('TimeSession Background: resumeSession');
    chrome.storage.local.get('currentSession', ({ currentSession }) => {
        if (currentSession && currentSession.isPaused) {
            currentSession.isPaused = false;
            currentSession.startTime = Date.now();
            currentSession.pauseTime = null;
            chrome.storage.local.set({ currentSession }, updateIcon);
            console.log('TimeSession Background: Sesión reanudada');
        }
    });
}

function endSession() {
    console.log('TimeSession Background: endSession');
    chrome.storage.local.get(['currentSession', 'sessions'], (data) => {
        const currentSession = data.currentSession;
        let sessions = Array.isArray(data.sessions) ? [...data.sessions] : [];
        if (!currentSession) {
            console.warn('TimeSession Background: No hay sesión actual para finalizar');
            return;
        }
        let finalDuration = currentSession.initialDuration || 0;
        if (!currentSession.isPaused && currentSession.startTime) finalDuration += (Date.now() - currentSession.startTime);
        const finalSession = { ...currentSession, endTime: Date.now(), duration: finalDuration };
        // Remove runtime-only fields
        delete finalSession.isPaused; delete finalSession.initialDuration; delete finalSession.pauseTime; delete finalSession.startTime;
        sessions.push(finalSession);
        console.log('TimeSession Background: Array de sesiones antes de guardar:', JSON.stringify(sessions));
        chrome.storage.local.set({ sessions, currentSession: null }, () => {
            chrome.storage.local.get(['sessions'], (d) => {
                console.log('TimeSession Background: Array de sesiones después de guardar:', JSON.stringify(d.sessions));
                if (!d.sessions || d.sessions.length === 0) {
                    console.error('TimeSession Background: ¡Error! La sesión no se guardó correctamente.');
                } else {
                    console.log('TimeSession Background: Sesión guardada correctamente. Total sesiones:', d.sessions.length);
                }
            });
            chrome.alarms.clear('sessionValidation');
            backupStorage();
            updateIcon();
            console.log('TimeSession Background: Sesión terminada y guardada');
        });
    });
}

function startBreak({ minutes }, sendResponse) {
    console.log('TimeSession Background: startBreak con minutos:', minutes);
    endSession(); // Terminar sesión activa si existe
    const mins = typeof minutes === 'number' && minutes > 0 ? minutes : 15;
    const breakInfo = { endTime: Date.now() + mins * 60000, duration: mins };
    chrome.storage.local.set({ breakInfo }, () => {
        chrome.alarms.create('breakOver', { delayInMinutes: mins });
        updateIcon();
        console.log('TimeSession Background: Descanso iniciado:', breakInfo);
        if (sendResponse) sendResponse({ success: true, breakInfo });
    });
}

function endBreak() {
    console.log('TimeSession Background: endBreak');
    chrome.storage.local.set({ breakInfo: null }, () => {
        chrome.alarms.clear('breakOver');
        updateIcon();
        console.log('TimeSession Background: Descanso terminado');
    });
}

function deleteSession({ sessionId }, sendResponse) {
    chrome.storage.local.get('sessions', ({ sessions = [] }) => {
        const filtered = (sessions || []).filter(s => s.id !== sessionId);
        chrome.storage.local.set({ sessions: filtered }, () => {
            console.log('TimeSession Background: Sesión eliminada');
            if (sendResponse) sendResponse({ success: true });
        });
    });
}

// ------------------ Helpers ------------------
function getFromStorage(key, sendResponse) {
    chrome.storage.local.get(key, (data) => sendResponse(data[key] || []));
}

function checkState(sendResponse) {
    chrome.storage.local.get(['currentSession', 'breakInfo'], (data) => {
        console.log('TimeSession Background: checkState resultado:', data);
        sendResponse({
            currentSession: data.currentSession || null,
            breakInfo: data.breakInfo || null,
            shouldShowInitial: !data.currentSession && !data.breakInfo
        });
    });
    return true; // Para mantener el canal de respuesta abierto
}

function resetValidationAlarm() {
    chrome.storage.local.get('config', ({ config = {} }) => {
        const interval = (config && config.validationInterval) || 60;
        chrome.alarms.clear('sessionValidation');
        chrome.alarms.create('sessionValidation', { delayInMinutes: interval });
        console.log(`TimeSession Background: Alarma de validación configurada para ${interval} minutos`);
    });
}

function showModalInActiveTab(action) {
    console.log('TimeSession Background: showModalInActiveTab:', action);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) {
            console.log('TimeSession Background: No hay pestaña activa');
            return;
        }
        const url = tabs[0].url || '';
        if (url.startsWith('chrome://') || url.startsWith('https://chrome.google.com')) {
            console.log('TimeSession Background: Pestaña es de sistema, no enviar mensaje');
            return;
        }
        console.log('TimeSession Background: Enviando mensaje a pestaña:', tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('TimeSession Background: Error enviando mensaje (normal):', chrome.runtime.lastError.message);
            }
        });
    });
}

function updateIcon() {
    chrome.storage.local.get(['currentSession', 'breakInfo'], (data) => {
        const cs = data && data.currentSession;
        const bi = data && data.breakInfo;
        if (cs) {
            let elapsedMs = cs.initialDuration || 0;
            if (!cs.isPaused && cs.startTime) elapsedMs += (Date.now() - cs.startTime);
            const elapsedMinutes = Math.floor(elapsedMs / 60000);
            chrome.action.setBadgeText({ text: `${elapsedMinutes}m` });
            chrome.action.setBadgeBackgroundColor({ color: cs.isPaused ? '#FFA500' : '#4CAF50' });
        } else if (bi) {
            const remainingMs = Math.max(0, (bi.endTime || 0) - Date.now());
            const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));
            chrome.action.setBadgeText({ text: `${remainingMinutes}m` });
            chrome.action.setBadgeBackgroundColor({ color: '#FF9800' });
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
    });
}

// Guardar respaldo de datos críticos
function backupStorage() {
    chrome.storage.local.get(['sessions', 'clients'], (data) => {
        chrome.storage.local.set({
            __backup_sessions: data.sessions || [],
            __backup_clients: data.clients || []
        }, () => {
            console.log('TimeSession: Backup de storage guardado');
        });
    });
}


console.log('TimeSession Background: Service Worker cargado');