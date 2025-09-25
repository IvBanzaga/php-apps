// options.js - Lógica de la página de opciones
class OptionsPage {
  constructor() {
    this.clients = [];
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadClients();
    this.setupEventListeners();
    this.updateClientsList();
  }

  async loadSettings() {
    try {
      const { config } = await chrome.storage.local.get('config');
      if (config) {
        document.getElementById('validationInterval').value = config.validationInterval || 60;
        document.getElementById('askOnBrowserStart').checked = config.askOnBrowserStart !== false;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async loadClients() {
    try {
      // wrap sendMessage in a Promise to use await reliably
      const response = await new Promise(resolve => chrome.runtime.sendMessage({ action: 'getClients' }, resolve));
      const rawClients = response || [];

      // Sanitize clients: allow legacy values (strings or nulls) and normalize to objects {id, name}
      const cleanClients = [];
      let changed = false;
      for (const c of rawClients) {
        if (!c) {
          changed = true; // remove falsy entries
          continue;
        }
        if (typeof c === 'string') {
          // convert legacy string entry to object
          cleanClients.push({ id: `client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, name: c });
          changed = true;
          continue;
        }
        if (typeof c === 'object' && c.name) {
          if (!c.id) {
            c.id = `client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
            changed = true;
          }
          cleanClients.push(c);
          continue;
        }
        // otherwise skip invalid entry
        changed = true;
      }

      this.clients = cleanClients;

      // Persist corrected clients back to storage to avoid repeated warnings
      if (changed) {
        chrome.storage.local.set({ clients: this.clients }, () => {
          console.log('Clients sanitized and saved');
        });
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      this.clients = [];
    }
  }

  setupEventListeners() {
    document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetData());
    document.getElementById('addClientBtn').addEventListener('click', () => this.addClient());
  }

  updateClientsList() {
    const container = document.getElementById('clientsList');
    container.innerHTML = '';

    if (this.clients.length === 0) {
      container.innerHTML = '<p style="color: #666; font-style: italic;">No hay clientes registrados</p>';
      return;
    }

    this.clients.forEach(client => {
      // Verificar que el cliente no sea null y tenga las propiedades necesarias
      if (!client || !client.name || !client.id) {
        console.warn('Cliente inválido encontrado en options:', client);
        return;
      }
      
      const clientEl = document.createElement('div');
      clientEl.className = 'client-item';
      clientEl.innerHTML = `
        <span class="client-name">${client.name}</span>
        <button class="delete-btn" data-id="${client.id}">Eliminar</button>
      `;

      clientEl.querySelector('.delete-btn').addEventListener('click', () => this.deleteClient(client.id));

      container.appendChild(clientEl);
    });
  }

  async saveSettings() {
    const validationInterval = parseInt(document.getElementById('validationInterval').value);
    const askOnBrowserStart = document.getElementById('askOnBrowserStart').checked;

    if (validationInterval < 5 || validationInterval > 480) {
      this.showStatus('El intervalo debe estar entre 5 y 480 minutos', 'error');
      return;
    }

    try {
      await chrome.storage.local.set({
        config: {
          validationInterval,
          askOnBrowserStart
        }
      });

      this.showStatus('Configuración guardada correctamente', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error al guardar la configuración', 'error');
    }
  }

  async addClient() {
    const input = document.getElementById('newClientName');
    const clientName = input.value.trim();

    if (!clientName) {
      this.showStatus('Por favor ingresa un nombre para el cliente', 'error');
      return;
    }

    try {
      console.debug('options.addClient sending message for', clientName);
      const response = await new Promise(resolve => chrome.runtime.sendMessage({ action: 'addClient', clientName }, resolve));
      console.debug('options.addClient response', response);
      if (response && response.success) {
        input.value = '';
        await this.loadClients();
        this.updateClientsList();
        this.showStatus('Cliente agregado correctamente', 'success');
      } else {
        this.showStatus('Error al agregar el cliente: ' + (response?.error || 'error'), 'error');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      this.showStatus('Error al agregar el cliente', 'error');
    }
  }

  async deleteClient(clientId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'deleteClient',
        clientId
      });

      if (response && response.success) {
        await this.loadClients();
        this.updateClientsList();
        this.showStatus('Cliente eliminado correctamente', 'success');
      } else {
        this.showStatus('Error al eliminar el cliente', 'error');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      this.showStatus('Error al eliminar el cliente', 'error');
    }
  }

  async resetData() {
    if (!confirm('¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await chrome.storage.local.clear();
      await chrome.runtime.sendMessage({ action: 'resetData' });

      // Recargar la página para reflejar los cambios
      location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
      this.showStatus('Error al restablecer los datos', 'error');
    }
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}
