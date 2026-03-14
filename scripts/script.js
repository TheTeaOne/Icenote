const burger = document.getElementById("burger")
const sidebar = document.querySelector(".sidebar")

burger.addEventListener("click",function(){
    sidebar.classList.toggle("open")
})