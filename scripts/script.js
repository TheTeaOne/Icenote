const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")

burger.addEventListener("click",function(){
    sidebar.classList.toggle("open")
})

const noteInput = document.querySelector('.note-input')
    if(noteInput){
    noteInput.addEventListener('input', function(){
        this.style.height = 'auto'
        if(this.vaule === ''){
            this.style.height = ''
        }else{
            this.style.height = this.scrollHeight + 'px'
        }
    })
}