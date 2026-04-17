const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")

const searchInput = document.getElementById('searchInput')
const noteContainer = document.getElementById('noteContainer')
const noteInput = document.querySelector('.note-input')
const titleBlock = document.getElementById('titleBlock')
const createBtn = document.getElementById('createBlock')
const titleInput = document.querySelector('.title-input')

const notesWrapper = document.getElementById('notesWrapper')
const empty = document.getElementById('emptyContainer')

const modal = document.getElementById('noteModal')
const modalTitle = document.getElementById('modalTitle')
const modalText = document.getElementById('modalText')
const saveBtn = document.getElementById('saveModal')

let currentEditingId = null

let notes = JSON.parse(localStorage.getItem('notes')) || []

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

if(searchInput){
    searchInput.addEventListener('input',function(){
        const filter = searchInput.value.toLowerCase()
        const allCards = document.querySelectorAll('.note-card')
        const noResultsMessage = document.getElementById('noResults')
        let hasVisibleCards = false
        allCards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : ''
            const text = card.querySelector('p').innerText.toLowerCase()
        if(title.includes(filter) || text.includes(filter)){
            card.style.display = ''
            hasVisibleCards = true
        }else{
            card.style.display = 'none'
        }
        })
        if(!hasVisibleCards && filter.length > 0){
            noResultsMessage.classList.remove('hidden')
            empty.classList.add('hidden')
        }else{
            noResultsMessage.classList.add('hidden')
        if(filter.length === 0) checkEmpty()
        }
    })
}

function checkEmpty(){
    if(notes.length > 0){
        empty.classList.add('hidden')
    }else{
        empty.classList.remove('hidden')
    }
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

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes))
}
function addNoteToArray (title, text){
        const newNote = {
            id: Date.now(),
            title: title,
            text: text
        }
        notes.push(newNote)
        saveNotes()
        return newNote
    }

if (createBtn){
    createBtn.addEventListener('click', function(){
        const title = titleInput ? titleInput.value : ''
        const text = noteInput.value
        const createdNote = addNoteToArray(title, text)    
        if(text.trim()=== '') return
        renderNote(createdNote.title, createdNote.text, createdNote.id)
if(titleInput) titleInput.value = ''
        noteInput.value = ''
        noteContainer.classList.remove('active')
        titleBlock.classList.add('hidden')
        createBtn.classList.add('hidden')
        noteInput.style.height = 'auto'
        checkEmpty()
    })
}

function openModal(id){
    const note = notes.find(n => n.id === id)
if(note){
        currentEditingId = id
        modalTitle.value = note.title
        modalText.value = note.text
        modal.classList.remove('hidden')
    }
}

saveBtn.addEventListener('click', function(){
    if(currentEditingId !==  null){
        const noteIndex = notes.findIndex(n => n.id === currentEditingId)
        if(noteIndex !== -1){
            notes[noteIndex].title = modalTitle.value
            notes[noteIndex].text = modalText.value
            saveNotes()
            refreshNotes()
        }
    }
    modal.classList.add('hidden')
})

function refreshNotes(){
    notesWrapper.innerHTML = ''
    notes.forEach(note => renderNote(note.title, note.text, note.id))
    checkEmpty()
}

function renderNote(title, text, id){
    const card = document.createElement('div')
    card.classList.add('note-card')
    card.dataset.id = id
    card.addEventListener('click', function(){
        openModal(id)
    })
    const footer = document.createElement('div')
    footer.classList.add('note-footer')
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('deleteBtn')
    deleteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.33333H25M10 11.6667V19.6667M16 11.6667V19.6667M2.5 6.33333L4 22.3333C4 23.0406 4.31607 23.7189 4.87868 24.219C5.44129 24.719 6.20435 25 7 25H19C19.7956 25 20.5587 24.719 21.1213 24.219C21.6839 23.7189 22 23.0406 22 22.3333L23.5 6.33333M8.5 6.33333V2.33333C8.5 1.97971 8.65804 1.64057 8.93934 1.39052C9.22064 1.14048 9.60218 1 10 1H16C16.3978 1 16.7794 1.14048 17.0607 1.39052C17.342 1.64057 17.5 1.97971 17.5 2.33333V6.33333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    deleteBtn.addEventListener('click',function(event){
        event.stopPropagation()
        notes = notes.filter(note => note.id !== id)
        saveNotes()
        card.remove()
        checkEmpty()
    })
if(title){
    const h3 = document.createElement('h3')
    h3.innerText = title
    card.appendChild(h3)
}
const p = document.createElement('p')
    p.innerText = text
    card.appendChild(p)
    footer.appendChild(deleteBtn)
    card.appendChild(footer)
    card.appendChild(deleteBtn)
    notesWrapper.prepend(card)
}

notes.forEach(function(note) {
    renderNote(note.title, note.text, note.id)
})
    checkEmpty()