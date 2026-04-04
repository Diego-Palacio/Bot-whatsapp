 const axios = require('axios');
 const enviar = require('../envios/enviar'); // Importamos funcion de enviar imagenes

 const imageDownloader = require('../image-downloader').download;// Importamos la función para descargar imágenes


 const obtenerCumplesPorMes = async (mes) => {
    try {
        const response = await axios.get(`http://localhost:3000/familia/mes/${mes}`);
        return response.data;
    } catch (error) {
        return [];
    }
};


//import { obtenerCumplesPorMes } from './apiService.js';
// ... (resto de tus imports de whatsapp-web.js)

let esperandoMes = false;


 const botCumple=(client)=>{

client.on('message', async (msg) => {

     const {from,to,body}=msg;    
     console.log(from,to,body);
    // Paso 1: El usuario pide cumpleaños

    const texto = body.toLowerCase();
    if (body == 'cumple') {
        esperandoMes = true;
        //msg.reply('Buenos días, ¿los cumpleaños de qué mes necesitas?');
        enviar.mensaje(client,from,'Buenos días, ¿los cumpleaños de qué mes necesitas?');
        return;
    }

    // Paso 2: El usuario envía el mes
    if (esperandoMes) {
        const cumples = await obtenerCumplesPorMes(texto);
        
        if (cumples.length > 0) {
            let respuesta = `🎂 Cumpleaños de ${texto.toUpperCase()}:\n`;
            cumples.forEach(f => {
                respuesta += `- ${f.nombre}: ${f.cumple}\n`;
            });
            msg.reply(respuesta);
        } else {
            msg.reply(`No encontré cumpleaños registrados en el mes de ${texto}.`);
        }
        
        esperandoMes = false; // Resetear el estado
    }
});

} 



module.exports = botCumple;
