// ============================================
// VARIABLES GLOBALES
// ============================================
let numOrigenes = 3;
let numDestinos = 4;
let historialSoluciones = [];

// ============================================
// GENERACIÓN DE TABLA
// ============================================

function generarTabla() {
    numOrigenes = parseInt(document.getElementById('numOrigenes').value);
    numDestinos = parseInt(document.getElementById('numDestinos').value);
    
    const container = document.getElementById('tablaContainer');
    
    let html = '<table>';
    
    // Encabezado
    html += '<thead><tr>';
    html += '<th>Origen / Destino</th>';
    for (let j = 1; j <= numDestinos; j++) {
        html += `<th>Destino ${j}</th>`;
    }
    html += '<th>Oferta</th>';
    html += '</tr></thead>';
    
    // Cuerpo de la tabla
    html += '<tbody>';
    for (let i = 1; i <= numOrigenes; i++) {
        html += '<tr>';
        html += `<td><strong>Origen ${i}</strong></td>`;
        
        // Costos
        for (let j = 1; j <= numDestinos; j++) {
            html += `<td><input type="number" id="costo_${i}_${j}" 
                     min="0" value="0" placeholder="Costo"></td>`;
        }
        
        // Oferta
        html += `<td><input type="number" id="oferta_${i}" 
                 min="0" value="0" placeholder="Oferta" style="width: 100px;"></td>`;
        html += '</tr>';
    }
    
    // Fila de demanda
    html += '<tr>';
    html += '<td><strong>Demanda</strong></td>';
    for (let j = 1; j <= numDestinos; j++) {
        html += `<td><input type="number" id="demanda_${j}" 
                 min="0" value="0" placeholder="Demanda"></td>`;
    }
    html += '<td></td>';
    html += '</tr>';
    
    html += '</tbody></table>';
    
    container.innerHTML = html;
}

// ============================================
// OBTENER DATOS DE LA TABLA
// ============================================

function obtenerDatos() {
    const datos = {
        costos: [],
        ofertas: [],
        demandas: []
    };
    
    // Obtener costos
    for (let i = 1; i <= numOrigenes; i++) {
        const fila = [];
        for (let j = 1; j <= numDestinos; j++) {
            const valor = parseFloat(document.getElementById(`costo_${i}_${j}`).value) || 0;
            fila.push(valor);
        }
        datos.costos.push(fila);
    }
    
    // Obtener ofertas
    for (let i = 1; i <= numOrigenes; i++) {
        const valor = parseFloat(document.getElementById(`oferta_${i}`).value) || 0;
        datos.ofertas.push(valor);
    }
    
    // Obtener demandas
    for (let j = 1; j <= numDestinos; j++) {
        const valor = parseFloat(document.getElementById(`demanda_${j}`).value) || 0;
        datos.demandas.push(valor);
    }
    
    return datos;
}

// ============================================
// VALIDAR DATOS
// ============================================

function validarDatos(datos) {
    const totalOferta = datos.ofertas.reduce((a, b) => a + b, 0);
    const totalDemanda = datos.demandas.reduce((a, b) => a + b, 0);
    
    if (totalOferta === 0 || totalDemanda === 0) {
        alert('⚠️ Error: Las ofertas y demandas deben ser mayores a cero.');
        return false;
    }
    
    if (Math.abs(totalOferta - totalDemanda) > 0.01) {
        alert(`⚠️ Error: El problema no está balanceado.\n\nTotal Oferta: ${totalOferta}\nTotal Demanda: ${totalDemanda}\n\nLa oferta y la demanda deben ser iguales.`);
        return false;
    }
    
    return true;
}

// ============================================
// RESOLVER PROBLEMA
// ============================================

function resolverProblema(metodo) {
    const datos = obtenerDatos();
    
    if (!validarDatos(datos)) {
        return;
    }
    
    let solucion;
    
    try {
        // Llamar al método correspondiente
        switch (metodo) {
            case 'costoMinimo':
                solucion = metodoCostoMinimo(datos);
                break;
            case 'vogel':
                solucion = metodoVogel(datos);
                break;
            case 'esquinaNoroeste':
                solucion = metodoEsquinaNoroeste(datos);
                break;
            default:
                alert('⚠️ Error: Método no seleccionado.');
                return;
        }
        
        // Agregar timestamp y datos originales
        solucion.timestamp = new Date();
        solucion.datosOriginales = JSON.parse(JSON.stringify(datos));
        
        // Guardar en historial
        historialSoluciones.push(solucion);
        
        // Mostrar resultado actual
        mostrarResultadoActual(solucion);
        
        // Actualizar historial
        actualizarHistorial();
        
    } catch (error) {
        alert('⚠️ Error al resolver el problema: ' + error.message);
        console.error(error);
    }
}

// ============================================
// MOSTRAR RESULTADO ACTUAL
// ============================================

function mostrarResultadoActual(solucion) {
    const container = document.getElementById('solucionContainer');
    const costoTotalDiv = document.getElementById('costoTotal');
    const metodoDiv = document.getElementById('metodoUtilizado');
    
    // Mostrar método utilizado
    metodoDiv.innerHTML = `<strong>Método:</strong> ${solucion.metodo}`;
    metodoDiv.className = 'metodo-utilizado';
    
    let html = '<table>';
    html += '<thead><tr>';
    html += '<th>Origen</th>';
    for (let j = 1; j <= numDestinos; j++) {
        html += `<th>Destino ${j}</th>`;
    }
    html += '</tr></thead>';
    
    html += '<tbody>';
    for (let i = 0; i < numOrigenes; i++) {
        html += '<tr>';
        html += `<td><strong>Origen ${i + 1}</strong></td>`;
        for (let j = 0; j < numDestinos; j++) {
            const asignacion = solucion.asignaciones[i][j];
            const estilo = asignacion > 0 ? 
                'background: rgba(193, 39, 45, 0.1); font-weight: bold; color: #C1272D;' : '';
            html += `<td style="${estilo}">${asignacion}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    
    container.innerHTML = html;
    costoTotalDiv.innerHTML = `💰 Costo Total: $${solucion.costoTotal.toFixed(2)}`;
    
    // Mostrar sección de resultados
    document.getElementById('resultadoActual').classList.remove('hidden');
    
    // Scroll suave hacia resultados
    document.getElementById('resultadoActual').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// ============================================
// ACTUALIZAR HISTORIAL
// ============================================

function actualizarHistorial() {
    const historialContainer = document.getElementById('historialResultados');
    const historialContent = document.getElementById('historialContent');
    
    if (historialSoluciones.length === 0) {
        historialContainer.classList.add('hidden');
        return;
    }
    
    historialContainer.classList.remove('hidden');
    
    let html = '';
    
    // Mostrar en orden inverso (más reciente primero)
    for (let i = historialSoluciones.length - 1; i >= 0; i--) {
        const sol = historialSoluciones[i];
        const fecha = sol.timestamp.toLocaleString('es-CO');
        
        html += `
            <div class="historial-item">
                <div class="historial-item-header">
                    <strong>${sol.metodo}</strong>
                    <span class="historial-fecha">${fecha}</span>
                </div>
                <div class="historial-item-body">
                    <span class="historial-costo">Costo: $${sol.costoTotal.toFixed(2)}</span>
                    <button class="btn-small btn-secondary" onclick="verDetalleHistorial(${i})">
                        Ver Detalle
                    </button>
                </div>
            </div>
        `;
    }
    
    historialContent.innerHTML = html;
}

// ============================================
// VER DETALLE DEL HISTORIAL
// ============================================

function verDetalleHistorial(index) {
    const solucion = historialSoluciones[index];
    mostrarResultadoActual(solucion);
}

// ============================================
// TOGGLE HISTORIAL
// ============================================

function toggleHistorial() {
    const content = document.getElementById('historialContent');
    const toggle = document.querySelector('.btn-toggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// ============================================
// LIMPIAR DATOS
// ============================================

function limpiarDatos() {
    // Limpiar todos los inputs de la tabla
    const inputs = document.querySelectorAll('.tabla-container input');
    inputs.forEach(input => input.value = 0);
    
    // Ocultar resultados actuales
    document.getElementById('resultadoActual').classList.add('hidden');
}

// ============================================
// LIMPIAR HISTORIAL
// ============================================

function limpiarHistorial() {
    if (confirm('¿Está seguro de que desea eliminar todo el historial de resultados?')) {
        historialSoluciones = [];
        actualizarHistorial();
    }
}

// ============================================
// UTILIDADES
// ============================================

function copiarMatriz(matriz) {
    return matriz.map(fila => [...fila]);
}

function encontrarMinimo(matriz) {
    let min = Infinity;
    let pos = { i: -1, j: -1 };
    
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] !== null && matriz[i][j] < min) {
                min = matriz[i][j];
                pos = { i, j };
            }
        }
    }
    
    return pos;
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Programación Lineal - Universidad Libre de Colombia');
    console.log('Sistema cargado correctamente ✓');
    generarTabla();
});