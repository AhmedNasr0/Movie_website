
const api_key='c605014f128e6ae264a13debe55f1208';
const imageBaseUrl="https://image.tmdb.org/t/p/";

// fetch data from server using url + private api key and pass result in json data; 
const fetch_data_from_server =(url,callback,optional_data)=>{
    fetch(url)
    .then(response=>response.json())
    .then(data=>callback(data,optional_data));
}
export {api_key,fetch_data_from_server,imageBaseUrl}; 