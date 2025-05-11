const enviarCorreo = () => {
    
    const txtCorreo = document.getElementById('txtCorreo');
    //const fileInput = document.getElementById('fileInput');

    const oArbol = construirArbolHuffman(txtTextoEntrada.value);
    const oCodificacion = generarCodigos(oArbol);
    const data = {
        binario: codificarTexto(txtTextoEntrada.value, oCodificacion),
        arbol: oArbol
    }
    
    const base64 = btoa(JSON.stringify(data));
    const file = fnObtenerArchivoBinario(base64, 'archivo_binario', 'huffman');

    if(txtCorreo.value == '') 
    return Toastify({
        text: "Ingrese un correo valido",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#D9534F",
        close: true
    }).showToast();

    const formData = new FormData();
    formData.append("to", txtCorreo.value);
    formData.append("file", file);

    fetch("https://huffman-od03.onrender.com/send-email", {
        method: "POST",
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            Toastify({
                text: "Correo enviado con exito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "green",
                close: true
            }).showToast();

            fnCerrarModalCorreo();
        })
        .catch(err => {
            Toastify({
                text: "Error al enviar el archivo",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#D9534F",
                close: true
            }).showToast();
        });
}