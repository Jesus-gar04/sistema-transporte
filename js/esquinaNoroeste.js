// ============================================
// MÉTODO DE ESQUINA NOROESTE
// ============================================
// Este método comienza en la celda superior izquierda (esquina noroeste)
// y asigna la máxima cantidad posible, moviéndose hacia la derecha o abajo

function metodoEsquinaNoroeste(datos) {
    console.log('Ejecutando Método de Esquina Noroeste...');
    
    const m = datos.ofertas.length;  // Número de orígenes
    const n = datos.demandas.length; // Número de destinos
    
    // Copiar datos para no modificar los originales
    let ofertas = [...datos.ofertas];
    let demandas = [...datos.demandas];
    
    // Matriz de asignaciones (solución)
    const asignaciones = Array(m).fill(0).map(() => Array(n).fill(0));
    
    // Comenzar desde la esquina noroeste (0, 0)
    let i = 0;  // Índice de fila (origen)
    let j = 0;  // Índice de columna (destino)
    
    // Mientras no hayamos terminado de procesar todas las celdas
    while (i < m && j < n) {
        // Asignar la cantidad mínima entre la oferta disponible y la demanda disponible
        const cantidad = Math.min(ofertas[i], demandas[j]);
        asignaciones[i][j] = cantidad;
        
        // Actualizar oferta y demanda
        ofertas[i] -= cantidad;
        demandas[j] -= cantidad;
        
        // Decidir si moverse a la derecha o hacia abajo
        if (ofertas[i] === 0 && demandas[j] === 0) {
            // Si ambos se agotan, priorizar moverse hacia abajo
            i++;
            j++;
        } else if (ofertas[i] === 0) {
            // Si se agotó la oferta, moverse hacia abajo (siguiente origen)
            i++;
        } else if (demandas[j] === 0) {
            // Si se agotó la demanda, moverse a la derecha (siguiente destino)
            j++;
        }
    }
    
    // Calcular costo total
    let costoTotal = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            costoTotal += asignaciones[i][j] * datos.costos[i][j];
        }
    }
    
    console.log('Costo total (Esquina Noroeste):', costoTotal);
    
    return {
        asignaciones: asignaciones,
        costoTotal: costoTotal,
        metodo: 'Esquina Noroeste'
    };
}

// ============================================
// FUNCIONES AUXILIARES PARA ESQUINA NOROESTE
// ============================================

function verificarSolucionCompleta(ofertas, demandas) {
    const ofertasAgotadas = ofertas.every(o => o === 0);
    const demandasAgotadas = demandas.every(d => d === 0);
    
    return ofertasAgotadas && demandasAgotadas;
}

function mostrarPasoAPaso(asignaciones, paso, i, j, cantidad) {
    console.log(`Paso ${paso}:`);
    console.log(`  Asignando ${cantidad} unidades desde Origen ${i+1} a Destino ${j+1}`);
    console.log(`  Estado actual:`, asignaciones);
}

function generarResumenMetodo(asignaciones, costos, ofertas, demandas) {
    const m = asignaciones.length;
    const n = asignaciones[0].length;
    
    let resumen = {
        asignacionesRealizadas: 0,
        celdasUtilizadas: [],
        costoDetallado: []
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (asignaciones[i][j] > 0) {
                resumen.asignacionesRealizadas++;
                resumen.celdasUtilizadas.push({
                    origen: i + 1,
                    destino: j + 1,
                    cantidad: asignaciones[i][j],
                    costo: costos[i][j],
                    costoTotal: asignaciones[i][j] * costos[i][j]
                });
            }
        }
    }
    
    return resumen;
}

// ============================================
// ANÁLISIS DE SOLUCIÓN
// ============================================

function analizarSolucion(solucion, datos) {
    const analisis = {
        esFactible: true,
        esOptima: false,  // El método de esquina noroeste no garantiza optimalidad
        numeroAsignaciones: 0,
        eficiencia: 0
    };
    
    // Contar asignaciones
    for (let i = 0; i < solucion.asignaciones.length; i++) {
        for (let j = 0; j < solucion.asignaciones[i].length; j++) {
            if (solucion.asignaciones[i][j] > 0) {
                analisis.numeroAsignaciones++;
            }
        }
    }
    
    // Verificar si el número de asignaciones es correcto (m + n - 1)
    const asignacionesEsperadas = datos.ofertas.length + datos.demandas.length - 1;
    analisis.esFactible = (analisis.numeroAsignaciones === asignacionesEsperadas);
    
    return analisis;
}

// ============================================
// COMPARACIÓN DE MÉTODOS
// ============================================

function compararConOtrosMetodos(datos) {
    const resultados = {
        esquinaNoroeste: metodoEsquinaNoroeste(datos),
        costoMinimo: metodoCostoMinimo(datos),
        vogel: metodoVogel(datos)
    };
    
    console.log('Comparación de métodos:');
    console.log('Esquina Noroeste:', resultados.esquinaNoroeste.costoTotal);
    console.log('Costo Mínimo:', resultados.costoMinimo.costoTotal);
    console.log('Vogel:', resultados.vogel.costoTotal);
    
    return resultados;
}