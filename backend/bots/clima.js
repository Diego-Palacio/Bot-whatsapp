const axios= require('axios');
const imageDownloader = require('../image-downloader').download;// Importamos la función para descargar imágenes
const enviar = require('../envios/enviar'); // Importamos funcion de enviar imagenes

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

const kevinACentigrado=(temp)=>{
  return parseInt(temp-273.15);
} 


const botClima=(client)=>{

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
      enviar.imagen(client,from,nombreIcono); //ahora al tenerla descargada, ya podemos enviarla.
      });


    kevinACentigrado(temp);
    kevinACentigrado(tempMin);
    kevinACentigrado(tempMax);



    console.log("La temperaratura en Buenos Aires es: " +  kevinACentigrado(temp) +" Temperatura Maxima= "+ kevinACentigrado(tempMax) + " Temperatura Minima= " +     kevinACentigrado(tempMin))
    enviar.mensaje(client,from,"La temperaratura en Buenos Aires es: " +  kevinACentigrado(temp) +" Temperatura Maxima= "+ kevinACentigrado(tempMax) + " Temperatura Minima= " +     kevinACentigrado(tempMin)); 
    console.log("Telefono: "+from + "Mensaje: " +body);

  }

  });
}


module.exports = botClima;