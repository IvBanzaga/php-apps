document.addEventListener('DOMContentLoaded', () => {

    const typeEl = document.getElementById('compactType');
    const descEl = document.getElementById('compactDescription');
    const timerEl = document.getElementById('compactDuration');
    const noActivityEl = document.getElementById('noActivity');
    const startBtn = document.getElementById('startQuickSessionBtn');
    const dashboardBtn = document.getElementById('viewDashboardBtn');
    const sessionControls = document.getElementById('sessionControls');
    const pauseBtn = document.getElementById('pauseSessionBtn');
    const resumeBtn = document.getElementById('resumeSessionBtn');
    const endBtn = document.getElementById('endSessionBtn');

    let currentSession = null;
    let breakInfo = null;
    let timerInterval;

    // Actualizar vista según estado
    function updateView() {
        if (breakInfo) {
            noActivityEl.style.display = 'none';
            typeEl.textContent = '☕ Descanso';
            descEl.textContent = `Duración: ${breakInfo.duration} min`;
            startBreakTimer();
            sessionControls.style.display = 'none';
        } else if (currentSession) {
            noActivityEl.style.display = 'none';
            typeEl.textContent = currentSession.type || '';
            descEl.textContent = currentSession.description || '';
            startSessionTimer();
            sessionControls.style.display = 'flex';
            // Mostrar/ocultar botones según estado
            if (currentSession.isPaused) {
                pauseBtn.style.display = 'none';
                resumeBtn.style.display = 'inline-block';
            } else {
                pauseBtn.style.display = 'inline-block';
                resumeBtn.style.display = 'none';
            }
            endBtn.style.display = 'inline-block';
        } else {
            noActivityEl.style.display = 'block';
            typeEl.textContent = '';
            descEl.textContent = '';
            timerEl.textContent = '0m 00s';
            if (timerInterval) clearInterval(timerInterval);
            sessionControls.style.display = 'none';
        }
    }

    // Temporizador para sesión activa
    function startSessionTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!currentSession) return;
            let elapsed = currentSession.initialDuration || 0;
            if (!currentSession.isPaused && currentSession.startTime) {
                elapsed += Date.now() - currentSession.startTime;
            }
            const totalSeconds = Math.floor(elapsed / 1000);
            timerEl.textContent = formatDuration(totalSeconds);
        }, 1000);
    }

    // Temporizador para descanso
    function startBreakTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!breakInfo) return;
            const remainingMs = Math.max(0, (breakInfo.endTime || 0) - Date.now());
            const totalSeconds = Math.floor(remainingMs / 1000);
            timerEl.textContent = formatDuration(totalSeconds);
            if (remainingMs <= 0) {
                clearInterval(timerInterval);
                timerEl.textContent = '0m 00s';
            }
        }, 1000);
    }

    // Formatear duración en mm:ss
    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds.toString().padStart(2,'0')}s`;
    }

    // Al cargar popup, pedir estado actual al background
    chrome.runtime.sendMessage({ action: 'checkState' }, (response) => {
        currentSession = response?.currentSession || null;
        breakInfo = response?.breakInfo || null;
        updateView();
    });

    // Botón de iniciar sesión
    startBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'showInitialModal' });
        window.close();
    });

    dashboardBtn.addEventListener('click', () => {
    window.open(chrome.runtime.getURL('dashboard.html'), '_blank');
    window.close();
    });

    // Botón pausar sesión
    pauseBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'pauseSession' }, () => {
            // Actualizar estado tras pausar
            chrome.runtime.sendMessage({ action: 'checkState' }, (response) => {
                currentSession = response?.currentSession || null;
                breakInfo = response?.breakInfo || null;
                updateView();
            });
        });
    });

    // Botón reanudar sesión
    resumeBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'resumeSession' }, () => {
            chrome.runtime.sendMessage({ action: 'checkState' }, (response) => {
                currentSession = response?.currentSession || null;
                breakInfo = response?.breakInfo || null;
                updateView();
            });
        });
    });

    // Botón finalizar sesión
    endBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'endSession' }, () => {
            chrome.runtime.sendMessage({ action: 'checkState' }, (response) => {
                currentSession = response?.currentSession || null;
                breakInfo = response?.breakInfo || null;
                updateView();
            });
        });
    });
});
