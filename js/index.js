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

document.addEventListener("DOMContentLoaded", function (e) {

    iniciarEventos();

});

const iniciarEventos = () => {
    areaArchivo.addEventListener("dragover", fnDragOver, false);
    areaArchivo.addEventListener("dragenter", fnDragEnter);
    areaArchivo.addEventListener("dragleave", fnDragLeave);
    areaArchivo.addEventListener("drop", fnDrop);
}

const fnDragOver = (e) => {
    e.preventDefault();
}

const fnDragEnter = () => {
    fnDragActive(true);
}

const fnDragLeave = () => {
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