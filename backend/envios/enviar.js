const { MessageMedia}= require('whatsapp-web.js'); //importamos libreria whatsapp-web
//funcion para enviar un msj


// Agrupamos las funciones de envío en un solo objeto
const enviar = {
    // Función para texto
    mensaje: (client, to, body) => {
        client.sendMessage(to, body);
    },

    // Función para imágenes
    imagen: (client, to, file) => {
        const mediaFile=MessageMedia.fromFilePath(file);
        client.sendMessage(to, mediaFile);
    }
};

module.exports = enviar;