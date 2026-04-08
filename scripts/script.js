const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")

const noteContainer = document.getElementById('noteContainer')
const noteInput = document.querySelector('.note-input')
const titleBlock = document.getElementById('titleBlock')
const createBtn = document.getElementById('createBlock')
const titleInput = document.querySelector('.title-input')

const notesWrapper = document.getElementById('notesWrapper')

burger.addEventListener("click", function() {
    sidebar.classList.toggle("open")
})

if (noteInput) {
    noteInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px'
    })

    noteInput.addEventListener('focus', function() {
        noteContainer.classList.add('active')
        titleBlock.classList.remove('hidden')
        createBtn.classList.remove('hidden')
    })
}

document.addEventListener('click', function(event) {
    if (noteContainer && !noteContainer.contains(event.target) && noteInput.value.trim() === "") {
        noteInput.value = ""
        if (noteInput) titleInput.value = ''
        noteContainer.classList.remove('active')
        titleBlock.classList.add('hidden')
        createBtn.classList.add('hidden')
        noteInput.style.height = 'auto'
    }
})

if (createBtn){
    createBtn.addEventListener('click', function(){
        const title = titleInput ? titleInput.value : ''
        const text = noteInput.value    
        if(text.trim()=== '') return
        renderNote( title, text)
        console.log("Note was Created", {title, text})
if(titleInput) titleInput.value = ''
        noteInput.value = ''
        noteContainer.classList.remove('active')
        titleBlock.classList.add('hidden')
        createBtn.classList.add('hidden')
        noteInput.style.height = 'auto'
    })
}

function renderNote(title, text){
    const card = document.createElement('div')
    card.classList.add('note-card')
if(title){
    const h3 = document.createElement('h3')
    h3.innerText = title
    card.appendChild(h3)
}
const p = document.createElement('p')
    p.innerText = text
    card.appendChild(p)
    notesWrapper.prepend(card)
}
