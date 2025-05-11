
const fnAbrirModal = () => {
    document.getElementById('mdDescargarArchivo').style.display = "flex";
}

const fnCerrarModal = () => {
    document.getElementById('mdDescargarArchivo').style.display = "none";
}

const fnAbrirModalPasos = () => {
    
}


const fnAbrirModalCorreo = () => {
    if (!fnEsTextoBinarioValido())
    return Toastify({
        text: "El texto binario esta vacio",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#717729",
        close: true
    }).showToast();
    document.getElementById('mdEnvioCorreo').style.display = "flex";
}
const fnCerrarModalCorreo = () => {
    document.getElementById('mdEnvioCorreo').style.display = "none";
}

const actualizarContador = () => {
    const txtNombreArchivo = document.getElementById('txtNombreArchivo');
    const lblContadorNombreArchivo = document.getElementById('lblContadorNombreArchivo');
    lblContadorNombreArchivo.textContent = `${txtNombreArchivo.value.length} / ${txtNombreArchivo.maxLength}`;
}

