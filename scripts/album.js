
import {getArtistCover, getUrlParam} from "./utils.js";


const albumId = getUrlParam("id")
let albumInfos, artistData;

if (albumId) {
    let url_api =`https://api.deezer.com/album/${albumId}&output=jsonp`;
    renderArtist(url_api);
}   

function renderArtist(url_api) {
    let template = document.getElementById('template-album').innerHTML;

    fetchJsonp(url_api)
    .then(res => res.json())
    .then(data =>{
        albumInfos = {
            artistName : data.artist.name,
            albumsName : data.title,
            fansNb : data.nb_fan,
            albumImg:data.cover_big,
            deezerLink :data.link,
        };

        getArtistCover(data, template, albumInfos)
        
    })
    .catch(err => console.log(err))
}