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
    const results=document.getElementById('results');
    results.style.display='none';
    document.querySelector('main').classList.add('active');
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
await fetch_data_from_server(`https://api.themoviedb.org/3//genre/movie/list?api_key=${api_key}&&language=${language}`,
async (data)=> {
    for(const {id,name} of data['genres']){
        genreslist[id]=name;
    }
});

const movieId=await window.localStorage.getItem('movieId');
fetch_data_from_server(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&&append_to_response=casts,videos,images,release&&language=${language}`,
    (movie)=>{
        const {
            poster_path,
            title,
            overview,
            genres,
            runtime,
            release_date,
            casts: { cast ,crew},
            videos,
            images,
        }=movie;
        document.title= title+' '+'Movie';
        //translate genere ids to genere names
        for(let i=0;i<genres.length;i++){
            genres[i]=genreslist[genres[i]['id']];
        }
        //span for each genere
        genres.forEach((genre,index)=>{
            genres[index]=`<span class="bg-red-600 rounded-xl px-2 ">${genre}</span>`;
        });
        //get all casts names
        const casts_names=[];
        for(let i=0;i<movie.casts.cast.length;i++){
            casts_names.push(movie.casts.cast[i].name);
        }
        //get all directors
        const directors=[];
        for(let i=0;i<movie.casts.crew.length;i++){
            if(movie.casts.crew[i].job==='Director'){
                directors.push(movie.casts.crew[i].name);
            }
        }
        const container_div=document.createElement('div');
        container_div.classList.add('class','margin-x-auto');

        container_div.innerHTML=`
        <div class="holder relative ">
            <div class="details-sec w-full h-fit ">
                <div id="details-background-img" class="img overflow-hidden w-screen bg-cover object-cover bg-center">
                    <img src="${imageBaseUrl}w1280${poster_path}" class='object.cover w-screen bg-cover' alt="">
                </div>
                <div id="details" class="flex flex-row absolute px-[10px] h-[53%] top-0 w-screen ">
                    <div id="details-img" class="img max-w-[230px] max-h-[600px] flex bg-cover absolute top-[35px] object-cover bg-center ">
                        <img src="${imageBaseUrl}w500${poster_path}" class='rounded-3xl object.cover  bg-cover' alt="">
                    </div>
                    <div id="details-desc" class="desc p-6 flex flex-col gap-5 top-[18px] w-[68%] h-full absolute left-[240px]">
                        <p class="text-[35px] leading-[35px] font-semibold">${title}</p>
                        <div class="info  flex flex-row w-2/3 text-xl justify-around">
                            <p class="flex items-center"><img src="images/star.png" class="" width="17px" alt="">8.4</p>
                            <p>${runtime}m</p>
                            <p>${release_date.split('-')[0]}</p>
                            <p class="bg-slate-600 rounded-xl px-2 ">PG-13</p>
                        </div>
                        <div class="genre  text-xl">${genres}</div>
                        <div id='overview' class="movie-details text-2xl flex flex-col gap-7">
                            <div class="leading-[20px] overflow-scroll h-[35%]">
                                ${overview}
                            </div>
                            <div class="flex h-[100px] ">
                                <span class="mr-[40px] brightness-50">Starring:</span>
                                <span class="brightness-50 overflow-scroll">${casts_names}</span>
                            </div>
                            <div>
                                <span class="brightness-50 mr-6">Directed By </span>  ${directors}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="videos ">
                        <h1 class="text-[22px] mb-3 font-semibold">Trailers and Clips</h1>
                        <div class="video-slider flex relative h-[200px] overflow-y-hidden overflow-scroll w-full gap-5 ">

                        </div>
            </div>
            <div class="images w-full h-fit mb-8">
                        <h1 class="text-[22px] mb-3 font-semibold">Images</h1>
                        <div class="images-slider flex h-[200px] relative w-full  gap-5 ">
                        </div>
            </div>
        </div>
        `;
        const movie_details=document.getElementById('movie-details');
        movie_details.appendChild(container_div);
        // add videos to video slider where type is trailer
        if(videos.results.length!=0){
        for(const{key,name,type} of videos.results){
            if(type==='Trailer'){
                const video=document.createElement('div');
                video.classList.add('video');
                video.innerHTML=`<iframe width="300" height="180" class=' overflow-scroll' src="https://www.youtube.com/embed/${key}" title="${name}" allowfullscreen accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                class='rounded-2xl'></iframe>`;
                document.querySelector('.video-slider').appendChild(video);
            }
        }}
        else{
            document.querySelector('.video-slider').innerHTML=`<h1 class="text-[22px] w-full h-full justify-center flex items-center mb-3 font-semibold">No Videos</h1>`;
        }
        
        // add images to images slider
        if(images.backdrops.length!=0){
        const image=document.createElement('div');
        image.classList.add('image');
        image.setAttribute('class','flex h-[200px]  w-screen overflow-scroll gap-5 ');
        for(const{file_path} of images.backdrops){
            image.innerHTML+=`
            <img src="${imageBaseUrl}/w342/${file_path}" alt="" class='rounded-2xl'>`
            ;
            document.querySelector('.images-slider').appendChild(image);
            
        }}
        else{
            document.querySelector('.images-slider').innerHTML=`<h1 class="text-[22px] w-full h-full justify-center flex items-center mb-3 font-semibold">No Images</h1>`;
        }

    }
);
// fetch data from server to get similar movies
console.log()
fetch_data_from_server(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&language=${language}&page=1`,
(movies)=>{
    for(const movie of movies.results){
        const{
        poster_path,
        title,
        release_date,
        id,
        vote_average
        }=movie;
    
    const content=document.getElementById('content');
    content.innerHTML+=`
    <a href="/details.html">    
    <button id='movie-link' movie-id='${id}' class="flex flex-col max-w-[160px] min-w-[160px]  relative h-[250px]  bg-cover bg-center">
                <!-- movie image -->
                <div class="movie-image overflow-hidden rounded-2xl bg-center bg-cover h-[80%] w-full">
                    <img src="${imageBaseUrl}w342${poster_path}" class="object-cover">
                </div> 
                <!-- movie name -->
                <div class="movie-name w-full flex flex-row h-[10%] mt-3 ">
                    <pre class="text-2xl text-ellipsis overflow-hidden font-semibold">${title}</pre>
                </div> 
                <!-- movie rate -->
                <div class="year-rate flex absolute  bottom-0 flex-row w-full justify-between text-lg">
                    <p class="rate flex items-center text-xl"><img src="images/star.png" width="15px" alt="">${vote_average.toPrecision(2)}</p>
                    <p class="year text-xl">${release_date.split('-')[0]}</p>   
                </div>
            </button>
            </a>
    `
}
    if(movies.results.length===0){
        document.querySelector('#content').innerHTML=`<h1 class="text-[22px] w-full h-full justify-center flex items-center mb-3 font-semibold">No Similar Movies</h1>`;
    }
});
setTimeout(get_movieid,500);

search();
//scroll up function
scroll_Up();