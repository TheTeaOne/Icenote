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
let trash = JSON.parse(localStorage.getItem('trash')) || []
let isTrashMode = false
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

document.getElementById('openTrash').addEventListener('click', function(){
    isTrashMode = !isTrashMode
    refreshNotes()
})

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
    localStorage.setItem('trash', JSON.stringify(trash))
}
function addNoteToArray (title, text){
        const newNote = {
            id: Date.now(),
            title: title,
            text: text,
            isPinned: false,
            createdAt: new Date().toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })
            
        }
        notes.push(newNote)
        saveNotes()
        return newNote
    }

if (createBtn){
    createBtn.addEventListener('click', function(){
        const title = titleInput ? titleInput.value : ''
        const text = noteInput.value 
        if(text.trim()=== '') return
            addNoteToArray(title, text)
            refreshNotes()
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
    const timestampElement = document.getElementById('modalTimestamp')
        if(note.createdAt){
            timestampElement.innerText = `Created: ${note.createdAt}`
        }else {
            timestampElement.innerText = ''
        }
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
    const pinnedWrapper = document.getElementById('pinnedWrapper')
    const notesWrapper = document.getElementById('notesWrapper')
    const pinnedSection = document.getElementById('pinnedSection')
    const othersTitle = document.getElementById('othersTitle')
    const noteContainer = document.getElementById('noteContainer')
        pinnedWrapper.innerHTML = ""
        notesWrapper.innerHTML = ''
    if(!isTrashMode){
        noteContainer.classList.remove('hidden')

    const pinnedNotes = notes.filter(n => n.isPinned)
    const otherNotes = notes.filter(n => !n.isPinned)
        pinnedNotes.forEach(note => renderNote(note, pinnedWrapper))
        otherNotes.forEach(note => renderNote(note, notesWrapper))
    if(pinnedNotes.length > 0){
        pinnedSection.classList.remove('hidden')
        othersTitle.classList.remove('hidden')
    } else{
        pinnedSection.classList.add('hidden')
        othersTitle.classList.add('hidden')
    }
}   else{
        noteContainer.classList.add('hidden')
        pinnedSection.classList.add('hidden')
        othersTitle.classList.add('hidden')
        trash.forEach(note => renderNote(note, notesWrapper))
    }
    checkEmpty()
}

function renderNote(note, container){
    const { title, text, id, isPinned} = note
    const card = document.createElement('div')
    card.classList.add('note-card')
    card.dataset.id = id
    card.addEventListener('click', function(){
        openModal(id)
    })
    const pinBtn = document.createElement('div')
    pinBtn.classList.add('pinBtn')
    pinBtn.innerHTML = `<svg width="17" height="20" viewBox="0 0 17 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 1V9.82353L1 15.7059V18.6471H16V15.7059L13 9.82353V1M8.5 18.6471V26M2.5 1H14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    if(note.isPinned) pinBtn.classList.add('active')
        const footer = document.createElement('div')
        footer.classList.add('note-footer')
        const deleteBtn = document.createElement('div')
        deleteBtn.classList.add('deleteBtn')
        deleteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.33333H25M10 11.6667V19.6667M16 11.6667V19.6667M2.5 6.33333L4 22.3333C4 23.0406 4.31607 23.7189 4.87868 24.219C5.44129 24.719 6.20435 25 7 25H19C19.7956 25 20.5587 24.719 21.1213 24.219C21.6839 23.7189 22 23.0406 22 22.3333L23.5 6.33333M8.5 6.33333V2.33333C8.5 1.97971 8.65804 1.64057 8.93934 1.39052C9.22064 1.14048 9.60218 1 10 1H16C16.3978 1 16.7794 1.14048 17.0607 1.39052C17.342 1.64057 17.5 1.97971 17.5 2.33333V6.33333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
        if (note.isPinned) pinBtn.classList.add('active')
            if (!isTrashMode) {
        card.appendChild(pinBtn)
    }

    const restoreBtn = document.createElement('div');
    restoreBtn.classList.add('restoreBtn');
    restoreBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10H13C17.4183 10 21 13.5817 21 18V20M3 10L8 5M3 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>` 
        
    pinBtn.addEventListener('click', function(e){
            e.stopPropagation()
            note.isPinned = !note.isPinned
            saveNotes()
            refreshNotes()
    })
    deleteBtn.addEventListener('click',function(event){
        event.stopPropagation()
    if(!isTrashMode){
        const noteToTrash = notes.find(n  => n.id === id)
        trash.push(noteToTrash)
        notes = notes.filter(n => n.id !== id)
    } else{
        trash = trash.filter(n => n.id !== id)
    }
        saveNotes()
        card.remove()
        refreshNotes()
    })
        restoreBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        const noteToRestore = trash.find(n => n.id === id)
        if (noteToRestore) {
            notes.push(noteToRestore)
            trash = trash.filter(n => n.id !== id)
            saveNotes()
            refreshNotes()
        }
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
    container.prepend(card)
if (isTrashMode) {
        footer.appendChild(restoreBtn)
    }
}
    refreshNotes()