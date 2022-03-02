import {previewTrack, onToggleFavoriteMark, getUrlParam} from "./utils.js";

let isPlaying = false;

const id = getUrlParam('id');

function renderTracks() {
    let track_template = document.getElementById('template-track').innerHTML;
    let infos_template = document.getElementById('template-infos').innerHTML;


    let url_api =`https://api.deezer.com/track/${id}&output=jsonp`;

    fetchJsonp(url_api)
    .then(res => res.json())
    .then(data =>{
        previewTrack(data, track_template, infos_template);
        onToggleFavoriteMark("track");
    })
    .then(()=>{
        let music = document.querySelector('.music');
        let playBtn = document.querySelector('.play_btn');

        let timeline = document.querySelector(".slider");
        let playhead = document.querySelector(".progress");
        let timer = document.querySelector(".timer");
        let previewDuration = document.querySelector(".duration");
        let timerPreview;
        
        let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

        music.addEventListener("canplaythrough", function () {
            timerPreview = music.duration;
            let minutes = Math.floor(timerPreview / 60);
            let seconds = Math.floor(timerPreview - (minutes * 60));
            let duration = minutes + "m" + (seconds < 10 ? "0" + seconds :seconds);
            previewDuration.innerHTML = duration;
        }, false);

        playBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            if (!isPlaying) {
                playMusic(playBtn, music);
                isPlaying = true;
            }else{
                pauseMusic(playBtn, music)
                isPlaying = false;
            }
        })

        music.addEventListener("timeupdate", ()=>{

            let playPercent = timelineWidth * (music.currentTime / timerPreview);
            playhead.style.width = playPercent + "px";


            let secondsIn = Math.floor(((music.currentTime / timerPreview) / 3.5) * 100);
            if (secondsIn < 10) {
                timer.innerHTML = "0:0" + secondsIn;
            } else {
                timer.innerHTML = "0:" + secondsIn;
            }
        }, false);
    })
    .catch(err => console.log(err))
    
}

renderTracks();

function playMusic(playBtn, music) {
    
    music.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
}
function pauseMusic(playBtn, music) {
    music.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
}
