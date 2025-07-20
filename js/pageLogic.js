const TOKEN = "SoulCodeToDo";
const URL = `https://one-list-api.herokuapp.com/items?access_token=${TOKEN}`;


const list = async () => {
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

const add = async (text) => {
    try{
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "item": {
                    "text": text
                }
            })
        });

        if(!response.ok){
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }
        
        const newNote = await response.json();
        console.log(newNote)
        return newNote;

    } catch(error) {
        console.log(`Algo deu errado: ${error}`);
        return [];
    }
}

const rm = async (id) => {
    try{
        const response = await fetch(`https://one-list-api.herokuapp.com/items/${id}?access_token=${TOKEN}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if(!response.ok){
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }
        
    } catch(error) {
        console.log(`Algo deu errado: ${error}`);
        return [];
    }
}

const toggle = async (id, bool) => {
    try{
        const response = await fetch(`https://one-list-api.herokuapp.com/items/${id}?access_token=${TOKEN}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "item": {
                    "complete": bool
                }
            })
        });

        if(!response.ok){
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }  

        console.log("Feito!")

    } catch(error) {
        console.log(`Algo deu errado: ${error}`);
        return [];
    }
}


// Lógica da página
let dateToday = document.querySelector(".header-date");
const sectionCards = document.querySelector(".section-cards");

const now = new Date();

document.addEventListener("DOMContentLoaded", () => {
    dateToday.textContent = dateFormat();
    listNotes();
}); 


const dateFormat = () => {
    const day = now.getDate();
    const month = now.toLocaleString('pt-BR', { month: 'long' });
    const year = now.getFullYear();

    return `${day} de ${month} de ${year}`
}

const dateUpdate = () => {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const time = tomorrow - now;

    setTimeout(() => {
        dateFormat();
        dateUpdate();
    }, time)
}

const listNotes = async () => {
    sectionCards.innerHTML = "";
    const notes = await list();
    
    for(let note of notes){
        const card = document.createElement("article");
        card.className = 'article-note-card';
        let cut = note.text.indexOf(":");
        let priority = note.text.slice(0, cut).trim();
        let text = note.text.slice(cut + 1).trim();

        card.innerHTML = `
            <div class="note-actions">
                <input type="checkbox" id="taskCheck" name="taskCheck">
                <p class="note-priority">${priority === '' ? 'BAIXA' : priority}</p>
                <button class="delete-btn">
                    <span class="fas fa-trash"></span>
                </button>
            </div>

            <div class="note-content">
                <p class="note-text">${text}</p>
            </div>
        `;

        sectionCards.appendChild(card);

        const checkbox = card.querySelector("#taskCheck");
        const priorityColor = card.querySelector(".note-priority");
        const btnRm = card.querySelector(".delete-btn");

        if(note.complete){
            checkbox.checked = true;
            card.classList.add("card-done");
        } else {
            checkbox.checked = false;
            card.classList.remove("card-done");
        }

        if(priority === 'ALTA'){
            priorityColor.classList.add("priorityColor-red");
            priorityColor.classList.remove("priorityColor-yellow");
            priorityColor.classList.remove("priorityColor-green");
        } else if (priority === 'MÉDIA'){
            priorityColor.classList.remove("priorityColor-red");
            priorityColor.classList.add("priorityColor-yellow");
            priorityColor.classList.remove("priorityColor-green");
        } else {
            priorityColor.classList.remove("priorityColor-red");
            priorityColor.classList.remove("priorityColor-yellow");
            priorityColor.classList.add("priorityColor-green");
        }

        checkbox.addEventListener("change", async (event) => {
            if(event.target.checked){
                card.classList.add("card-done");
                await toggle(note.id,true);
            } else {
                card.classList.remove("card-done");
                await toggle(note.id,false);
            }
        })

        btnRm.addEventListener("click", async () => {
            const confimacao = window.confirm("Deseja excluir está nota?");
            if(confimacao){
                await rm(note.id);
                card.remove();
            }
        })
    }
}


const addNote = async (event) => {
    event.preventDefault();
    
    const inputNotePriority = document.querySelector("#priority").value;
    const inputNoteText = document.querySelector("#taskInput").value;

    let text = ""

    text = `${inputNotePriority}: ${inputNoteText}`
    console.log(text);
    await add(text);

    document.querySelector(".add-note-form").reset();

    await listNotes();
}