// TODO: Logica para comprimir y descomprimir
class Nodo {
  constructor(caracter, frecuencia, izquierda = null, derecha = null) {
    this.caracter = caracter;
    this.frecuencia = frecuencia;
    this.izquierda = izquierda;
    this.derecha = derecha;
  }
}

function obtenerNodosFrecuencias(texto) {
  const frecuencias = {};
  for (const char of texto) {
    frecuencias[char] = (frecuencias[char] || 0) + 1;
  }
  return Object.entries(frecuencias).map(([char, freq]) => new Nodo(char, freq));
}

function construirArbolHuffman(texto) {

  let nodos = obtenerNodosFrecuencias(texto);

  while (nodos.length > 1) {

    nodos.sort((a, b) => a.frecuencia - b.frecuencia);

    const izquierda = nodos.shift();
    const derecha = nodos.shift();

    const nuevoNodo = new Nodo(null, izquierda.frecuencia + derecha.frecuencia, izquierda, derecha);
    nodos.push(nuevoNodo);
  }

  return nodos[0];
}

function generarCodigos(nodo, prefijo = '', codigos = {}) {
  if (nodo.caracter !== null) {
    codigos[nodo.caracter] = prefijo;
  } else {
    generarCodigos(nodo.izquierda, prefijo + '0', codigos);
    generarCodigos(nodo.derecha, prefijo + '1', codigos);
  }
  return codigos;
}

function codificarTexto(texto, codigos) {
  return texto.split('').map(char => codigos[char]).join('');
}

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