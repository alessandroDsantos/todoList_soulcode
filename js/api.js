const TOKEN = "SoulCodeToDo";
const URL = `https://one-list-api.herokuapp.com/items?access_token=illustriousvoyage`;
// const URL = `https://one-list-api.herokuapp.com/items?access_token=${TOKEN}`;


export const list = async () => {
    try{
        const response = await fetch(URL);
        if(!response.ok){
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch(error) {
        console.log(`Algo deu errado: ${error}`);
        return []; 
    }
    
}





