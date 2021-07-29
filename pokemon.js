const axios= require('axios');


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
     
  //  apiPokemon(2);
   
   