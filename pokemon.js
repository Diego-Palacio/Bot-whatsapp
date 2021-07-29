const axios= require('axios');

const hola=()=>{
    return "hola";
}

const apiPokemon =async(numeroPokemon)=>{
    const api = await axios .get('https://pokeapi.co/api/v2/pokemon/'+numeroPokemon);
    const apiData= await api.data;
    
  const pokemon={
        nombre: apiData.name,
        imagen: apiData.sprites.front_default,
    }
   console.log(pokemon)
   return pokemon;
 }

 module.exports = { apiPokemon }; //Se exporta la funcion apiPokemon para pader usar desde otro archivo js (app.js)

  //  apiPokemon(2);
   
   