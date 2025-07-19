import { list } from "./api.js";

let dateToday = document.querySelector(".header-date");


const now = new Date();


document.addEventListener("DOMContentLoaded", () => {
    dateToday.textContent = dateFormat();
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
    const notes = await list();
    console.log(notes);
}

// listNotes();

dateFormat();