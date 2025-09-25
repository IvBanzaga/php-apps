// validation-popup.js - Lógica del popup de validación de sesión
class ValidationPopup {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('yesBtn').addEventListener('click', () => this.continueSession());
    document.getElementById('noBtn').addEventListener('click', () => this.changeActivity());
  }

  async continueSession() {
    try {
      // Resetear la alarma de validación
      const { config } = await chrome.storage.local.get('config');
      const interval = config?.validationInterval || 60;

      await chrome.alarms.create('sessionValidation', {
        delayInMinutes: interval
      });

      // Cerrar el popup
      window.close();
    } catch (error) {
      console.error('Error continuing session:', error);
    }
  }

  async changeActivity() {
    try {
      // Finalizar la sesión actual
      await chrome.runtime.sendMessage({ action: 'endSession' });

      // El popup principal se actualizará automáticamente mostrando la vista inicial
      // await chrome.runtime.sendMessage({ action: 'showInitialPopup' });

      // Cerrar el popup de validación
      window.close();
    } catch (error) {
      console.error('Error changing activity:', error);
    }
  }
}

// Inicializar cuando se carga el popup
document.addEventListener('DOMContentLoaded', () => {
  new ValidationPopup();
});