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
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('deleteBtn')
    deleteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.33333H25M10 11.6667V19.6667M16 11.6667V19.6667M2.5 6.33333L4 22.3333C4 23.0406 4.31607 23.7189 4.87868 24.219C5.44129 24.719 6.20435 25 7 25H19C19.7956 25 20.5587 24.719 21.1213 24.219C21.6839 23.7189 22 23.0406 22 22.3333L23.5 6.33333M8.5 6.33333V2.33333C8.5 1.97971 8.65804 1.64057 8.93934 1.39052C9.22064 1.14048 9.60218 1 10 1H16C16.3978 1 16.7794 1.14048 17.0607 1.39052C17.342 1.64057 17.5 1.97971 17.5 2.33333V6.33333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    deleteBtn.addEventListener('click',function(event){
        event.stopPropagation()
        card.remove()
    })
if(title){
    const h3 = document.createElement('h3')
    h3.innerText = title
    card.appendChild(h3)
}
const p = document.createElement('p')
    p.innerText = text
    card.appendChild(p)
    card.appendChild(deleteBtn)
    notesWrapper.prepend(card)
}
