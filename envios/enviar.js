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












/*
const contestarMensaje=() => {
    client.on('message', (msg) =>{
        const {from,to,body}=msg;  //from = numero de la persona que manda el msj. body=cuerpo del mensaje
        console.log(from,to,body);
       
        switch(body){ //si el mensaje dice hola , se enviaria un cierto mensaje utilizando la funcion enviarmensaje()
            case('hola'):
          //  enviarMensaje(from,'holaa');
            break;

            case('chau'):
           // enviarMensaje(from,'chauuuuu')
        }
  });
}

*/