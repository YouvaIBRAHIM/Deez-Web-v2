import {getAlbumCover, getUrlParam} from "./utils.js";

const artistId = getUrlParam('id');
let artistInfos, artistData;

if (artistId) {
    let url_api =`https://api.deezer.com/artist/${artistId}&output=jsonp`;
    renderArtist(url_api);
}   

function renderArtist(url_api) {
    let template = document.getElementById('template-artist').innerHTML;

    fetchJsonp(url_api)
    .then(res => res.json())
    .then(data =>{
        artistData = data;
        artistInfos = {
            artistName : data.name,
            albumsNb : data.nb_album,
            fansNb : data.nb_fan,
            artistImg:data.picture_big,
            deezerLink :data.link,
        };
    })
    .then(()=>{
        getAlbumCover(artistData, template, artistInfos)
    })
    .catch(err => console.log(err))
}

