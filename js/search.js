import { fetch_data_from_server,api_key,imageBaseUrl } from "../js/api.js";
import {get_movieid }from './shared.js';
import { pagination_search } from "../js/pagination.js";
//get language from local storage
const language=window.localStorage.getItem('lang')||'en-US';

// search function to search for movies by name 
// and show results in search page
// and store movie id by click in movie in local storage to use it in details page
export async function search(){
    const search=await document.getElementById('search-input');
    const loader=document.getElementById('loading');
    search.addEventListener('input',()=>{    
        loader.classList.remove('hidden');
        document.querySelector('main').classList.remove('active');
        const search_value=search.value.trim();
        const results=document.getElementById('results');
        if(!search.value.trim())
        {
            loader.classList.add('hidden');
            results.style.display='none';
            document.querySelector('main').classList.add('active');
        }
        else {
            // show results in search page
            const page=new URLSearchParams(window.location.get).get('search_page')||1;
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
            fetch_data_from_server(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${search_value}&language=${language}&page=${page}`,
                (movies)=>{
                    
                    results.style.display='block';
                    results.innerHTML=`
            <div id="top" class="flex flex-row justify-between">
                <div class="flex flex-col">
                    <h1 class="text-[20px] brightness-[.8] text-red-600 font-bold">Results for</h1>
                    <h1 class="text-[30px] font-semibold mb-7">${search_value}</h1>
                </div>
                <div  w-full h-full >
                    <div id="pagination" class="pagination-btns relative top-[17px] w-fit mb-10 bottom-0 mt-3" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group flex bg-white rounded-2xl h-[25px]  w-fit flex-row" role="group" aria-label="First group">
                            <span id="prevpage" type="button" class="btn w-[20px] py-1 px-[6px]  text-black  rounded-full relative justify-between text-[12px] font-semibold flex ">
                                <i class="fa-solid absolute left-3 top-[7px] fa-chevron-left"></i>
                            </span>
                            <span id="page-1"  class="btn hover:cursor-pointer text-black text-[13px] font-semibold  py-1 px-4 rounded-full ">1</span>
                            <span  class=" text-black text-[13px] font-semibold hover:cursor-pointer py-1 px-2  rounded-full  ">..</span>
                            <span id="page-2"  type="button" class="btn  text-black text-[13px] font-semibold hover:cursor-pointer py-1 px-4  rounded-full  ">2</span>
                            <span id="nextpage" type="button" class="btn w-[20px] py-1 px-[6px] text-black  rounded-full relative hover:cursor-pointer justify-between text-[12px] font-semibold flex ">
                                <i class="fa-solid absolute left-3 top-[7px] fa-chevron-right"></i>
                            </span>
                        </div> 
                    </div>
                </div>
            </div>
            `;
            const search_result=document.createElement('div');
            search_result.setAttribute('id','search-result');
            search_result.setAttribute('class','flex flex-wrap  w-screen  gap-5');
                    for( const movie of movies.results){
                        const{
                            id,
                            title,
                            poster_path,
                            vote_average,
                            release_date,
                        }=movie;
                        search_result.innerHTML+=`
                        <a href=details.html id="movie-link" movie-id='${id}' class="flex flex-col w-[160px] relative h-[250px]  bg-cover bg-center">
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
                            <p class="rate flex items-center text-lg"><img src="images/star.png" width="15px" alt="">${vote_average.toPrecision(2)}</p>
                            <p class="year text-lg px-2 bg-gray-500 rounded-xl">${release_date.split('-')[0]}</p>   
                        </div>
                        </a>
                        `
                    }
                    setTimeout(get_movieid,500);
                    results.appendChild(search_result);
                }
                
            )
            // call pagination_search function
            // it delete the old fetched data and fetch new data
            // depend on the number of page the user click on or pagginate to
            setTimeout(pagination_search,700);
            
        }
    })
  
}