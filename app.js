const qrcode = require('qrcode-terminal'); //importamos libreria de qrs
const { Client} = require('whatsapp-web.js'); //importamos libreria whatsapp-web
const fs = require('fs')  //paquete que viene por defecto node nativament
const SESSION_FILE_PATH= './sesion.json'; // guardamos sesion en la ruta especificada con el nombre sesion.json
let client; //Declaramos variables globales
let sesionData;




//Si existe cargamos el archivo con las credenciales
const conSesion=()=>{
        console.log("conectando..")
        sesionData = require(SESSION_FILE_PATH); //requerimos el archivo ya cargado
        client = new Client({       //instanciamos el cliente, pero esta vez ya tiene la sesion
             session: sessionData
         });
    
        client.on('listo', () => {
        console.log('El cliente esta listo!');
        // sendMessage();
         });
    
        client.on('error_autentificacion', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');//Tengo que automatizarlo
        })

        client.initialize();
}






/*Funcion que genera codigo QR cuando no haya una sesion iniciada*/ 
const sinSesion=()=>{

        console.log('No tenemos session guardada');
       
        client = new Client();
        client.on('qr', qr => { // Se genera el QR
        qrcode.generate(qr, { small: true });
        });
    
        client.on('autenticarse', (session) => {
        // Guardamos credenciales de de session para usar luego
        sesionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session),  (err) =>{ //guardamos la data en el archivo sesion
            if (err) {
                console.log(err);
            }
          });
        });

        client.initialize();

}




(fs.existsSync(SESSION_FILE_PATH)) ? conSesion() : sinSesion(); // se llama a las funciones conSesion() y sinSesion() segun si existe o no el archivo sesion

