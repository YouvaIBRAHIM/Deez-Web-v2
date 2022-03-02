import {addTrack, onScroll, onToggleFavoriteMark, getUrlParam} from "./utils.js";

const searchContent = getUrlParam('search');
const orderbyContent = getUrlParam('order');

if (searchContent) {
    document.querySelector('.searchInput').value = searchContent;

    let url_api =`https://api.deezer.com/search?q=${searchContent}&order=${orderbyContent}&output=jsonp`;

    fetchJsonp(url_api)
    .then(res => res.json())
    .then(data =>{
        let search_template = document.getElementById('template-search').innerHTML;
        let trackArray = data.data;
        trackArray.forEach(track => {
            addTrack(track, search_template, "searchs");
        });
        onToggleFavoriteMark("searchs");
        
        document.addEventListener('scroll', () =>{
            let loaderContainer = document.querySelector(".loaderContainer");
            onScroll(data, search_template, "searchs", loaderContainer);
        });
    })
    .catch(err => {
        console.log(err);
    })
}

let searchBtn = document.querySelector('.search_btn');
searchBtn.addEventListener('click', (event)=>{
    let filter = document.querySelector('.filter').value;
    let searchInput = document.querySelector('.searchInput').value.trim();
    if(searchInput !== ""){
        let search = `http://127.0.0.1:8080/pages/search.html?search=${searchInput}&order=${filter}`
        window.location.href = search;
    }
})


