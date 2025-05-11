// TODO: Logica para leer el archivo
const fnDescargarArchivo = (data, nombre, extension) => {

    const buffer = new TextEncoder().encode(data);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombre + '.' + extension;
    enlace.click();

    URL.revokeObjectURL(enlace.href);
}

const fnObtenerArchivoBinario = (data, nombre, extension) => {
    const buffer = new TextEncoder().encode(data);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    return new File([blob], `${nombre}.${extension}`, {
        type: 'application/octet-stream'
    });
}
