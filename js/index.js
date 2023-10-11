import {sidebar}from './sidebar.js';
import {imageBaseUrl, api_key,fetch_data_from_server } from "./api.js";
import {get_movieid} from './shared.js';
import { search } from '../js/search.js';
import {scroll_Up} from '../js/scroll_up.js'
//get language from local storage
const language=window.localStorage.getItem('lang')||'en-US';
//toggle search box in smal devices || mobile devices
const search_box = document.getElementById("search-box");
const close_search = document.getElementById("close-btn");
const search_btn = document.querySelector(".search-btn");
const menu_btn = document.getElementById("menu");
const open_menu=document.getElementById('open-menu');
const close_menu=document.getElementById('close-menu');
const logo = document.querySelector("#logo");
const nav = document.querySelector("nav");  
// 
close_search.addEventListener("click", () => {
  search_box.classList.toggle("not-active");
    check(search_btn);
    check(menu_btn);
    check(logo);
});
// 
search_btn.addEventListener("click", () => {
  search_box.classList.toggle("not-active");
  check(search_btn);
  check(menu_btn);
  check(logo);
});
// check if element has hidden => (display:flex (tailwind class)) class
function check(element) {
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}
// when click on (open menu button) so (open menu btn hidden) and (close menu btn showen) and nav appear
open_menu.addEventListener('click',()=>{
  open_menu.classList.add('hidden');
  close_menu.classList.remove('hidden');
  nav.classList.remove('not-active');
})
// when click on (close menu button) so (open menu btn shown) and (close menu btn hidden) and nav disappear
close_menu.addEventListener('click',()=>{
  open_menu.classList.remove('hidden');
  close_menu.classList.add('hidden');
  nav.classList.add('not-active');
})

//////////////////
sidebar();
//////////////////
// fetch data from server to get genres list and store it in genreslist object 
// to transfer get id of genre to name of genre
let genreslist={};
await fetch_data_from_server(`https://api.themoviedb.org/3//genre/movie/list?api_key=${api_key}`,
async (data)=> {
    for(const {id,name} of data['genres']){
        genreslist[id]=name;
    }
    await fetch_data_from_server(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&&page=1&language=${language}`,banner);
    for(const {title,url} of Home_Page_Section){
      await fetch_data_from_server(`https://api.themoviedb.org/3${url}?api_key=${api_key}&language=${language}`,createSection,title);
    }
});

const banner=function({results:movieList}){
  let indexOfcontroleritem=0;
  const slider_control_content=document.getElementById('slider-control-content');
  for( const [index,movie] of movieList.entries()){
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id
    }=movie
    
    // get genre name from genre id
    for(let i=0;i<genre_ids.length;i++){
      genre_ids[i]=genreslist[genre_ids[i]] ;
    }
    //span for each genere
    genre_ids.forEach((genre,index)=>{
      genre_ids[index]=`<span class="bg-red-600 rounded-xl px-2 ">${genre}</span>`;
  });
    const banner_slider=document.getElementById('banner-slider');
    let slider_item=document.createElement('div');
    slider_item.setAttribute('class','slider-item  absolute top-0 w-full h-fit left-[120%]');
    slider_item.setAttribute('id','banner-slider-item');
    slider_item.innerHTML= `
    <div class="bg-cover w-full h-[620px] opacity-30">
      <img 
        id="banner-img" 
        src="${imageBaseUrl}w1280${backdrop_path}" 
        class="w-full h-full object-cover"
        alt="" 
        />
    </div>
    <div
      class="banner-content  absolute px-[15px] w-full h-[280px] flex flex-col gap-4 top-[140px]"
    >
      <p
        class="header text-[35px] absolute h-[80px] overflow-hidden top-0 w-[90%] font-semibold tracking-[0.5px] leading-[35px]"
      >
        ${title}
      </p>
      <div
        class="list flex gap-3 absolute h-[20px] w-full top-[30%] text-xl"
      >
        <div
          class="item flex items-center gap-1 mr-7 opacity-70 text-2xl"
        >
          ${release_date.split('-')[0]}
        </div>
        <div
          class="item flex items-center bg-gray-500 gap-1 justify-center text-center py-1 pl-1 pr-2 font-bold bg-opacity-60 rounded-lg"
        >
          <img src="images/star.png" width="15px" alt="" /> ${vote_average}
        </div>
      </div>

      <p
        class="genre text-xl absolute top-[40%] opacity-75 h-[20px] w-full"
      >
        ${genre_ids}
      </p>
      <p
        class="banner-text text-xl absolute top-[48%] w-[90%] h-[100px] overflow-scroll opacity-75"
      >
        ${overview}
      </p>
      
      <a
        href="/details.html"
        id="movie-link"
        class="flex items-center absolute bottom-[0%] w-fit py-3 px-7 rounded-xl bg-red-600 hover:bg-red-400"
        
        movie-id="${id}"
      >
      
        <img src="./images/play_circle.png" width="23px" alt="" />
        <span>Watch Now</span>
      </a>

    </div>
    `;
    indexOfcontroleritem++;
    
    slider_control_content.innerHTML+=`
    <button
    id="slider-control-item" control-index="${indexOfcontroleritem}"
    class="min-w-[90px] w-[90px] h-[150px] bg-center bg-cover rounded-xl  brightness-50"
  >
    <img src="${imageBaseUrl}w1280${poster_path}" class="rounded-xl" alt="" />
  </button>
    `;
    banner_slider.appendChild(slider_item);
    
  }
  Slider();
}

const Slider=function(){
    // get all slider items and slider control items
    const slider_item=document.querySelectorAll('#banner-slider-item');
    const slider_control_item=document.querySelectorAll('#slider-control-item');
    // set first slider item and slider control item as active
    let active_slider_item=slider_item[0];
    let active_slider_control_item=slider_control_item[0];
    active_slider_item.classList.add('active-banner-slider');
    active_slider_control_item.classList.add('active');
    // add Click event listener to all slider control items
    // when click on slider control item
    // remove active class from active slider item and slider control item
    // add active class to clicked slider item and slider control item
    // set active slider item and slider control item to clicked slider item and slider control item
    for(let i=0;i<slider_control_item.length;i++){
      slider_control_item[i].addEventListener('click',()=>{
        active_slider_item.classList.remove('active-banner-slider');
        active_slider_control_item.classList.remove('active');
        slider_item[i].classList.add('active-banner-slider');
        slider_control_item[i].classList.add('active');
        active_slider_item=slider_item[i];
        active_slider_control_item=slider_control_item[i];
      })
    }
}

const Home_Page_Section=[
  {
    title:'Upcoming Movies',
    url:'/movie/upcoming'
  },
  {
    title:'Popular Movies',
    url:'/movie/popular'
  },
  {
    title:'Top Rated Movies',
    url:'/movie/top_rated'
  },
  {
    title:'Trending Movies in This Week',
    url:'/trending/movie/week'
  }
]

// create section function
function createSection({results:movieList},title){
  const section=document.createElement('section');
  section.setAttribute('class','z-[-1] shadow-lg section-movies p-5 h-[400px] overflow-hidden w-full');
  section.innerHTML=`
  <h1 class="text-[22px] font-semibold mb-1">${title}</h1>
  <p class="w-[75px] bg-red-700 rounded-xl h-[4px] mb-5"></p>
  `;
  const content=document.createElement('div');
  content.setAttribute('class','flex w-full overflow-scroll gap-5');
  for(const movie of movieList){
    const {
    poster_path,
    title,
    vote_average,
    release_date,
    id} = movie;   
    content.innerHTML+= `
   <a  
      href="/details.html"
      id="movie-link"
      movie-id="${id}"
    > <button
    class="flex flex-col min-w-[160px] w-[160px] relative h-[250px] bg-cover bg-center"
    
  >
    <!-- movie image -->
    <div
      class="movie-image rounded-lg bg-center overflow-hidden bg-cover h-[83%] bg-slate-500 w-full"
    >
    <img src="${imageBaseUrl}w342${poster_path}" class="object-cover">
  </div>
    <!-- movie name -->
    <div class="movie-name w-full flex flex-row  h-[10%] ">
      <p class="text-2xl text-ellipsis overflow-hidden font-semibold mt-2.5">
        ${title}
        </p
      >
    </div>
    <!-- movie rate -->
    <div
      class="year-rate flex absolute bottom-0  flex-row w-full justify-between text-lg mt-2.5"
    >
      <p class="rate flex items-center text-xl">
        <img src="images/star.png" width="15px" alt="" /> ${vote_average}
      </p>
      <p class="year text-xl">${release_date.split('-')[0]}</p>
    </div>
  </button> </a>
    `
}
  section.appendChild(content);
  document.querySelector('main').appendChild(section); 
  
}

// store movie id by click in movie in local storage to use it in details page
setTimeout(get_movieid,1000)
search();

//scroll up function
scroll_Up();