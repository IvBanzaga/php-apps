// Configuración de la API
const API_BASE_URL = 'http://localhost/api-mysql-rest-token/framework';

// Variables globales
let currentSection = 'dashboard';
let currentEntity = '';
let currentRecord = null;
let editMode = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
});

// Función para mostrar secciones
function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar sección seleccionada
    document.getElementById(section + '-section').style.display = 'block';
    currentSection = section;
    
    // Cargar datos según la sección
    switch(section) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'productos':
            loadProductos();
            break;
        case 'cuentas':
            loadCuentas();
            break;
        case 'movimientos':
            loadMovimientos();
            break;
        case 'tipos-movimiento':
            loadTiposMovimiento();
            break;
        case 'frecuencias':
            loadFrecuencias();
            break;
    }
}

// Función para cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        // Cargar contadores para cada entidad
        const [clientes, productos, cuentas] = await Promise.all([
            fetch(`${API_BASE_URL}/cliente/clientes`).then(r => r.json()),
            fetch(`${API_BASE_URL}/producto/productos`).then(r => r.json()),
            fetch(`${API_BASE_URL}/cuenta/cuentas`).then(r => r.json())
        ]);
        
        document.getElementById('clientes-count').textContent = clientes.data ? clientes.data.length : 0;
        document.getElementById('productos-count').textContent = productos.data ? productos.data.length : 0;
        document.getElementById('cuentas-count').textContent = cuentas.data ? cuentas.data.length : 0;
        document.getElementById('movimientos-count').textContent = '0'; // Placeholder
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Funciones para cargar datos de cada entidad
async function loadClientes() {
    showLoading('clientes');
    try {
        const response = await fetch(`${API_BASE_URL}/cliente/clientes`);
        const data = await response.json();
        
        if (data.status && data.data) {
            renderClientesTable(data.data);
        } else {
            showAlert('No se pudieron cargar los clientes', 'warning');
        }
    } catch (error) {
        showAlert('Error al cargar clientes: ' + error.message, 'danger');
    } finally {
        hideLoading('clientes');
    }
}

async function loadProductos() {
    showLoading('productos');
    try {
        const response = await fetch(`${API_BASE_URL}/producto/productos`);
        const data = await response.json();
        
        if (data.status && data.data) {
            renderProductosTable(data.data);
        } else {
            showAlert('No se pudieron cargar los productos', 'warning');
        }
    } catch (error) {
        showAlert('Error al cargar productos: ' + error.message, 'danger');
    } finally {
        hideLoading('productos');
    }
}

async function loadCuentas() {
    showLoading('cuentas');
    try {
        const response = await fetch(`${API_BASE_URL}/cuenta/cuentas`);
        const data = await response.json();
        
        if (data.status && data.data) {
            renderCuentasTable(data.data);
        } else {
            showAlert('No se pudieron cargar las cuentas', 'warning');
        }
    } catch (error) {
        showAlert('Error al cargar cuentas: ' + error.message, 'danger');
    } finally {
        hideLoading('cuentas');
    }
}

async function loadMovimientos() {
    showLoading('movimientos');
    try {
        // Por ahora los movimientos se ven desde las cuentas individuales
        hideLoading('movimientos');
        document.getElementById('movimientos-table').querySelector('tbody').innerHTML = 
            '<tr><td colspan="7" class="text-center text-muted"><i class="bi bi-info-circle"></i> Los movimientos se pueden ver desde la sección de Cuentas.<br><small>Funcionalidad de gestión de movimientos en desarrollo.</small></td></tr>';
    } catch (error) {
        showAlert('Error al cargar movimientos: ' + error.message, 'danger');
        hideLoading('movimientos');
    }
}

async function loadTiposMovimiento() {
    showLoading('tipos-movimiento');
    try {
        const response = await fetch(`${API_BASE_URL}/movimiento/tiposMovimiento`);
        const data = await response.json();
        
        if (data.status && data.data) {
            renderTiposMovimientoTable(data.data);
        } else {
            showAlert('No se pudieron cargar los tipos de movimiento', 'warning');
        }
    } catch (error) {
        showAlert('Error al cargar tipos de movimiento: ' + error.message, 'danger');
    } finally {
        hideLoading('tipos-movimiento');
    }
}

async function loadFrecuencias() {
    showLoading('frecuencias');
    try {
        const response = await fetch(`${API_BASE_URL}/frecuencia/frecuencias`);
        const data = await response.json();
        
        if (data.status && data.data) {
            renderFrecuenciasTable(data.data);
        } else {
            showAlert('No se pudieron cargar las frecuencias', 'warning');
        }
    } catch (error) {
        showAlert('Error al cargar frecuencias: ' + error.message, 'danger');
    } finally {
        hideLoading('frecuencias');
    }
}

// Funciones para renderizar tablas
function renderClientesTable(clientes) {
    const tbody = document.getElementById('clientes-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.idcliente}</td>
            <td>${cliente.identificacion}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editRecord('cliente', ${cliente.idcliente})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('cliente', ${cliente.idcliente})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderProductosTable(productos) {
    const tbody = document.getElementById('productos-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.idproducto}</td>
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || '-'}</td>
            <td>Q${parseFloat(producto.precio).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editRecord('producto', ${producto.idproducto})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('producto', ${producto.idproducto})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderCuentasTable(cuentas) {
    const tbody = document.getElementById('cuentas-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    cuentas.forEach(cuenta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cuenta.idcuenta}</td>
            <td>${cuenta.nombre_cuenta}</td>
            <td>${cuenta.numero_cuenta}</td>
            <td>${cuenta.tipo_cuenta}</td>
            <td>${cuenta.banco || '-'}</td>
            <td>Q${parseFloat(cuenta.saldo).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editRecord('cuenta', ${cuenta.idcuenta})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('cuenta', ${cuenta.idcuenta})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderTiposMovimientoTable(tipos) {
    const tbody = document.getElementById('tipos-movimiento-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    tipos.forEach(tipo => {
        const row = document.createElement('tr');
        const tipoTexto = tipo.tipo_movimiento == 1 ? 'Ingreso' : 'Egreso';
        row.innerHTML = `
            <td>${tipo.idtipomovimiento}</td>
            <td>${tipo.movimiento}</td>
            <td><span class="badge bg-${tipo.tipo_movimiento == 1 ? 'success' : 'danger'}">${tipoTexto}</span></td>
            <td>${tipo.descripcion || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editRecord('tipo-movimiento', ${tipo.idtipomovimiento})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('tipo-movimiento', ${tipo.idtipomovimiento})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderFrecuenciasTable(frecuencias) {
    const tbody = document.getElementById('frecuencias-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    frecuencias.forEach(frecuencia => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${frecuencia.idfrecuencia}</td>
            <td>${frecuencia.nombre}</td>
            <td>${frecuencia.dias}</td>
            <td>${frecuencia.descripcion || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editRecord('frecuencia', ${frecuencia.idfrecuencia})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('frecuencia', ${frecuencia.idfrecuencia})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para mostrar modal de CRUD
function showModal(entity, record = null) {
    currentEntity = entity;
    currentRecord = record;
    editMode = record !== null;
    
    const modal = new bootstrap.Modal(document.getElementById('crudModal'));
    const modalTitle = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');
    
    // Configurar título del modal
    modalTitle.textContent = editMode ? `Editar ${entity}` : `Nuevo ${entity}`;
    
    // Generar campos del formulario según la entidad
    formFields.innerHTML = generateFormFields(entity, record);
    
    modal.show();
}

// Función para generar campos del formulario
function generateFormFields(entity, record) {
    let fields = '';
    
    switch(entity) {
        case 'cliente':
            fields = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Identificación *</label>
                            <input type="text" class="form-control" id="identificacion" value="${record?.identificacion || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-control" id="email" value="${record?.email || ''}" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Nombres *</label>
                            <input type="text" class="form-control" id="nombres" value="${record?.nombres || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Apellidos *</label>
                            <input type="text" class="form-control" id="apellidos" value="${record?.apellidos || ''}" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="telefono" value="${record?.telefono || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">NIT</label>
                            <input type="text" class="form-control" id="nit" value="${record?.nit || ''}">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccion" value="${record?.direccion || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Nombre Fiscal</label>
                    <input type="text" class="form-control" id="nom_fiscal" value="${record?.nom_fiscal || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Dirección Fiscal</label>
                    <input type="text" class="form-control" id="dir_fiscal" value="${record?.dir_fiscal || ''}">
                </div>
            `;
            break;
            
        case 'producto':
            fields = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Código *</label>
                            <input type="text" class="form-control" id="codigo" value="${record?.codigo || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Precio *</label>
                            <input type="number" step="0.01" class="form-control" id="precio" value="${record?.precio || ''}" required>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-control" id="nombre" value="${record?.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcion" rows="3">${record?.descripcion || ''}</textarea>
                </div>
            `;
            break;
            
        case 'cuenta':
            fields = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Nombre de Cuenta *</label>
                            <input type="text" class="form-control" id="nombre_cuenta" value="${record?.nombre_cuenta || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Número de Cuenta *</label>
                            <input type="text" class="form-control" id="numero_cuenta" value="${record?.numero_cuenta || ''}" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Tipo de Cuenta *</label>
                            <select class="form-select" id="tipo_cuenta" required>
                                <option value="">Seleccionar...</option>
                                <option value="Corriente" ${record?.tipo_cuenta === 'Corriente' ? 'selected' : ''}>Corriente</option>
                                <option value="Ahorros" ${record?.tipo_cuenta === 'Ahorros' ? 'selected' : ''}>Ahorros</option>
                                <option value="Credito" ${record?.tipo_cuenta === 'Credito' ? 'selected' : ''}>Crédito</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Banco</label>
                            <input type="text" class="form-control" id="banco" value="${record?.banco || ''}">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Saldo Inicial</label>
                    <input type="number" step="0.01" class="form-control" id="saldo" value="${record?.saldo || '0'}">
                </div>
            `;
            break;
            
        case 'tipo-movimiento':
            fields = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Movimiento *</label>
                            <input type="text" class="form-control" id="movimiento" value="${record?.movimiento || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Tipo de Movimiento *</label>
                            <select class="form-select" id="tipo_movimiento" required>
                                <option value="">Seleccionar...</option>
                                <option value="1" ${record?.tipo_movimiento == 1 ? 'selected' : ''}>Ingreso</option>
                                <option value="2" ${record?.tipo_movimiento == 2 ? 'selected' : ''}>Egreso</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcion" rows="3">${record?.descripcion || ''}</textarea>
                </div>
            `;
            break;
            
        case 'frecuencia':
            fields = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Nombre *</label>
                            <input type="text" class="form-control" id="nombre" value="${record?.nombre || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Días *</label>
                            <input type="number" class="form-control" id="dias" value="${record?.dias || ''}" required>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcion" rows="3">${record?.descripcion || ''}</textarea>
                </div>
            `;
            break;
    }
    
    return fields;
}

// Función para guardar registro
async function saveRecord() {
    const form = document.getElementById('crudForm');
    const formData = new FormData(form);
    const data = {};
    
    // Recopilar datos del formulario
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Recopilar datos de campos por ID (para campos sin name)
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id) {
            data[input.id] = input.value;
        }
    });
    
    try {
        let url = '';
        let method = 'POST';
        
        switch(currentEntity) {
            case 'cliente':
                url = editMode ? 
                    `${API_BASE_URL}/cliente/actualizar/${currentRecord.idcliente}` : 
                    `${API_BASE_URL}/cliente/registro`;
                method = editMode ? 'PUT' : 'POST';
                break;
            case 'producto':
                url = editMode ? 
                    `${API_BASE_URL}/producto/actualizar/${currentRecord.idproducto}` : 
                    `${API_BASE_URL}/producto/registro`;
                method = editMode ? 'PUT' : 'POST';
                break;
            case 'cuenta':
                url = editMode ? 
                    `${API_BASE_URL}/cuenta/actualizar/${currentRecord.idcuenta}` : 
                    `${API_BASE_URL}/cuenta/nuevaCuenta`; // Usar el método registro existente
                method = editMode ? 'PUT' : 'POST';
                break;
            case 'frecuencia':
                url = editMode ? 
                    `${API_BASE_URL}/frecuencia/actualizar/${currentRecord.idfrecuencia}` : 
                    `${API_BASE_URL}/frecuencia/registro`;
                method = editMode ? 'PUT' : 'POST';
                break;
            case 'tipo-movimiento':
                url = `${API_BASE_URL}/movimiento/registroTipoMovimiento`;
                method = 'POST'; // Solo creación disponible por ahora
                break;
            // Agregar más casos según sea necesario
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status) {
            showAlert(result.msg || 'Registro guardado exitosamente', 'success');
            bootstrap.Modal.getInstance(document.getElementById('crudModal')).hide();
            
            // Recargar datos de la sección actual
            switch(currentSection) {
                case 'clientes':
                    loadClientes();
                    break;
                case 'productos':
                    loadProductos();
                    break;
                case 'cuentas':
                    loadCuentas();
                    break;
                case 'frecuencias':
                    loadFrecuencias();
                    break;
                case 'tipos-movimiento':
                    loadTiposMovimiento();
                    break;
            }
        } else {
            showAlert(result.msg || 'Error al guardar el registro', 'danger');
        }
        
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'danger');
    }
}

// Función para editar registro
async function editRecord(entity, id) {
    try {
        let url = '';
        
        switch(entity) {
            case 'cliente':
                url = `${API_BASE_URL}/cliente/cliente/${id}`;
                break;
            case 'producto':
                url = `${API_BASE_URL}/producto/producto/${id}`;
                break;
            case 'cuenta':
                url = `${API_BASE_URL}/cuenta/cuenta/${id}`;
                break;
            case 'tipo-movimiento':
                // Por ahora no disponible, mostrar mensaje
                showAlert('Funcionalidad de edición en desarrollo para tipos de movimiento', 'info');
                return;
            case 'frecuencia':
                url = `${API_BASE_URL}/frecuencia/frecuencia/${id}`;
                break;
            // Agregar más casos según sea necesario
        }
        
        if (!url) {
            showAlert('Funcionalidad no disponible para esta entidad', 'warning');
            return;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status && result.data) {
            showModal(entity, result.data);
        } else {
            showAlert('No se pudo cargar el registro para editar', 'warning');
        }
        
    } catch (error) {
        showAlert('Error al cargar el registro: ' + error.message, 'danger');
    }
}

// Función para eliminar registro
async function deleteRecord(entity, id) {
    if (!confirm('¿Está seguro de que desea eliminar este registro?')) {
        return;
    }
    
    try {
        let url = '';
        
        switch(entity) {
            case 'cliente':
                url = `${API_BASE_URL}/cliente/eliminar/${id}`;
                break;
            case 'producto':
                url = `${API_BASE_URL}/producto/eliminar/${id}`;
                break;
            // Agregar más casos según sea necesario
        }
        
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status) {
            showAlert(result.msg || 'Registro eliminado exitosamente', 'success');
            
            // Recargar datos de la sección actual
            switch(currentSection) {
                case 'clientes':
                    loadClientes();
                    break;
                case 'productos':
                    loadProductos();
                    break;
            }
        } else {
            showAlert(result.msg || 'Error al eliminar el registro', 'danger');
        }
        
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'danger');
    }
}

// Funciones de utilidad
function showLoading(entity) {
    document.getElementById(entity + '-loading').style.display = 'block';
}

function hideLoading(entity) {
    document.getElementById(entity + '-loading').style.display = 'none';
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertId = 'alert-' + Date.now();
    
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}