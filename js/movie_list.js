import {sidebar}from './sidebar.js';
import {imageBaseUrl, api_key,fetch_data_from_server } from "./api.js";
import {get_movieid }from './shared.js';
import { search } from '../js/search.js';
import {pagination_search, pagination_movieList} from '../js/pagination.js';
import {scroll_Up} from '../js/scroll_up.js'

//get language from local storage
const language=window.localStorage.getItem('lang')||'en-US';

// toggle search box in smal devices || mobile devices
const search_box = document.getElementById("search-box");
const close_search = document.getElementById("close-btn");
const search_btn = document.querySelector(".search-btn");
const menu_btn = document.getElementById("menu");
const open_menu=document.getElementById('open-menu');
const close_menu=document.getElementById('close-menu');
const logo = document.querySelector("#logo");
const nav = document.querySelector("nav");  
const search_input=document.getElementById('search-input');
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
// 
let current_page=new URLSearchParams(window.location.search).get('page')||1;
let total_pages=100;

// get all genres from api and save it in local storage 
let genreslist={};
fetch_data_from_server(`https://api.themoviedb.org/3//genre/movie/list?api_key=${api_key}&&language=${language}`,
(data)=>{
    for(const {id,name} of data['genres']){
        genreslist[id]=name;
    }
    genere_name=genreslist[window.localStorage.getItem('genere-id')];
});

let genere_name;

// get all data from local storage
const sort_by_local=window.localStorage.getItem('sort_by')||'popularity.desc';
fetch_data_from_server(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&&with_genres=${window.localStorage.getItem('genere-id')}&page=${current_page}&&language=${language}&sort_by=${sort_by_local}`,
(movies)=>{
    total_pages=movies.total_pages;
    document.title=`${genere_name} Movies`;
    const all_movies=document.getElementById('all-movies');
    all_movies.innerHTML=`<div class='flex items-center justify-between'>
        <h1 class="text-[22px] font-semibold mb-7">All ${genere_name} Movies</h1>
        
    </div> `;
    const content=document.createElement('div');
    content.setAttribute('id','movie-content');
    content.setAttribute('class','flex flex-wrap  w-full  gap-5');
    for( const movie of movies.results){
        const{
            id,
            title,
            poster_path,
            vote_average,
            release_date,
        }=movie;
        content.innerHTML+=`
        <a href=details.html id="movie-link" movie-id=${id} class="flex flex-col w-[160px] relative h-[250px]  bg-cover bg-center">
        <!-- movie image -->
        <div class="movie-image rounded-lg bg-center overflow-hidden bg-cover h-[80%] w-full">
            <img src="${imageBaseUrl}w342${poster_path}" class="rounded-lg object-cover" alt="">
        </div> 
        <!-- movie name -->
        <div class="movie-name w-full flex flex-row h-[10%] mt-3 ">
            <pre class="text-2xl text-ellipsis overflow-hidden font-semibold">${title}</pre>
        </div> 
        <!-- movie rate -->
        <div class="year-rate flex absolute  bottom-0 flex-row w-full justify-between text-lg">
            <p class="rate flex items-center text-lg"><img src="images/star.png" width="15px" alt="">${vote_average}</p>
            <p class="year text-lg px-2 bg-gray-500 rounded-xl">${release_date.split('-')[0]}</p>   
        </div>
        </a>
        `
        document.getElementById('all-movies').appendChild(content);
    }
    
});


search();

setTimeout(()=>{
    get_movieid();
},500)


// filteration

// filteration
const save_btn=document.getElementById('save-btn');
const filter_btn=document.getElementById('filter-btn');
const sort_by_dropdown=document.getElementById('sort-dropdown-btn');
let sort_by;
filter_btn.onclick=()=>{
    const filter=document.getElementById('filter');
    filter.classList.toggle('hidden');
}
sort_by_dropdown.onclick=(e)=>{
    document.getElementById('sort-dropdown-btn').classList.toggle('open-dropdown-sort');
    sort_by=e.target.getAttribute('valuetext');
}
// by click on btn the data will be saved in local storage and reload the page
save_btn.addEventListener('click',(e)=>{
    if(sort_by==undefined){
        sort_by='popularity.desc';
    }
    window.localStorage.setItem('sort_by',sort_by);
    window.location.reload();
})
//pagination
pagination_movieList();
// scroll up function
scroll_Up();