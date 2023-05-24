const qrcode = require('qrcode-terminal'); //importamos libreria de qrs
const { Client, MessageMedia} = require('whatsapp-web.js'); //importamos libreria whatsapp-web
const fs = require('fs')  //paquete que viene por defecto node nativament
const SESSION_FILE_PATH= './session.json'; // guardamos sesion en la ruta especificada con el nombre sesion.json
const axios= require('axios');
const imageDownloader = require('./image-downloader').download;// Importamos la función para descargar imágenes
let client; //Declaramos variables globales
let sessionData;




//Si existe cargamos el archivo con las credenciales
const conSesion=()=>{
        console.log("conectando..")
        sessionData = require(SESSION_FILE_PATH); //requerimos el archivo ya cargado
        client = new Client({       //instanciamos el cliente, pero esta vez ya tiene la sesion
             session: sessionData
         });
    
        client.on('ready', () => {
        console.log('El cliente esta listo!');
        // constestarMensaje();
        botPokemon();
         });
    
        client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');//Tengo que automatizarlo
        })

        client.initialize();
}



/*Funcion que genera codigo QR cuando no haya una sesion iniciada*/ 
const sinSesion=()=>{

        console.log('No tenemos sesion guardada');
       
        client = new Client();
        client.on('qr', qr => { // Se genera el QR
        qrcode.generate(qr, { small: true });
        });
    
        verMensaje()
        botPokemon();
        botClima();

        // client.on('authenticated', (session) => {
        // // Guardamos credenciales de de sesion para usar luego
        // sessionData = session;
        // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session),  (err) =>{ //guardamos la data en el archivo sesion
        //     if (err) {
        //         console.log(err, "error de sesion");
        //     }
        //   });
        // });

        client.initialize();

}


const verMensaje=()=>{
  client.on('message', message => {
    console.log(message.body);
  });
   
}


// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

const kevinACentigrado=(temp)=>{
  return parseInt(temp-273.15);
} 


const botClima=()=>{

  client.on('message', async msg=> {
  const {from,to,body}=msg;
  console.log(from,to,body);

  if (body=='CLIMA'){
    const key= 'cce693458e0d4a70be5508397b860474';
    
    const api = await axios .get(`https://api.openweathermap.org/data/2.5/weather?q=BSAS,argentina&appid=`+key);
    const temp= await api.data.main.temp;
    const tempMin= await api.data.main.temp_min;
    const tempMax= await api.data.main.temp_max;
    const icono= await api.data.weather[0].icon;
    const iconoClima=`https://openweathermap.org/img/wn/${icono}.png`;
    const nombreIcono= "clima.png"

    imageDownloader(iconoClima, nombreIcono, function(){
      console.log(`${iconoClima} image download!!`); 
       enviarimagen(from,nombreIcono); //ahora al tenerla descargada, ya podemos enviarla.
      });


    kevinACentigrado(temp);
    kevinACentigrado(tempMin);
    kevinACentigrado(tempMax);



    console.log("La temperaratura en Buenos Aires es: " +  kevinACentigrado(temp) +" Temperatura Maxima= "+ kevinACentigrado(tempMax) + " Temperatura Minima= " +     kevinACentigrado(tempMin))
    enviarMensaje(from,"La temperaratura en Buenos Aires es: " +  kevinACentigrado(temp) +" Temperatura Maxima= "+ kevinACentigrado(tempMax) + " Temperatura Minima= " +     kevinACentigrado(tempMin)); 
    console.log("Telefono: "+from + "Mensaje: " +body);

  }

  });
}


let modoPokemon=false; //boolean que indica si el bot Pokemon esta activo o no
let numerico=/^[0-9]+$/; //Expresion regular solo para numeros


const botPokemon=()=>{

  client.on('message', async msg=> {
    const {from,to,body}=msg;
    console.log(from,to,body);
       

  if (body=='POKEMON'){
    enviarMensaje(from,"ingrese un numero para ver el nombre de su pokemon y su respectiva imagen"); 
    modoPokemon=true;
    guardarNumero=from; //guardo el numero en variable
    console.log("Telefono: "+from + "Mensaje: " +body);
  }

  if(body=='SALIR'){
    modoPokemon=false;
    enviarMensaje(from,"Chauu, ingresa 'pokemon' nuevamente para volver a jugar");
}

    //Al mandar el comando POKEMON, se activa el modo BOT POKEMON, donde si la entrada es un numero devuelve el nombre de un pokemon.
    //ademas se guarda el numero telefonico, asi solo a ese contacto se le aplica el bot (de esta forma se soluciona el error
    // de que se envie nombres de pokemon a cualquier contacto que mande un numero sin haber activado el BOT POKEMON).
         if(modoPokemon && body.match(numerico) && from==guardarNumero){

          numeroPokemon=body;
          const api = await axios .get(`https://pokeapi.co/api/v2/pokemon/`+numeroPokemon);
          const apiData= await api.data;
         
          nombre=apiData.name;
          imagen= apiData.sprites.front_default;
          nombreImagen="pokemon.png";

          console.log("numero de pokemon: "+ numeroPokemon+ " nombre de pokemon: "+nombre)
          enviarMensaje(from,nombre);

          // Función para descargar las imágenes obtenidas desde la api pokemon.
            imageDownloader(imagen, nombreImagen, function(){
            console.log(`${imagen} image download!!`); 
             enviarimagen(from,nombreImagen); //ahora al tenerla descargada, ya podemos enviarla.
            });

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

//funcion para enviar un msj
const enviarMensaje=(to,message)=>{ 
    client.sendMessage(to,message);
}

//uso metodo de la libreria whatsapp. messageMedia para enviar imagen
const enviarimagen=(to,file)=>{
  const mediaFile=MessageMedia.fromFilePath(file);
  client.sendMessage(to,mediaFile);
}


// (fs.existsSync(SESSION_FILE_PATH)) ? conSesion() : sinSesion(); // se llama a las funciones conSesion() y sinSesion() segun si existe o no el archivo sesion


sinSesion();
