const texto = "Matematica Computacional"
const codigos = {
    "p": "0000",
    "u": "0001",
    "n": "0010",
    "l": "0011",
    "a": "01",
    "t": "100",
    "m": "1010",
    "i": "1011",
    "c": "1100",
    "o": "1101",
    "M": "11100",
    "e": "11101",
    " ": "11110",
    "C": "11111"
}
const textoCodificado = "111000110011101101001100101111000111110111111101101000000001100011100101111010010010011";
const textoDecodificado = "Matematica Computacional"

const areaArchivo = document.getElementById("lbl_dropzone");
const txtArchivo = document.getElementById("btn_file");
const btnComprimir = document.getElementById("btn_comprimir");
const btnDescargarBinario = document.getElementById('btn_descargar_binario');
const txtTextoEntrada = document.getElementById("txt_texto_entrada");
const txtBinarioSalida = document.getElementById("txt_binario_salida");
const txt_binario = document.getElementById('txt_binario');
const contenedor = document.getElementById("file_preview_container");
const dropContent = document.getElementById("drop_content");

const tblFrecuencia = document.getElementById("tbl_frecuencia");
//const tblFrecuenciaBody = tblFrecuencia.tBodies[0];

document.addEventListener("DOMContentLoaded", function (e) {

    iniciarEventos();

});

const iniciarEventos = () => {
    areaArchivo.addEventListener("dragover", fnDragOver, false);
    areaArchivo.addEventListener("dragenter", fnDragEnter);
    areaArchivo.addEventListener("dragleave", fnDragLeave);
    areaArchivo.addEventListener("drop", fnDrop);
    btnComprimir.addEventListener("click", fnComprimirTexto);
    btnDescargarBinario.addEventListener("click", () => {
        if (!fnEsTextoBinarioValido())
            return Toastify({
                text: "El texto binario esta vacio",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#717729",
                close: true
            }).showToast();

        fnAbrirModal();
    });
    txtArchivo.addEventListener("change", fnMostrarArchivo);
    // document.getElementById("switchModo").addEventListener("change", function () {
    //     if (this.checked) {
    //       console.log("Modo Manual");
    //       // Mostrar sección de entrada manual
    //     } else {
    //       console.log("Modo Archivo");
    //       // Mostrar sección de archivo
    //     }
    //   });

}

const fnDragOver = (e) => {
    e.preventDefault();
}

const fnDragEnter = (e) => {
    fnDragActive(true);
}

const fnDragLeave = (e) => {
    fnDragActive(false);
}

const fnDrop = (e) => {
    e.preventDefault();
    fnDragActive(false);
    txtArchivo.files = e.dataTransfer.files;
}

const fnDragActive = (isActive) => {
    isActive ? areaArchivo.classList.add("drag-active") : areaArchivo.classList.remove("drag-active");
}

const fnComprimirTexto = (e) => {

    if (!fnEsTextoValido())
        return Toastify({
            text: "El texto esta vacio",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#717729",
            close: true
        }).showToast();

    const texto = txtTextoEntrada.value;

    let ltNodos = obtenerNodosFrecuencias(texto);
    let oArbol = construirArbolHuffman(texto);

    //tblFrecuenciaBody.innerHTML = fnHtmlTablaFrecuencia(ltNodos);

    const oCodificacion = generarCodigos(oArbol);
    const maxKeyLength = Math.max(...Object.keys(oCodificacion).map(k => (k != ` ` && k != `\n` ? k : (k == ` ` ? 'espacio' : 'enter')).length));
    const formattedText = Object.entries(oCodificacion)
        // .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${(key != ` ` && key != `\n` ? key.padEnd(maxKeyLength, ' ') : (key == ` ` ? 'espacio' : 'enter  '))}: "${value}"`)
        .join('\n\t\t');
    console.log(oCodificacion);
    txtBinarioSalida.value = codificarTexto(texto, oCodificacion) + '\n\n';
    txtBinarioSalida.value += '\tDetalle: \n\t\t'
    txtBinarioSalida.value += formattedText;
}

const fnHtmlTablaFrecuencia = (ltDatos) => {
    let html = '';

    ltDatos.forEach(nodo => {
        html += '<tr>'
        html += '   <td>' + nodo.caracter + '</td>'
        html += '   <td>' + nodo.frecuencia + '</td>'
        html += '</tr>'
    });

    return html;
}

const fnDescargarArchivoBinario = () => {

    if (!fnEsTextoBinarioValido())
        return Toastify({
            text: "El texto binario esta vacio",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#717729",
            close: true
        }).showToast();

    const oArbol = construirArbolHuffman(txtTextoEntrada.value);
    const oCodificacion = generarCodigos(oArbol);
    const nombre = document.getElementById('txtNombreArchivo').value || 'texto_comprimido';
    const extension = document.getElementById('txtExtension').value.replace('.', '');

    const data = {
        binario: codificarTexto(txtTextoEntrada.value, oCodificacion),
        arbol: oArbol
    }
    const base64 = btoa(JSON.stringify(data));

    fnDescargarArchivo(base64, nombre, extension);
    fnCerrarModal();
}

function nodoAD3(nodo, lado = '') {
    if (!nodo) return null;

    const nombre = nodo.caracter !== null
        ? `${nodo.caracter} (${nodo.frecuencia})`
        : `${nodo.frecuencia}`;

    const resultado = { name: nombre };

    if (nodo.izquierda || nodo.derecha) {
        resultado.children = [];
        if (nodo.izquierda) {
            const hijoIzq = nodoAD3(nodo.izquierda, '0');
            hijoIzq.edgeLabel = '0';
            resultado.children.push(hijoIzq);
        }
        if (nodo.derecha) {
            const hijoDer = nodoAD3(nodo.derecha, '1');
            hijoDer.edgeLabel = '1';
            resultado.children.push(hijoDer);
        }
    }

    return resultado;
}

const fnBorrarTexto = () => {
    txtBinarioSalida.value = '';
    txtTextoEntrada.value = '';
    txtTextoEntrada.focus();
}

const fnCopiarTexto = () => {
    if (!fnEsTextoValido())
        return Toastify({
            text: "El texto esta vacio",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#717729",
            close: true
        }).showToast();

    navigator.clipboard.writeText(txtTextoEntrada.value)
        .then(() => {
            Toastify({
                text: "El texto fue copiado con exito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "green",
                close: true
            }).showToast();
        })
        .catch(() => {
            Toastify({
                text: "Error al copiar",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#D9534F",
                close: true
            }).showToast();
        });
}

const fnCopiarBinario = () => {

    if (!fnEsTextoBinarioValido())
        return Toastify({
            text: "El texto binario esta vacio",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#717729",
            close: true
        }).showToast();

    const texto = txtTextoEntrada.value;
    const oArbol = construirArbolHuffman(texto);
    const oCodificacion = generarCodigos(oArbol);
    navigator.clipboard
        .writeText(codificarTexto(texto, oCodificacion))
        .then(() => {
            Toastify({
                text: "Código binario fue copiado con exito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "green",
                close: true
            }).showToast();
        })
        .catch(() => {
            Toastify({
                text: "Error al copiar",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#D9534F",
                close: true
            }).showToast();
        });
}

const fnEsTextoValido = () => {
    return txtTextoEntrada.value != '';
}

const fnEsTextoBinarioValido = () => {
    return txtBinarioSalida.value != '';
}

const fnMostrarArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".huffman")) {
        //alert("Solo se permiten archivos con extensión .huffman");
        txtArchivo.value = "";
        return;
    }

    // Remplaza el contenido del área de drop
    dropContent.innerHTML = `
    <div class="file-preview">
      <button class="remove-btn" title="Eliminar archivo">&times;</button>
      <i class="fas fa-file-alt"></i>
      <div>${file.name}</div>
    </div>
  `;

    // Agrega función de eliminar
    dropContent.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        txtArchivo.value = "";
        txt_binario.value = '';
        dropContent.innerHTML = `<span class="drop-title">Arrastre o seleccione un archivo txt</span>`;
    });
    
    const f = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            // Leer contenido base64 desde archivo
            const base64 = e.target.result;
            const jsonString = atob(base64); // Decodificar base64 a texto plano
            const data = JSON.parse(jsonString); // Parsear JSON

            const binario = data.binario;
            const arbol = data.arbol;

            const textoDecodificado = decodificarTexto(binario, arbol);

            // Mostrar resultado en un textarea (suponiendo que exista con id="txtContenido")
            document.getElementById("txt_binario").value = textoDecodificado;

        } catch (error) {
            console.error("Error al decodificar:", error?.message);
            alert("Error al leer el archivo. ¿Es un archivo .huffmn válido?");
        }
    };

    reader.readAsText(file); // ⚠️ Cambiar esto a readAsText
};

