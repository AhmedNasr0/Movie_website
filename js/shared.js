
//store movie id by click in movie in local storage to use it in details page 
import { fetch_data_from_server,api_key,imageBaseUrl } from "../js/api.js";
export function get_movieid(){
    const a=document.querySelectorAll('#movie-link');
    for(let i=0;i<a.length;i++){
      a[i].addEventListener('click',()=>{
        // console.log(a[i].getAttribute('movie-id'));
        window.localStorage.setItem('movieId', String(a[i].getAttribute('movie-id')));
      })
    }
  }

