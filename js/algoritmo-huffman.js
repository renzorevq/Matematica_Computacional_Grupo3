// TODO: Logica para comprimir y descomprimir
// Clase Nodo
class Nodo {
  constructor(caracter, frecuencia, izquierda = null, derecha = null) {
    this.caracter = caracter;
    this.frecuencia = frecuencia;
    this.izquierda = izquierda;
    this.derecha = derecha;
  }
}

// Paso 1:
// Obtener las frecuencias de cada caracter
function obtenerNodosFrecuencias(texto) {
  const frecuencias = {};
  for (const char of texto) {
    frecuencias[char] = (frecuencias[char] || 0) + 1;
  }
  return Object.entries(frecuencias).map(([char, freq]) => new Nodo(char, freq));
}

// Paso 2:
// Armar el arbol binario
function construirArbolHuffman(texto) {

  // Frecuencias
  let nodos = obtenerNodosFrecuencias(texto);

  // bucle
  while (nodos.length > 1) {
    // ordenar los nodos de menor a mayor
    nodos.sort((a, b) => a.frecuencia - b.frecuencia);

    // tomamos el nodo izquierda y derecha
    const izquierda = nodos.shift(); 
    const derecha = nodos.shift(); 

    // hacemos un nuevo nodo, sumando las frecuencias
    const nuevoNodo = new Nodo(null, izquierda.frecuencia + derecha.frecuencia, izquierda, derecha);
    nodos.push(nuevoNodo);
  }

  return nodos[0];
}

// Paso 3:
// Generar los codigos
function generarCodigos(nodo, prefijo = '', codigos = {}) {
  if (nodo.caracter !== null) {
    codigos[nodo.caracter] = prefijo;
  } else {
    generarCodigos(nodo.izquierda, prefijo + '0', codigos);
    generarCodigos(nodo.derecha, prefijo + '1', codigos);
  }
  return codigos;
}

// Funcion para imprimir
function codificarTexto(texto, codigos) {
  return texto.split('').map(char => codigos[char]).join('');
}

// Decodificacion
function decodificarTexto(codigoBinario, arbol) {
  let resultado = '';
  let nodo = arbol;

  for (const bit of codigoBinario) {
    nodo = bit === '0' ? nodo.izquierda : nodo.derecha;
    if (nodo.caracter !== null) {
      resultado += nodo.caracter;
      nodo = arbol;
    }
  }

  return resultado;
}