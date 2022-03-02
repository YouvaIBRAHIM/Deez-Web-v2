import {addTrack, onToggleFavoriteMark} from "./utils.js";
function renderTracks() {
    let template = document.getElementById('template-card').innerHTML;

    fetchJsonp('https://api.deezer.com/chart&limit=20&output=jsonp')
    .then(res => res.json())
    .then(data =>{
        let trackArray = data.tracks.data;
        trackArray.forEach(track => {
            addTrack(track, template, "cards");

        });
        onToggleFavoriteMark("cards");
    })
    .catch(err => console.log(err))
    
}

renderTracks();
