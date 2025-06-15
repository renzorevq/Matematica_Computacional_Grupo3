const areaArchivo = document.getElementById("drop_content"); //lbl_dropzone
const txtArchivo = document.getElementById("btn_file");
const btnComprimir = document.getElementById("btn_comprimir");
const btnDescargarBinario = document.getElementById("btn_descargar_binario");
const txtTextoEntrada = document.getElementById("txt_texto_entrada");
const txtBinarioSalida = document.getElementById("txt_binario_salida");
const txt_binario = document.getElementById("txt_binario");
const contenedor = document.getElementById("file_preview_container");
const dropContent = document.getElementById("drop_content");
const pasos = document.getElementsByClassName("pasos-tab");
const contenidos = document.querySelectorAll("[class^='paso']");

document.addEventListener("DOMContentLoaded", function (e) {
  iniciarEventos();
  cambiarPestana(0);
});

const iniciarEventos = () => {
  areaArchivo.addEventListener("click", abrirSelectorArchivo);

  btnComprimir.addEventListener("click", fnComprimirTexto);
  btnDescargarBinario.addEventListener("click", () => {
    if (!fnEsTextoBinarioValido())
      return Toastify({
        text: "El texto binario esta vacio",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#717729",
        close: true,
      }).showToast();

    fnAbrirModal();
  });

  txtArchivo.addEventListener("change", fnMostrarArchivo);
  Array.from(pasos).forEach((paso) => {
    paso.addEventListener("click", (e) => {
      const pasoSeleccionado = e.currentTarget.getAttribute("paso");

      contenidos.forEach((div) => {
        div.style.display = "none";
      });

      const divMostrar = document.querySelector(`.paso${pasoSeleccionado}`);
      if (divMostrar) {
        divMostrar.style.display = "block";
      }
      console.log(pasoSeleccionado);
    });
  });
};

const abrirSelectorArchivo = () => {
  const botonArchivo = document.getElementById("btn_file");
  botonArchivo.click();
};

const fnComprimirTexto = (e) => {
  if (!fnEsTextoValido())
    return Toastify({
      text: "El texto esta vacio",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#717729",
      close: true,
    }).showToast();

  const texto = txtTextoEntrada.value;

  let oArbol = construirArbolHuffman(texto);

  const oCodificacion = generarCodigos(oArbol);
  txtBinarioSalida.value = codificarTexto(texto, oCodificacion);
};

const fnDirigirPaso = (paso) => {
  switch (paso) {
    case 1:
      fnPaso1();
      break;
    case 2:
      fnPaso2();
      break;
    case 3:
      fnPaso3();
      break;
    case 4:
      fnPaso4();
      break;
    case 5:
      fnPaso5();
      break;
    case 6:
      fnPaso6();
      break;
    case 7:
      fnPaso7();
      break;
  }

  fnActivarPaso(paso);
};

const fnActivarPaso = (paso) => {
  const pasos = document.querySelectorAll("[paso]");
  const pasoSeleccionado = document.querySelector("[paso^='" + paso + "']");

  pasos.forEach((p) =>
    p.classList.remove(
      "bg-blue-100",
      "rounded-l-lg",
      "text-blue-600",
      "text-xl"
    )
  );
  pasoSeleccionado.classList.add(
    "bg-blue-100",
    "rounded-l-lg",
    "text-blue-600",
    "text-xl"
  );

  if (paso != 1)
    document.getElementById("div_area_pestanas").classList.add("rounded-t-lg");
  else
    document
      .getElementById("div_area_pestanas")
      .classList.remove("rounded-t-lg");

  const containersPaso = document.querySelectorAll("[id^='div_paso']");
  const containerSeleccionado = document.getElementById("div_paso" + paso);
  containersPaso.forEach((c) => c.classList.add("hidden"));
  containerSeleccionado.classList.remove("hidden");
};

const fnPaso1 = () => {
  const ltNodos = fnObtenerNodos();
  const tblFrecuencia = document.getElementById("tbl_frecuencia");
  const tblFrecuenciaBody = tblFrecuencia.tBodies[0];
  tblFrecuenciaBody.innerHTML = fnHtmlTablaFrecuencia(ltNodos);
};

const fnPaso2 = () => {
  const ltNodos = fnObtenerNodos(true);

  const tblFrecuencia = document.getElementById("tbl_frecuencia_ordenado");
  const tblFrecuenciaBody = tblFrecuencia.tBodies[0];
  tblFrecuenciaBody.innerHTML = fnHtmlTablaFrecuencia(ltNodos);
};

const fnPaso3 = () => {
  const ltNodos = fnObtenerNodos(true);
  const nodosHtml = fnNodosHtml(ltNodos);
  const areaHtml = document.getElementById("nodos_hojas");
  areaHtml.innerHTML = nodosHtml;
};

const fnPaso4 = () => {
  const ltNodos = fnObtenerNodos(true);
  const nodosHtml = fnNodosHtml(ltNodos, true);
  const areaHtml = document.getElementById("nodos_hojas_arbol");
  areaHtml.innerHTML = nodosHtml;
};

const fnPaso5 = () => {
  // TODO: Arbol binario grafico
};

const fnPaso6 = () => {
  const texto = txtTextoEntrada.value;
  const oArbol = construirArbolHuffman(texto);
  const oCodificacion = generarCodigos(oArbol);

  const tblFrecuencia = document.getElementById("tbl_codificacion");
  const tblCodificacionBody = tblFrecuencia.tBodies[0];
  tblCodificacionBody.innerHTML = fnHtmlTablaCodificacion(oCodificacion);
};

const fnPaso7 = () => {
  const texto = txtTextoEntrada.value;
  const oArbol = construirArbolHuffman(texto);
  const oCodificacion = generarCodigos(oArbol);

  const { original, codificado } = fnHtmlCodificacion(texto, oCodificacion);
  document.getElementById("txt_original").innerHTML = original;
  document.getElementById("txt_codificado").innerHTML = codificado;
};

const fnHtmlCodificacion = (texto, oCodificacion) => {
  let textoOriginalhtml = "";
  let textoCodificadohtml = "";
  let textoArray = [...texto];
  let arrayColores = ["blue", "green", "gray", "yellow"];
  let contador = 0;

  textoArray.forEach((caracter) => {
    textoOriginalhtml +=
      "<span class='text-xl font-bold text-" +
      arrayColores[contador] +
      "-700'>" +
      (caracter == "\n" ? "<br>" : caracter) +
      "</span>";
    textoCodificadohtml +=
      "<span class='text-xl font-bold text-" +
      arrayColores[contador] +
      "-700'>" +
      oCodificacion[caracter] +
      "</span>";
    if (contador == 3) contador = 0;
    else contador++;
  });
  return {
    original: textoOriginalhtml,
    codificado: textoCodificadohtml,
  };
};

const fnNodosHtml = (ltNodos, esArbol = false) => {
  let html = "";
  const num1 = ltNodos[0].frecuencia;
  const num2 = ltNodos[1].frecuencia;
  const sumatoria = num1 + num2;

  if (esArbol) {
    const nuevoNodo = {
      caracter: sumatoria,
      frecuencia: sumatoria,
      izquierda: null,
      derecha: null,
      nuevo: true,
    };

    ltNodos.push(nuevoNodo);
    ltNodos.sort((a, b) => a.frecuencia - b.frecuencia);
  }

  ltNodos.forEach((nodo, index) => {
    let claseCuadroRojo = "";
    let clasePlomo = "";
    let claseCuadroNegro = "border-2 border-gray-800";

    if ((esArbol && index == 0) || (esArbol && index == 1)) {
      claseCuadroRojo = "border-2 border-red-400";
      clasePlomo = "border-gray-400 text-gray-400";
    }

    html += `<div class="${
      esArbol && nodo.nuevo == true ? claseCuadroNegro : claseCuadroRojo
    } p-1">`;
    html += `<div class="h-10 w-10 flex items-center justify-center border-2 ${
      clasePlomo || "border-green-700"
    } rounded-full font-bold ${nodo.nuevo ? "bg-green-500" : ""}">${
      !nodo.nuevo ? obtenerCaracter(nodo.caracter, true) : `&nbsp;`
    }</div>`;
    html += `<div class="text-center mt-3 ${clasePlomo}">${nodo.frecuencia}</div>`;
    html += `</div>`;

    if (index == 0 || index == 1) {
      document.getElementById("num1").textContent = num1;
      document.getElementById("num2").textContent = num2;
      document.getElementById("sumatoria").textContent = sumatoria;
    }
  });
  return html;
};

function codificarTexto(texto, codigos) {
  return texto
    .split("")
    .map((char) => codigos[char])
    .join("");
}

const fnObtenerNodos = (ordenado = false) => {
  const texto = txtTextoEntrada.value;
  const ltNodos = obtenerNodosFrecuencias(texto);
  if (ordenado) {
    return ltNodos.sort((a, b) => a.frecuencia - b.frecuencia);
  } else {
    return ltNodos;
  }
};

const fnHtmlTablaFrecuencia = (ltDatos) => {
  let html = "";

  ltDatos.forEach((nodo) => {
    html += "<tr class='h-10 border-t border-blue-500'>";
    html +=
      "   <td class='border-r border-blue-500'>" +
      obtenerCaracter(nodo.caracter) +
      "</td>";
    html += "   <td>" + nodo.frecuencia + "</td>";
    html += "</tr>";
  });

  return html;
};

const fnHtmlTablaCodificacion = (oCodificacion) => {
  let html = "";

  Object.entries(oCodificacion).forEach(([letra, codigo]) => {
    html += "<tr class='h-10 border-t border-blue-500'>";
    html +=
      "   <td class='border-r border-blue-500'>" +
      obtenerCaracter(letra) +
      "</td>";
    html += "   <td>" + codigo + "</td>";
    html += "</tr>";
  });

  return html;
};

const obtenerCaracter = (caracter, nodo = false) => {
  if (caracter == " ") return !nodo ? "[espacio]" : '" "';
  if (caracter == "\n") return !nodo ? "[enter]" : "↵";
  console.log(caracter);
  return caracter;
};

// const fnMostrarPaso = (e) => {
//   const id = e.target.getAttribute("paso");
//   console.log(id);
// };

const fnDescargarArchivoBinario = () => {
  if (!fnEsTextoBinarioValido())
    return Toastify({
      text: "El texto binario esta vacio",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#717729",
      close: true,
    }).showToast();

  const oArbol = construirArbolHuffman(txtTextoEntrada.value);
  const oCodificacion = generarCodigos(oArbol);
  const nombre =
    document.getElementById("txtNombreArchivo").value || "texto_comprimido";
  const extension = document
    .getElementById("txtExtension")
    .value.replace(".", "");

  const data = {
    binario: codificarTexto(txtTextoEntrada.value, oCodificacion),
    arbol: oArbol,
  };
  const base64 = btoa(JSON.stringify(data));

  fnDescargarArchivo(base64, nombre, extension);
  fnCerrarModal();
};

function nodoAD3(nodo, lado = "") {
  if (!nodo) return null;

  const nombre =
    nodo.caracter !== null
      ? `${nodo.caracter} (${nodo.frecuencia})`
      : `${nodo.frecuencia}`;

  const resultado = { name: nombre };

  if (nodo.izquierda || nodo.derecha) {
    resultado.children = [];
    if (nodo.izquierda) {
      const hijoIzq = nodoAD3(nodo.izquierda, "0");
      hijoIzq.edgeLabel = "0";
      resultado.children.push(hijoIzq);
    }
    if (nodo.derecha) {
      const hijoDer = nodoAD3(nodo.derecha, "1");
      hijoDer.edgeLabel = "1";
      resultado.children.push(hijoDer);
    }
  }

  return resultado;
}

const fnBorrarTexto = () => {
  txtBinarioSalida.value = "";
  txtTextoEntrada.value = "";
  txtTextoEntrada.focus();
  document.getElementById("sp_contador_caracteres").textContent = "0";
};

const fnCopiarTexto = () => {
  if (!fnEsTextoValido())
    return Toastify({
      text: "El texto esta vacio",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#717729",
      close: true,
    }).showToast();

  navigator.clipboard
    .writeText(txtTextoEntrada.value)
    .then(() => {
      Toastify({
        text: "El texto fue copiado con exito",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "green",
        close: true,
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Error al copiar",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#D9534F",
        close: true,
      }).showToast();
    });
};

const mostrarPaso = () => {
  const texto = txtTextoEntrada.value;
  const arbolBinario = construirArbolHuffman(texto);
  const datosOriginales = nodoAD3(arbolBinario); // tu función ya procesada
  const svg = d3.select("#arbol");
  const g = svg.append("g").attr("transform", "translate(300, 30)");

  const root = d3.hierarchy(datosOriginales);
  const tree = d3.tree().size([500, 400]);
  tree(root);

  const nodos = root.descendants();
  const enlaces = root.links();

  let paso = 0;

  if (paso === 0) {
    // Paso 1: mostrar nodos
    g.selectAll(".nodo")
      .data(nodos)
      .enter()
      .append("g")
      .attr("class", "nodo")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .append("circle")
      .attr("r", 20)
      .attr("fill", "black");

    g.selectAll(".nodo")
      .append("text")
      .attr("dy", 5)
      .attr("x", 25)
      .attr("fill", "white")
      .text((d) => d.data.name);
  } else if (paso <= enlaces.length) {
    // Paso 2+: agregar ramas progresivamente
    g.append("path")
      .datum(enlaces[paso - 1])
      .attr("class", "enlace")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // Agrega etiqueta "0" o "1"
    g.append("text")
      .attr("x", (enlaces[paso - 1].source.x + enlaces[paso - 1].target.x) / 2)
      .attr(
        "y",
        (enlaces[paso - 1].source.y + enlaces[paso - 1].target.y) / 2 - 5
      )
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(enlaces[paso - 1].target.data.edgeLabel || "");
  }

  paso++;
};

const fnCopiarBinario = () => {
  if (!fnEsTextoBinarioValido())
    return Toastify({
      text: "El texto binario esta vacio",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#717729",
      close: true,
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
        close: true,
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Error al copiar",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#D9534F",
        close: true,
      }).showToast();
    });
};

const fnEsTextoValido = () => {
  return txtTextoEntrada.value != "";
};

const fnEsTextoBinarioValido = () => {
  return txtBinarioSalida.value != "";
};

const fnMostrarArchivo = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.endsWith(".huffman")) {
    mensaje("error", 'el archivo debe tener extension ".huffman"');
    txtArchivo.value = "";
    return;
  }

  const fileName = file.name.split(".");
  fileName.pop();
  // dropContent.innerHTML = `
  //   <div class="file-preview">
  //     <button class="remove-btn" title="Eliminar archivo">&times;</button>
  //     <i class="fas fa-file-alt"></i>
  //     <div>${file.name}</div>
  //   </div>
  // `;

  // dropContent.querySelector(".remove-btn").addEventListener("click", (e) => {
  //   e.stopPropagation();
  //   txtArchivo.value = "";
  //   txt_binario.value = "";
  //   dropContent.innerHTML = `<span class="drop-title">Arrastre o seleccione un archivo txt</span>`;
  // });

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

      document.getElementById("drop_content").classList.add("hidden");
      document
        .getElementById("drop_content_selected")
        .classList.remove("hidden");
      document.getElementById("sp_nombre_archivo").textContent =
        fileName.join(".");
      file.name.split("");
    } catch (error) {
      mensaje(
        "error",
        "Error al decodificar:" + (error?.message || "error desconocido")
      );
    }
  };

  reader.readAsText(file); // ⚠️ Cambiar esto a readAsText
};

const eliminarArchivo = () => {
  document.getElementById("drop_content_selected").classList.add("hidden");
  document.getElementById("drop_content").classList.remove("hidden");
  document.getElementById("txt_binario").value = "";
  txtArchivo.value = "";
};

const cambiarPestana = (numeroPestana) => {
  const pestanaSeleccionada = document.getElementById(
    "pestana" + numeroPestana
  );
  const pestanasInicio = document.querySelectorAll('li[tab="inicio"]');

  const botonSeleccionado = document.getElementById("boton" + numeroPestana);
  const botonesInicio = document.querySelectorAll('button[tab="inicio"]');

  pestanasInicio.forEach((pestana) => pestana.classList.add("hidden"));
  pestanaSeleccionada.classList.remove("hidden");

  botonesInicio.forEach((boton) => boton.classList.remove("active"));
  botonSeleccionado.classList.add("active");
};

const fnAumentarCaracteres = (e) => {
  const texto = e.currentTarget.value;
  const cantidadCaracteres = texto.length;
  const spContador = document.getElementById("sp_contador_caracteres");

  spContador.textContent = cantidadCaracteres;
};

const mensaje = (tipo, mensaje) => {
  const color = (function () {
    if (tipo == "success") return "#008000";
    else if (tipo == "info") return "#717729";
    else if (tipo == "error") return "#D9534F";
    else return "";
  })();

  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    backgroundColor: color,
    close: true,
  }).showToast();
};
