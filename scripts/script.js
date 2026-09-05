marked.use({
    gfm: true,
    breaks: true
})
const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")
const overlay = document.getElementById("overlay")


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

const viewToggleBtn = document.querySelector('.viewMode')
const notesContainer = document.getElementById('notesContainer')

const modalImageContainer = document.getElementById('modalImageContainer')
const modalImage = document.getElementById('modalImage')
const deleteModalBtn = document.getElementById('deleteModalBtn')
const removeModalImageBtn = document.getElementById('removeModalImageBtn')
const addModalImageBtn = document.getElementById('addModalImageBtn')
const modalFileInput = document.getElementById('modalFileInput')

const noteFileInput = document.getElementById('noteFileInput')
const imagePreviewContainer = document.getElementById('imagePreviewContainer')
const imagePreview = document.getElementById('imagePreview')
const removeImageBtn = document.getElementById('removeImageBtn')


let currentEditingId = null

const openNote = document.getElementById('openNote')
const openTrash = document.getElementById('openTrash')
const openArchive = document.getElementById('openArchive')

let notes = JSON.parse(localStorage.getItem('notes')) || []
let trash = JSON.parse(localStorage.getItem('trash')) || []
let archive = JSON.parse(localStorage.getItem('archive')) || []
let isTrashMode = false
let isArchiveMode = false

function getCurrentNote() {
    const currentNotes = isArchiveMode ? archive : notes
    return currentNotes.find(note => note.id === currentEditingId)
}

function setSidebarState(isOpen) {
    if (!sidebar || !overlay) return

    sidebar.classList.toggle('open', isOpen)
    overlay.classList.toggle('active', isOpen)
    overlay.setAttribute('aria-hidden', String(!isOpen))
}

function toggleSidebar() {
    setSidebarState(!sidebar.classList.contains('open'))
}

if (burger) {
    burger.addEventListener("click", toggleSidebar)
}

if (overlay) {
    overlay.addEventListener('click', () => setSidebarState(false))

    let swipeStartX = 0
    overlay.addEventListener('touchstart', event => {
        swipeStartX = event.changedTouches[0].clientX
    }, { passive: true })

    overlay.addEventListener('touchend', event => {
        const swipeDistance = event.changedTouches[0].clientX - swipeStartX
        if (Math.abs(swipeDistance) > 50) setSidebarState(false)
    }, { passive: true })
}

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
        refreshNotes()
        })
    }

function checkEmpty(){
    const pinnedWrapper = document.getElementById('pinnedWrapper')
    const notesWrapper = document.getElementById('notesWrapper')
    const emptyText = document.getElementById('emptyText')
    const searchValue = searchInput ? searchInput.value.trim() : ""
    const hasNotes = pinnedWrapper.children.length > 0 || notesWrapper.children.length > 0

    if (hasNotes) {
        empty.classList.add('hidden');
    } else {
        empty.classList.remove('hidden');
        if (emptyText) {
            if (searchValue.length > 0) {
                emptyText.innerText = "No Results found for your search"
            } else if (isTrashMode) {
                emptyText.innerText = "There is nothing in the basket"
            } else if(isArchiveMode){
                emptyText.innerText = "Archived notes will be stored here"
            } else {
                emptyText.innerText = "Here will be your notes"
            }
        }
    }
}

function  updateActiveTab(clickElement) {
    const currentActive = document.querySelector('.sidebar-item.active')
    const headerName = document.getElementById('headerName')        
    if (currentActive){
        currentActive.classList.remove('active')

    }
    clickElement.classList.add('active')
}

openNote.addEventListener('click', function(){
    isTrashMode = false
    isArchiveMode = false
    headerName.innerText = 'IceNote'
    updateActiveTab(this)
    refreshNotes()
})

openTrash.addEventListener('click', function(){
    isTrashMode = true
    isArchiveMode = false
    headerName.innerText = 'Trash'
    updateActiveTab(this)
    refreshNotes()
})

openArchive.addEventListener('click', function(){
    isArchiveMode = true
    isTrashMode = false
    headerName.innerText = 'Archive'
    updateActiveTab(this)
    refreshNotes()
})

document.getElementById('cleanBtn').addEventListener('click', function(){
    if(confirm ("Are you sure you want to empty the basket?")) {
        trash = []
        saveNotes()
        refreshNotes()
    }
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
    localStorage.setItem('archive', JSON.stringify(archive))
}
function addNoteToArray (title, text){
        const newNote = {
            id: Date.now(),
            title: title,
            content: text,
            image: currentNoteImage,
            text: text,
            isPinned: false,
            reminder: null,
            createdAt: new Date().toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })
            
        }
        notes.push(newNote)
        saveNotes()
        currentNoteImage = ''
        if (noteFileInput) noteFileInput.value = ''
        if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden')
        return newNote
    }

    function openModal(id) {
    if (isTrashMode) return

    const currentNotes = isArchiveMode ? archive : notes
    const note = currentNotes.find(n => n.id === id)
    if (!note) return

    currentEditingId = id
    modalTitle.value = note.title || ''
    modalText.value = note.text || ''

    if (note.image && modalImageContainer && modalImage) {
        modalImage.src = note.image
        modalImageContainer.classList.remove('hidden')
        if (removeModalImageBtn) removeModalImageBtn.classList.remove('hidden')
    } else if (modalImageContainer) {
        modalImageContainer.classList.add('hidden')
        if (removeModalImageBtn) removeModalImageBtn.classList.add('hidden')
    }

    const timestampElement = document.getElementById('modalTimestamp')
    if (timestampElement) {
        timestampElement.innerText = note.createdAt ? `Created: ${note.createdAt}` : ''
    }
    modal.classList.remove('hidden')
}

if (removeModalImageBtn) {
    removeModalImageBtn.addEventListener('click', function() {
        const note = getCurrentNote()
        if (!note) return

        note.image = ''
        modalImage.src = ''
        modalImageContainer.classList.add('hidden')
        removeModalImageBtn.classList.add('hidden')
        saveNotes()
        refreshNotes()
    })
}

if (addModalImageBtn && modalFileInput) {
    addModalImageBtn.addEventListener('click', function() {
        modalFileInput.click()
    })

    modalFileInput.addEventListener('change', async function(event) {
        const file = event.target.files[0]
        const note = getCurrentNote()
        if (!file || !note) return

        try {
            note.image = await compressImage(file)
            modalImage.src = note.image
            modalImageContainer.classList.remove('hidden')
            removeModalImageBtn.classList.remove('hidden')
            saveNotes()
            refreshNotes()
            modalFileInput.value = ''
        } catch (error) {
            console.error(error)
            alert('Could not process this image. Please choose another file.')
        }
    })
}

if (deleteModalBtn) {
    deleteModalBtn.addEventListener('click', function() {
        if (currentEditingId !== null) {
            const currentNotes = isArchiveMode ? archive : notes
            const noteToTrash = getCurrentNote()
            if (noteToTrash) {
                trash.push(noteToTrash)
                if (isArchiveMode) {
                    archive = currentNotes.filter(n => n.id !== currentEditingId)
                } else {
                    notes = currentNotes.filter(n => n.id !== currentEditingId)
                }
                saveNotes()
                refreshNotes()
            }
            modal.classList.add('hidden')
            currentEditingId = null
        }
    })
}

if (saveBtn) {
    saveBtn.addEventListener('click', function() {
        if (currentEditingId !== null) {
            const currentNotes = isArchiveMode ? archive : notes
            const noteIndex = currentNotes.findIndex(n => n.id === currentEditingId)
            if (noteIndex !== -1) {
                currentNotes[noteIndex].title = modalTitle.value.trim()
                currentNotes[noteIndex].text = modalText.value.trim()
                currentNotes[noteIndex].content = currentNotes[noteIndex].text
                saveNotes()
                refreshNotes()
            }
        }

        modal.classList.add('hidden')
        currentEditingId = null
    })
}

if (modal) {
    modal.addEventListener('click', function(event) {
        if (event.target === modal && window.innerWidth > 1024) {
            modal.classList.add('hidden')
            currentEditingId = null
        }
    })
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden')
        currentEditingId = null
    }
})

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

function refreshNotes() {
    const pinnedWrapper = document.getElementById('pinnedWrapper')
    const notesWrapper = document.getElementById('notesWrapper')
    const pinnedSection = document.getElementById('pinnedSection')
    const othersTitle = document.getElementById('othersTitle')
    const noteContainer = document.getElementById('noteContainer')
    const cleanBtn = document.getElementById('cleanBtn')
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : ""

    pinnedWrapper.innerHTML = ""
    notesWrapper.innerHTML = ""
    
    cleanBtn.classList.add('hidden')
    noteContainer.classList.add('hidden')
    pinnedSection.classList.add('hidden')
    othersTitle.classList.add('hidden')

    if (isTrashMode) {
        const filteredTrash = trash.filter(n =>  
            n.title.toLowerCase().includes(searchValue) || 
            n.text.toLowerCase().includes(searchValue)
        )
        filteredTrash.forEach(note => renderNote(note, notesWrapper))
        
        if(filteredTrash.length > 0){
            cleanBtn.classList.remove('hidden')
        } 
    }else if (isArchiveMode){
            const filteredArchive = archive.filter(n => 
            n.title.toLowerCase().includes(searchValue) || 
            n.text.toLowerCase().includes(searchValue)
        )
            filteredArchive.forEach(note => renderNote(note, notesWrapper))

        } else{
            noteContainer.classList.remove('hidden')
            
            const filteredNotes = notes.filter(n => 
            n.title.toLowerCase().includes(searchValue) || 
            n.text.toLowerCase().includes(searchValue)
        )

        const pinnedNotes = filteredNotes.filter(n => n.isPinned)
        const otherNotes = filteredNotes.filter(n => !n.isPinned)
        
        pinnedNotes.forEach(note => renderNote(note, pinnedWrapper))
        otherNotes.forEach(note => renderNote(note, notesWrapper))

        if (pinnedNotes.length > 0) {
            pinnedSection.classList.remove('hidden')
        }
        if (pinnedNotes.length > 0 && otherNotes.length > 0 && searchValue === "") {
            othersTitle.classList.remove('hidden')
        }
    }
    checkEmpty()
}


function renderNote(note, container){
    const { title, text, id, isPinned} = note
    const card = document.createElement('div')
    card.classList.add('note-card')
    card.dataset.id = id
    if (!isTrashMode) {
        card.addEventListener('click', function(){
            openModal(id)
        })
    }
    
    if (note.image) {
        const imageDiv = document.createElement('div')
        imageDiv.className = 'note-card-image'
        imageDiv.innerHTML = `<img src="${note.image}" alt="Note photo">`
        card.appendChild(imageDiv)
    }

    const pinBtn = document.createElement('div')
    pinBtn.classList.add('pinBtn')
    pinBtn.innerHTML = `<svg width="17" height="20" viewBox="0 0 17 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 1V9.82353L1 15.7059V18.6471H16V15.7059V18.6471H16V15.7059L13 9.82353V1M8.5 18.6471V26M2.5 1H14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    if (note.isPinned) pinBtn.classList.add('active')
    
    if (!isTrashMode) {
        card.appendChild(pinBtn)
    }

    if (title) {
        const h3 = document.createElement('h3')
        h3.innerText = title
        card.appendChild(h3)
    }
    
    const contentDiv = document.createElement('div')
    contentDiv.className = 'note-text'
    contentDiv.innerHTML = marked.parse(text || '')
    card.appendChild(contentDiv)

    const footer = document.createElement('div')
    footer.classList.add('note-footer')
    
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('deleteBtn')
    deleteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.33333H25M10 11.6667V19.6667M16 11.6667V19.6667M2.5 6.33333L4 22.3333C4 23.0406 4.31607 23.7189 4.87868 24.219C5.44129 24.719 6.20435 25 7 25H19C19.7956 25 20.5587 24.719 21.1213 24.219C21.6839 23.7189 22 23.0406 22 22.3333L23.5 6.33333M8.5 6.33333V2.33333C8.5 1.97971 8.65804 1.64057 8.93934 1.39052C9.22064 1.14048 9.60218 1 10 1H16C16.3978 1 16.7794 1.14048 17.0607 1.39052C17.342 1.64057 17.5 1.97971 17.5 2.33333V6.33333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

    const archiveBtn = document.createElement('div')
    archiveBtn.classList.add('archiveBtn')
    archiveBtn.innerHTML = `<svg width="20" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.3333 7C23.0406 7 23.7189 6.68393 24.219 6.12132C24.719 5.55871 25 4.79565 25 4C25 3.20435 24.719 2.44129 24.219 1.87868C23.7189 1.31607 23.0406 1 22.3333 1H3.66667C2.95942 1 2.28115 1.31607 1.78105 1.87868C1.28095 2.44129 1 3.20435 1 4C1 4.79565 1.28095 5.55871 1.78105 6.12132C2.28115 6.68393 2.95942 7 3.66667 7M22.3333 7H3.66667M22.3333 7V22C22.3333 22.7956 22.0524 23.5587 21.5523 24.1213C21.0522 24.6839 20.3739 25 19.6667 25H6.33333C5.62609 25 4.94781 24.6839 4.44772 24.1213C3.94762 23.5587 3.66667 22.7956 3.66667 22V7M10.3333 13H15.6667" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

    const restoreBtn = document.createElement('div')
    restoreBtn.classList.add('restoreBtn')
    restoreBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10H13C17.4183 10 21 13.5817 21 18V20M3 10L8 5M3 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

    pinBtn.addEventListener('click', function(e) {
        e.stopPropagation()
        note.isPinned = !note.isPinned
        saveNotes()
        refreshNotes()
    })
    
    deleteBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        if (!isTrashMode) {
            if (isArchiveMode) {
                const noteToTrash = archive.find(n => n.id === id)
                if (noteToTrash) trash.push(noteToTrash)
                archive = archive.filter(n => n.id !== id)
            } else {
                const noteToTrash = notes.find(n => n.id === id)
                if (noteToTrash) trash.push(noteToTrash)
                notes = notes.filter(n => n.id !== id)
            }
        } else {
            trash = trash.filter(n => n.id !== id)
        }
        saveNotes()
        refreshNotes()
    })
    
    restoreBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        const trashIndex = trash.indexOf(note)
        if (trashIndex === -1) return

        const [noteToRestore] = trash.splice(trashIndex, 1)
        notes.push(noteToRestore)
        saveNotes()
        refreshNotes()
    })

    archiveBtn.addEventListener('click', function(event) {
        event.stopPropagation()
        if (isArchiveMode) {
            const noteToRestore = archive.find(n => n.id === id)
            if (noteToRestore) {
                notes.push(noteToRestore)
                archive = archive.filter(n => n.id !== id)
            }
        } else if (!isTrashMode) {
            const noteToArchive = notes.find(n => n.id === id)
            if (noteToArchive) {
                archive.push(noteToArchive)
                notes = notes.filter(n => n.id !== id)
            }
        }
        saveNotes()
        refreshNotes()
    })

    if (!isTrashMode) {
        footer.appendChild(archiveBtn)
    }
    footer.appendChild(deleteBtn)
    if (isTrashMode) {
        footer.appendChild(restoreBtn)
    }

    card.appendChild(footer)
    container.prepend(card)
}

refreshNotes()


function setViewMode(isListView) {
    notesContainer.classList.toggle('list-view', isListView)
    viewToggleBtn.classList.toggle('is-list-view', isListView)
    localStorage.setItem('notesView', isListView ? 'list' : 'grid')
}

if (viewToggleBtn && notesContainer) {
    setViewMode(localStorage.getItem('notesView') === 'list')

    viewToggleBtn.addEventListener('click', () => {
        setViewMode(!notesContainer.classList.contains('list-view'))
    })
}

const themeMode = document.querySelector('.themeMode')
const savedTheme = localStorage.getItem('theme')
if(savedTheme === 'light'){
    document.body.classList.toggle('light-theme')
}
if(themeMode){
themeMode.addEventListener('click', () =>{
    document.body.classList.toggle('light-theme')
    const isLight = document.body.classList.contains('light-theme')
    localStorage.setItem('theme', isLight ? 'light': 'dark')
})
}

let currentNoteImage = ''

const MAX_IMAGE_SIZE = 1280
const IMAGE_QUALITY = 0.75

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()

        fileReader.onload = function() {
            const image = new Image()

            image.onload = function() {
                const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)

                const context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/webp', IMAGE_QUALITY))
            }

            image.onerror = () => reject(new Error('Image could not be loaded'))
            image.src = fileReader.result
        }

        fileReader.onerror = () => reject(new Error('File could not be read'))
        fileReader.readAsDataURL(file)
    })
}

if (noteFileInput) {
    noteFileInput.addEventListener('change', async function(event) {
        const file = event.target.files[0]
        if (!file) return

        try {
            currentNoteImage = await compressImage(file)
            imagePreview.src = currentNoteImage
            imagePreviewContainer.classList.remove('hidden')
        } catch (error) {
            console.error(error)
            alert('Could not process this image. Please choose another file.')
        }
    })
}

if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () =>{
        currentNoteImage = ''
        noteFileInput.value = ''
        if(imagePreviewContainer){
            imagePreviewContainer.classList.add('hidden')
        }
    })
}
