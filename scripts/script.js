const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")

const noteContainer = document.getElementById('noteContainer')
const noteInput = document.querySelector('.note-input')
const titleBlock = document.getElementById('titleBlock')

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
    })
}

document.addEventListener('click', function(event) {
    if (noteContainer && !noteContainer.contains(event.target) && noteInput.value.trim() === "") {
        noteInput.value = ""
        noteContainer.classList.remove('active')
        titleBlock.classList.add('hidden')
        noteInput.style.height = 'auto'
    }
})