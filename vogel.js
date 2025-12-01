// ============================================
// MÉTODO DE VOGEL (VAM - Vogel's Approximation Method)
// ============================================
// Este método calcula penalidades (diferencia entre los dos costos
// más bajos) y asigna primero a la celda con mayor penalidad

function metodoVogel(datos) {
    console.log('Ejecutando Método de Vogel (VAM)...');
    
    const m = datos.ofertas.length;  // Número de orígenes
    const n = datos.demandas.length; // Número de destinos
    
    // Copiar datos para no modificar los originales
    let ofertas = [...datos.ofertas];
    let demandas = [...datos.demandas];
    let costos = copiarMatriz(datos.costos);
    
    // Matriz de asignaciones (solución)
    const asignaciones = Array(m).fill(0).map(() => Array(n).fill(0));
    
    // Arrays para marcar filas y columnas eliminadas
    let filasEliminadas = Array(m).fill(false);
    let columnasEliminadas = Array(n).fill(false);
    
    // Mientras haya filas y columnas disponibles
    let iteraciones = 0;
    const maxIteraciones = m * n;
    
    while (!todasEliminadas(filasEliminadas, columnasEliminadas) && iteraciones < maxIteraciones) {
        iteraciones++;
        
        // Calcular penalidades de filas
        const penalidadesFilas = calcularPenalidadesFilas(
            costos, ofertas, demandas, filasEliminadas, columnasEliminadas
        );
        
        // Calcular penalidades de columnas
        const penalidadesColumnas = calcularPenalidadesColumnas(
            costos, ofertas, demandas, filasEliminadas, columnasEliminadas
        );
        
        // Encontrar la máxima penalidad
        const maxPenalidad = encontrarMaximaPenalidad(
            penalidadesFilas, penalidadesColumnas, filasEliminadas, columnasEliminadas
        );
        
        if (maxPenalidad.valor === -Infinity) {
            break;
        }
        
        let i, j;
        
        // Determinar si es penalidad de fila o columna
        if (maxPenalidad.tipo === 'fila') {
            i = maxPenalidad.indice;
            // Encontrar el menor costo en esa fila
            j = encontrarMenorCostoEnFila(
                costos, i, columnasEliminadas
            );
        } else {
            j = maxPenalidad.indice;
            // Encontrar el menor costo en esa columna
            i = encontrarMenorCostoEnColumna(
                costos, j, filasEliminadas
            );
        }
        
        // Realizar la asignación
        const cantidad = Math.min(ofertas[i], demandas[j]);
        asignaciones[i][j] = cantidad;
        
        // Actualizar ofertas y demandas
        ofertas[i] -= cantidad;
        demandas[j] -= cantidad;
        
        // Eliminar fila o columna si se agotó
        if (ofertas[i] === 0) {
            filasEliminadas[i] = true;
        }
        if (demandas[j] === 0) {
            columnasEliminadas[j] = true;
        }
    }
    
    // Calcular costo total
    let costoTotal = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            costoTotal += asignaciones[i][j] * datos.costos[i][j];
        }
    }
    
    console.log('Costo total (Vogel):', costoTotal);
    
    return {
        asignaciones: asignaciones,
        costoTotal: costoTotal,
        metodo: 'Vogel (VAM)'
    };
}

// ============================================
// FUNCIONES AUXILIARES PARA VOGEL
// ============================================

function calcularPenalidadesFilas(costos, ofertas, demandas, filasEliminadas, columnasEliminadas) {
    const m = costos.length;
    const penalidades = Array(m).fill(-Infinity);
    
    for (let i = 0; i < m; i++) {
        if (filasEliminadas[i]) continue;
        
        const costosDisponibles = [];
        for (let j = 0; j < costos[i].length; j++) {
            if (!columnasEliminadas[j] && demandas[j] > 0) {
                costosDisponibles.push(costos[i][j]);
            }
        }
        
        if (costosDisponibles.length >= 2) {
            costosDisponibles.sort((a, b) => a - b);
            penalidades[i] = costosDisponibles[1] - costosDisponibles[0];
        } else if (costosDisponibles.length === 1) {
            penalidades[i] = costosDisponibles[0];
        }
    }
    
    return penalidades;
}

function calcularPenalidadesColumnas(costos, ofertas, demandas, filasEliminadas, columnasEliminadas) {
    const n = costos[0].length;
    const penalidades = Array(n).fill(-Infinity);
    
    for (let j = 0; j < n; j++) {
        if (columnasEliminadas[j]) continue;
        
        const costosDisponibles = [];
        for (let i = 0; i < costos.length; i++) {
            if (!filasEliminadas[i] && ofertas[i] > 0) {
                costosDisponibles.push(costos[i][j]);
            }
        }
        
        if (costosDisponibles.length >= 2) {
            costosDisponibles.sort((a, b) => a - b);
            penalidades[j] = costosDisponibles[1] - costosDisponibles[0];
        } else if (costosDisponibles.length === 1) {
            penalidades[j] = costosDisponibles[0];
        }
    }
    
    return penalidades;
}

function encontrarMaximaPenalidad(penalidadesFilas, penalidadesColumnas, filasEliminadas, columnasEliminadas) {
    let maxPenalidad = -Infinity;
    let maxTipo = null;
    let maxIndice = -1;
    
    // Buscar en filas
    for (let i = 0; i < penalidadesFilas.length; i++) {
        if (!filasEliminadas[i] && penalidadesFilas[i] > maxPenalidad) {
            maxPenalidad = penalidadesFilas[i];
            maxTipo = 'fila';
            maxIndice = i;
        }
    }
    
    // Buscar en columnas
    for (let j = 0; j < penalidadesColumnas.length; j++) {
        if (!columnasEliminadas[j] && penalidadesColumnas[j] > maxPenalidad) {
            maxPenalidad = penalidadesColumnas[j];
            maxTipo = 'columna';
            maxIndice = j;
        }
    }
    
    return {
        valor: maxPenalidad,
        tipo: maxTipo,
        indice: maxIndice
    };
}

function encontrarMenorCostoEnFila(costos, fila, columnasEliminadas) {
    let minCosto = Infinity;
    let minJ = -1;
    
    for (let j = 0; j < costos[fila].length; j++) {
        if (!columnasEliminadas[j] && costos[fila][j] < minCosto) {
            minCosto = costos[fila][j];
            minJ = j;
        }
    }
    
    return minJ;
}

function encontrarMenorCostoEnColumna(costos, columna, filasEliminadas) {
    let minCosto = Infinity;
    let minI = -1;
    
    for (let i = 0; i < costos.length; i++) {
        if (!filasEliminadas[i] && costos[i][columna] < minCosto) {
            minCosto = costos[i][columna];
            minI = i;
        }
    }
    
    return minI;
}

function todasEliminadas(filasEliminadas, columnasEliminadas) {
    const todasFilas = filasEliminadas.every(f => f);
    const todasColumnas = columnasEliminadas.every(c => c);
    return todasFilas || todasColumnas;
}