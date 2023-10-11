import { fetch_data_from_server,api_key,imageBaseUrl } from "../js/api.js";

export function pagination_movieList(){
    const prev_page=document.getElementById('prevpage');
    const btn_one=document.getElementById("page1");
    const btn_two=document.getElementById('page2');
    const btn_three=document.getElementById('page3');
    const btn_four=document.getElementById('page4');
    const btn_five=document.getElementById('page5');
    const btn_num=document.getElementById('pagenum');
    const next_page=document.getElementById('nextpage');
    const urlparams=new URLSearchParams(window.location.search);
    // check if pages is active or not and mark it with class active-page if it active
    function pagination_active(btns){

        page=parseInt(urlparams.get('page'));
        btns.forEach((btn)=>{
            if(page==btn.innerText){
                btn.classList.add('active-page');
            }

            else if(page >=6 && window.innerWidth>375){
               next_page.classList.add('active-page');
            }
            else if(page >=2 && window.innerWidth<375){
                btn_num.classList.add('active-page');
            }
            else if(page==1){
                prev_page.classList.add('hidden');
                btn_num.classList.remove('active-page');
            }
        }
        )
        
    }
    
    var page=urlparams.get('page')||1; // get page number from url if not found set it to 1
    //when click on any paggination butto 
    // set page number in url with his page value
    // push state to change url without reload page 
    // set href to change url when click on button 
    // after that when data fetched from api it will take page number from url and set it to page number in api url
    prev_page.addEventListener('click',()=>{
        // check if page is not found in url set it to 1
        if(!page){
            urlparams.append('page',1)
        }
        // check if page is 1 or 0 so set it to 1
        else{
            if(page==1||page==0){
            page=1
            }else{
            page=page-1;
            }
        // set page number in url // push state to change url without reload page // set href to change url when click on button
        urlparams.set('page',page);
        history.pushState(null,"",window.location.pathname,"?"+urlparams.toString())
        prev_page.href=window.location.pathname+"?"+urlparams.toString();
    }})
    btn_one.addEventListener('click',()=>{
        var page=1
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_one.href=window.location.pathname+"?"+urlparams.toString();
        
    })
    btn_num.innerText=urlparams.get('page');
    btn_num.addEventListener('click',()=>{
        btn_num.innerText=urlparams.get('page')||2;
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_num.href=window.location.pathname+"?"+urlparams.toString();
    })
    btn_two.addEventListener('click',()=>{
        var page=2
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_two.href=window.location.pathname+"?"+urlparams.toString();
    })
    btn_three.addEventListener('click',()=>{
        page=3
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_three.href=window.location.pathname+"?"+urlparams.toString();
    })
    btn_four.addEventListener('click',()=>{
        page=4
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_four.href=window.location.pathname+"?"+urlparams.toString();
    })
    btn_five.addEventListener('click',()=>{
        page=5;
        urlparams.set('page',page)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        btn_five.href=window.location.pathname+"?"+urlparams.toString();
    })
    next_page.addEventListener('click',()=>{
        page++;
        
        urlparams.set('page',page||2)
        history.pushState(null,"",window.location.pathname+"?"+urlparams.toString())
        next_page.href=window.location.pathname+"?"+urlparams.toString();
    })
//call pagination_active function
    pagination_active(document.querySelectorAll('.btn'));

}

export function pagination_search(){
    const prev_page=document.getElementById('prevpage');
    const btn_one=document.getElementById("page-1");
    const btn_two=document.getElementById('page-2');
    const next_page=document.getElementById('nextpage');
    const urlparams=new URLSearchParams(window.location.search);
    
    var page=1; //set page to 1
    // check if pages is active or not and mark it with class active-page if it active
    function pagination_active(btns){
        btns.forEach((btn)=>{
            btn.classList.remove('active-page');
            if(page==1){
                btn_one.classList.add('active-page');
                btn_two.classList.remove('active-page');
            }
            else if(page>=2){
                btn_two.classList.add('active-page');
            }
        }
    )
    }
    //when click on any paggination button
    // set page number in url with his page value
    // push state to change url without reload page 
    // set href to change url when click on button 
    // after that when data fetched from api it will take page number from url and set it to page number in api url
    prev_page.addEventListener('click',()=>{
        // check if page is not found in url set it to 1
        if(!page){
            urlparams.append('search_page',1)
        }
        // check if page is 1 or 0 so set it to 1
        else{
            if(page==1||page==0){
            page=1
            }else{
            page=page-1;
            btn_two.innerText=page;
            }
        // set page number in url // push state to change url without reload page // set href to change url when click on button
        urlparams.set('search_page',page);
        fetch_data(page);
    }})
    btn_one.addEventListener('click',()=>{
        var page=1
        fetch_data(page);
    })
    btn_two.addEventListener('click',()=>{
        var page=2
        fetch_data(page);
    })
    next_page.addEventListener('click',()=>{
        page++;
        btn_two.innerText=page;
        fetch_data(page);
    })
//call pagination_active function
for(let btn of document.querySelectorAll('.btn')){
    btn.addEventListener('click',()=>{
        pagination_active(document.querySelectorAll('.btn'));
    })
}
}

function fetch_data(page){
    document.getElementById('search-result').remove();
    const search= document.getElementById('search-input');
        const search_value=search.value.trim();
        const results=document.getElementById('results');
        const search_result=document.createElement('div');
            search_result.setAttribute('id','search-result');
            search_result.setAttribute('class','flex flex-wrap  w-screen  gap-5');
    fetch_data_from_server(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${search_value}&language=${window.localStorage.getItem('lang')}&page=${page}`,
                (movies)=>{
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
                            <p class="rate flex items-center text-lg"><img src="images/star.png" width="15px" alt="">${vote_average}</p>
                            <p class="year text-lg px-2 bg-gray-500 rounded-xl">${release_date.split('-')[0]}</p>   
                        </div>
                        </a>
                        `
                    }
                    results.appendChild(search_result);
                }
            )
}