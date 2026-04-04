const axios = require('axios');
const enviar = require('../envios/enviar');
const imageDownloader = require('../image-downloader').download;// Importamos la función para descargar imágenes

let modoFuturama=false;
let numerico=/^[0-9]+$/; //Expresion regular solo para numeros

const botNumeros = (client) => { 
    
        client.on('message', async msg => {

        const {from,to,body}=msg;    

        // Verificamos si el mensaje empieza con !signo
        if (body==('FUTURAMA')) {
            modoFuturama=true;
             enviar.mensaje(client,from,"ingrese un numero que personaje toca"); 
             guardarNumero=from; //guardo el numero en variable
            console.log("Telefono: "+from + "Mensaje: " +body);
  }

        
    if(modoFuturama && body.match(numerico) && from==guardarNumero){

          numeroFuturama=body;
          const api = await axios .get(`https://futuramaapi.com/api/characters/`+numeroFuturama);
          const apiData= await api.data;
         
          nombre=apiData.name;
          imagen= apiData.image;
          nombreImagen="pokemon.png";

          console.log("numero de pokemon: "+nombre)
          enviar.mensaje(client,from,nombre);

          // Función para descargar las imágenes obtenidas desde la api pokemon.
            imageDownloader(imagen, nombreImagen, function(){
            console.log(`${imagen} image download!!`); 
             enviar.imagen(client,from,nombreImagen); //ahora al tenerla descargada, ya podemos enviarla.
            });

         }


    });
};

module.exports = botNumeros;
