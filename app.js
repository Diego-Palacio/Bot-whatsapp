const qrcode = require('qrcode-terminal'); //importamos libreria de qrs
const { Client, MessageMedia } = require('whatsapp-web.js'); //importamos libreria whatsapp-web
const fs = require('fs')  //paquete que viene por defecto node nativament
const SESSION_FILE_PATH= './sesion.json'; // guardamos sesion en la ruta especificada con el nombre sesion.json
let cliente; //Declaramos variables globales
let sesionData;

const conSesion=()=>{

}


/*Funcion que genera codigo QR cuando no haya una sesion iniciada*/ 
const sinSesion=()=>{

    console.log('No tenemos session guardada');
    client = new Client();
    client.on('qr', qr => { // Se genera el QR
        qrcode.generate(qr, { small: true });
    });
    
    client.on('authenticated', (session) => {
        // Guardamos credenciales de de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session),  (err) =>{ //guardamos la data en el archivo sesion
            if (err) {
                console.log(err);
            }
        });
    });

    client.initialize();


}

(fs.existsSync(SESSION_FILE_PATH)) ? conSesion() : sinSesion(); // Si no existe archivo sesion entonces se inicia sesion