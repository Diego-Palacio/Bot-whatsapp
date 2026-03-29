
const qrcode = require('qrcode-terminal'); //importamos libreria de qrs
const { Client, MessageMedia,LocalAuth}= require('whatsapp-web.js'); //importamos libreria whatsapp-web
const fs = require('fs')  //paquete que viene por defecto node nativament
let client; //Declaramos variables globales
let sessionData;
const botClima = require('./bots/clima'); // Importamos el bot del clima
const botPokemon = require('./bots/pokemon'); // Importamos el bot de pokemon




/*Funcion que genera codigo QR cuando no haya una sesion iniciada*/ 
const Sesion=()=>{
 
       console.log('Iniciando cliente y gestionando sesión...');

    // Configuramos el cliente con LocalAuth para que guarde la sesión solo
    client = new Client({
        authStrategy: new LocalAuth() 
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('¡El cliente está listo!');
        // Llamamos a tus funciones una vez que el cliente está conectado
        verMensaje();
        botClima(client);
        botPokemon(client);
        contestarMensaje();
    });

    // Este evento no es necesario para guardar archivos, 
    // pero lo usamos para avisar que entró
    client.on('authenticated', () => {
        console.log('Autenticado correctamente');
    });

    client.initialize();

}


const verMensaje=()=>{
   client.on('message', async message => {

    const{from,to,body}=message;

    if(from=="5491134721503"){
       console.log(message.body);
    }
   
  });
}




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


Sesion();

