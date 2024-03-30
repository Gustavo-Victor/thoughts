// password icons
const icons = window.document.getElementsByClassName("icon-div"); 
const iconsArray = [...icons]; 
iconsArray.forEach(iconDiv => {
    iconDiv.addEventListener("click", () => {
        let inputPassword = iconDiv.previousElementSibling; 
        let icon = iconDiv.firstElementChild; 

        if(inputPassword.type == "password") {
            inputPassword.type = "string"; 
            icon.classList.remove("bi-eye"); 
            icon.classList.add("bi-eye-slash"); 
        } else {
            inputPassword.type = "password"; 
            icon.classList.remove("bi-eye-slash"); 
            icon.classList.add("bi-eye"); 
        }
    }); 

});


// nav 
const navIcon = window.document.querySelector(".nav-icon"); 
const navList = window.document.querySelector(".nav-list"); 
navIcon.addEventListener("click", () => {
    navList.classList.toggle("active"); 

    if(navList.classList.contains("active")) {
        window.document.body.style.overflow = "hidden"; 
    } else {
        window.document.body.style.overflow = "auto"; 
    }
});


// modal
const modalWrapper = window.document.querySelector(".modal-wrapper"); 
const cancelBtn = window.document.querySelector(".modal-cancel-btn");
const openModalBtn = window.document.querySelector(".open-modal-btn");

openModalBtn.addEventListener("click", () => {
    modalWrapper.classList.add("active"); 
    window.document.body.style.overflow = "hidden";
}); 

cancelBtn.addEventListener("click", () => {
    modalWrapper.classList.remove("active"); 
    window.document.body.style.overflow = "auto";
}); 
