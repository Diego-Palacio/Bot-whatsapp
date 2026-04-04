const axios= require('axios');
const enviar = require('../envios/enviar'); // Importamos funcion de enviar imagenes
const imageDownloader = require('../image-downloader').download;// Importamos la función para descargar imágenes
const path = require('path');



let modoPokemon=false; //boolean que indica si el bot Pokemon esta activo o no
let numerico=/^[0-9]+$/; //Expresion regular solo para numeros


const botPokemon=(client)=>{

  client.on('message', async msg=> {
    const {from,to,body}=msg;
    console.log(from,to,body);
       

  if (body=='POKEMON'){
    enviar.mensaje(client,from,"ingrese un numero para ver el nombre de su pokemon y su respectiva imagen"); 
    modoPokemon=true;
    guardarNumero=from; //guardo el numero en variable
    console.log("Telefono: "+from + "Mensaje: " +body);
  }

  if(body=='SALIR'){
    modoPokemon=false;
    enviar.mensaje(client,from,"Chauu, ingresa 'pokemon' nuevamente para volver a jugar");
}

    //Al mandar el comando POKEMON, se activa el modo BOT POKEMON, donde si la entrada es un numero devuelve el nombre de un pokemon.
    //ademas se guarda el numero telefonico, asi solo a ese contacto se le aplica el bot (de esta forma se soluciona el error
    // de que se envie nombres de pokemon a cualquier contacto que mande un numero sin haber activado el BOT POKEMON).
         if(modoPokemon && body.match(numerico) && from==guardarNumero && body<1303){

          numeroPokemon=body;
          const api = await axios .get(`https://pokeapi.co/api/v2/pokemon/`+numeroPokemon);
          const apiData= await api.data;
         
          nombre=apiData.name;
          imagen= apiData.sprites.front_default;
          nombreImagen="pokemon.png";

          console.log("numero de pokemon: "+ numeroPokemon+ " nombre de pokemon: "+nombre)
          enviar.mensaje(client,from,nombre);

          // Función para descargar las imágenes obtenidas desde la api pokemon.
            imageDownloader(imagen, nombreImagen, function(){
            console.log(`${imagen} image download!!`); 
             enviar.imagen(client,from,nombreImagen); //ahora al tenerla descargada, ya podemos enviarla.
            });

         }

         if(body>1302 || body <0) {
            const rutaCompleta = path.join(__dirname, '../ultimoPokemon.png');
          
             enviar.imagen(client,from,rutaCompleta); 
           
         }

});

}


module.exports = botPokemon;