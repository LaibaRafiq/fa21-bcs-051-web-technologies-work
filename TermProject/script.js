const navEl= document.querySelector('.navbar');
window.addEventListener('scroll',()=> {
  if(window.scrollY>=45){
    navEl.classList.add('navbar-scrolled')
  }
  else if(window.scrollY <45){
    navEl.classList.remove('navbar-scrolled')
  }
})

const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".img-slide");
const contents = document.querySelectorAll(".content");
let sliderNav = function(manual) {
    btns.forEach((btn) => {
        btn.classList.remove("active");
    });

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    contents.forEach((content) => {
        content.classList.remove("active");
    });

    btns[manual].classList.add("active");
    slides[manual].classList.add("active");
    contents[manual].classList.add("active");
};

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});
let daysItem = document.querySelector("#days");
let hoursItem = document.querySelector("#hours");
let minItem = document.querySelector("#min");
let secItem = document.querySelector("#sec");

let countDown = () => {
  let futureDate = new Date("1 Jan 2025");
  let currentDate = new Date();
  let myDate = futureDate - currentDate;
  
  if (myDate < 0) {
    daysItem.innerHTML = 0;
    hoursItem.innerHTML = 0;
    minItem.innerHTML = 0;
    secItem.innerHTML = 0;
    return; 
  }

  let days = Math.floor(myDate / 1000 / 60 / 60 / 24);
  let hours = Math.floor(myDate / 1000 / 60 / 60) % 24;
  let min = Math.floor(myDate / 1000 / 60) % 60;
  let sec = Math.floor(myDate / 1000) % 60;

  daysItem.innerHTML = days;
  hoursItem.innerHTML = hours;
  minItem.innerHTML = min;
  secItem.innerHTML = sec;
}

countDown();
setInterval(countDown, 1000);