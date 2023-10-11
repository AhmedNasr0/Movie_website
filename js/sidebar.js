
import { api_key,fetch_data_from_server } from "./api.js";
const movie_types=document.getElementById('movie-types');
const languages_types=document.querySelector('.languages-types');
export function sidebar(){
    let genreslist={};
    fetch_data_from_server(`https://api.themoviedb.org/3//genre/movie/list?api_key=${api_key}`,
    (data)=>{
        for(const {id,name} of data['genres']){
            genreslist[id]=name;
        }
        generatlink();
        get_genere();
    });
    let language_list={};
    fetch_data_from_server(`https://api.themoviedb.org/3/configuration/languages?api_key=${api_key}`,
       (data)=>{
        for(const {iso_639_1,english_name,name} of data){
            if(name==''||english_name=='No Language'){
                continue;}
            language_list[iso_639_1]=english_name;
        }
        languages_link();
        get_language();
       } )
    function generatlink(){
        for(let i=0;i<Object.entries(genreslist).length;i++){
            let link=document.createElement('a');
            link.setAttribute('href',`./movie-list.html`);
            link.setAttribute('id','genere-link');
            link.setAttribute('class','font-semibold text-xl opacity-50 hover:opacity-100');
            link.innerText=Object.entries(genreslist)[i][1];
            movie_types.appendChild(link);
        }
    }
    function languages_link(){
        for(let i=0;i<Object.entries(language_list).length;i++){
            let link=document.createElement('a');
            link.setAttribute('href',`./index.html`);
            link.setAttribute('id','language-link');
            link.setAttribute('class','flex justify-between font-semibold mb-4 text-xl opacity-50 hover:opacity-100');
            if(Object.entries(language_list)[i][1]=='English'){
                const div=document.createElement('div');
                div.setAttribute('class','rounded-2xl p-1 text-sm mr-[30px] bg-red-600 w-fit h-fit');
                div.innerHTML='Best Virsion';
                link.innerHTML=Object.entries(language_list)[i][1]+div.outerHTML;
            }
            else
                link.innerText=Object.entries(language_list)[i][1];
            languages_types.appendChild(link);
        }
    }
    function get_genere(){
        const a=document.querySelectorAll('#genere-link');
        for(let i=0;i<a.length;i++){
          a[i].addEventListener('click',()=>{
            window.localStorage.setItem('genere-name', String(Object.entries(genreslist)[i][1]));
            window.localStorage.setItem('genere-id', String(Object.entries(genreslist)[i][0]));
          })
        }
    }
    function get_language(){
        const a=document.querySelectorAll('#language-link');
        for(let i=0;i<a.length;i++){
          a[i].addEventListener('click',()=>{
            window.localStorage.setItem('lang', String(Object.entries(language_list)[i][0]));
          })
        }
    }
}

