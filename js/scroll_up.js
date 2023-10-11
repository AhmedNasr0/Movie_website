
// scroll up function
export function scroll_Up(){
    const scroll_up=document.getElementById('scroll-up');
window.addEventListener('scroll',()=>{
  if(window.scrollY>400){
    scroll_up.classList.remove('hidden');
  }else{
    scroll_up.classList.add('hidden');
  }
})
scroll_up.addEventListener('click',()=>{
  window.scrollTo(0,0);
})
}