import {addTrack, onToggleFavoriteMark} from "./utils.js";
function renderFavoriteTracks() {
    let template = document.getElementById('template-card').innerHTML;
    let favoriteTracks = JSON.parse(localStorage.getItem("favoriteTracks"));

    if (favoriteTracks) {
        favoriteTracks.reverse().map(trackId => {
            fetchJsonp(`https://api.deezer.com/track/${trackId}&output=jsonp`)
            .then(res => res.json())
            .then(data =>{
                addTrack(data, template, "cards");
            })
            .catch(err => console.log(err))
        })
        onToggleFavoriteMark("cards");
    }
    
}

renderFavoriteTracks();