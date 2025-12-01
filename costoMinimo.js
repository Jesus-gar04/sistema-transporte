// ============================================
// MÉTODO DE COSTO MÍNIMO
// ============================================
// Este método asigna primero a las rutas con menor costo
// hasta satisfacer toda la oferta y demanda

function metodoCostoMinimo(datos) {
    console.log('Ejecutando Método de Costo Mínimo...');
    
    const m = datos.ofertas.length;  // Número de orígenes
    const n = datos.demandas.length; // Número de destinos
    
    // Copiar datos para no modificar los originales
    let ofertas = [...datos.ofertas];
    let demandas = [...datos.demandas];
    let costos = copiarMatriz(datos.costos);
    
    // Matriz de asignaciones (solución)
    const asignaciones = Array(m).fill(0).map(() => Array(n).fill(0));
    
    // Contador de celdas asignadas
    let celdasAsignadas = 0;
    const celdasNecesarias = m + n - 1;
    
    // Mientras haya celdas por asignar
    while (celdasAsignadas < celdasNecesarias) {
        // Encontrar la celda con menor costo disponible
        let minCosto = Infinity;
        let minI = -1;
        let minJ = -1;
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (ofertas[i] > 0 && demandas[j] > 0 && costos[i][j] < minCosto) {
                    minCosto = costos[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }
        
        // Si no se encontró celda disponible, salir
        if (minI === -1 || minJ === -1) {
            break;
        }
        
        // Asignar la cantidad mínima entre oferta y demanda
        const cantidad = Math.min(ofertas[minI], demandas[minJ]);
        asignaciones[minI][minJ] = cantidad;
        
        // Actualizar ofertas y demandas
        ofertas[minI] -= cantidad;
        demandas[minJ] -= cantidad;
        
        // Si se agotó la oferta o demanda, marcar la fila o columna
        if (ofertas[minI] === 0) {
            for (let j = 0; j < n; j++) {
                if (asignaciones[minI][j] === 0) {
                    costos[minI][j] = Infinity;
                }
            }
        }
        
        if (demandas[minJ] === 0) {
            for (let i = 0; i < m; i++) {
                if (asignaciones[i][minJ] === 0) {
                    costos[i][minJ] = Infinity;
                }
            }
        }
        
        celdasAsignadas++;
    }
    
    // Calcular costo total
    let costoTotal = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            costoTotal += asignaciones[i][j] * datos.costos[i][j];
        }
    }
    
    console.log('Costo total:', costoTotal);
    
    return {
        asignaciones: asignaciones,
        costoTotal: costoTotal,
        metodo: 'Costo Mínimo'
    };
}

// ============================================
// FUNCIONES AUXILIARES PARA COSTO MÍNIMO
// ============================================

function encontrarMinimoDisponible(costos, ofertas, demandas) {
    let minCosto = Infinity;
    let pos = { i: -1, j: -1 };
    
    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (ofertas[i] > 0 && demandas[j] > 0) {
                if (costos[i][j] < minCosto) {
                    minCosto = costos[i][j];
                    pos = { i, j };
                }
            }
        }
    }
    
    return pos;
}

function verificarFactibilidad(asignaciones, ofertas, demandas) {
    const m = asignaciones.length;
    const n = asignaciones[0].length;
    
    // Verificar ofertas
    for (let i = 0; i < m; i++) {
        let suma = 0;
        for (let j = 0; j < n; j++) {
            suma += asignaciones[i][j];
        }
        if (Math.abs(suma - ofertas[i]) > 0.01) {
            return false;
        }
    }
    
    // Verificar demandas
    for (let j = 0; j < n; j++) {
        let suma = 0;
        for (let i = 0; i < m; i++) {
            suma += asignaciones[i][j];
        }
        if (Math.abs(suma - demandas[j]) > 0.01) {
            return false;
        }
    }
    
    return true;
}