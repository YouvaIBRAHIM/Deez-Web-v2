
export function addTrack(track, template, container) {
    let minutes = Math.floor(track.duration / 60);
    let seconds = track.duration - (minutes * 60);
    let duration = minutes + "m" + (seconds < 10 ? "0" + seconds :seconds);

    let trackInfos = {
        id : track.id,
        title : track.title,
        artistName : track.artist.name,
        albumTitle:track.album.title,
        cover:track.album.cover_big,
        duration :duration,
        preview :`http://127.0.0.1:8080/pages/preview.html?id=${track.id}`,
        albumLink: `http://127.0.0.1:8080/pages/album.html?id=${track.album.id}`,
        artistLink: `http://127.0.0.1:8080/pages/artist.html?id=${track.artist.id}`
    };
    let rendered = Mustache.render(template, trackInfos);
    let renderContainer = document.getElementById(container);
    renderContainer.innerHTML += rendered;

    let favButton = renderContainer.lastElementChild.querySelector("#fa-heart");

    favoriteMarkDisplay(track.id, favButton)

}

export function previewTrack(data, track_template, infos_template) {
    let minutes = Math.floor(data.duration / 60);
    let seconds = data.duration - (minutes * 60);
    let duration = minutes + "m" + (seconds < 10 ? "0" + seconds :seconds);
   
    let releaseDate = moment(data.release_date).locale("fr").format("DD MMM YYYY");

    let trackInfos = {
        id:data.id,
        title : data.title,
        artistName : data.artist.name,
        albumTitle:data.album.title,
        cover:data.album.cover_big,
        duration :duration,
        releaseDate: releaseDate,
        preview :data.preview,
        albumLink: data.link,
        artistLink: data.link
    };
    
    let infos = {
        title : data.title,
        artistName : data.artist.name,
        albumTitle:data.album.title,
        cover:data.album.cover_big,
        artistImg: data.artist.picture,
        albumLink: `http://127.0.0.1:8080/pages/album.html?id=${data.album.id}`,
        artistLink: `http://127.0.0.1:8080/pages/artist.html?id=${data.artist.id}`,
    }

    let rendered = Mustache.render(track_template, trackInfos);
    document.getElementById('track').innerHTML = rendered;

    let favButton = document.getElementById('track').querySelector("#fa-heart");
    const id = getUrlParam("id")

    favoriteMarkDisplay(id, favButton);

    rendered = Mustache.render(infos_template, infos);
    document.getElementById('infos').innerHTML = rendered;

    
}

export function onScroll(data, search_template, container, loaderContainer) {
    let positionAscenseur = Math.ceil(window.scrollY);
    let hauteurDocument = document.documentElement.scrollHeight;
    let hauteurFenetre = window.innerHeight;
    
    if (positionAscenseur >= hauteurDocument - hauteurFenetre) {
        loaderContainer.style.display = "flex";
        let nextResult = data.next;
        fetchJsonp(nextResult)
        .then(res => res.json())
        .then(data =>{
            let trackArray = data.data;
            trackArray.forEach(track => {
                addTrack(track, search_template, container);
            });
            loaderContainer.style.display = "none";
        })
        .catch(err => console.log(err))
    }
}

export function addToFavorites(favButton) {
    
    let trackId = favButton.closest('.track').dataset.trackId;
    trackId = Number(trackId);

    let favoriteTracks = JSON.parse(localStorage.getItem("favoriteTracks"));
    
    let favorite;
    if (favoriteTracks) {
        favorite = favoriteTracks.find(element => element === trackId);
    }else{
        favoriteTracks = [];
    }

    if (favorite) {
        let index = favoriteTracks.indexOf(trackId)
        favoriteTracks.splice(index, 1);
        localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));
        favButton.style.color = "white";
    }else {
        favoriteTracks.push(trackId);
        localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));
        favButton.style.color = "#d53a9d";
    }
}

export function onToggleFavoriteMark(container) {
    let containerElement = document.getElementById(container);
    containerElement.addEventListener('click', (event) => {
        
        if (event.target.id === "fa-heart") {
            let favButton = event.target;
            addToFavorites(favButton);
        }  
    }) 
}

export function getAlbumCover(data, template, artistInfos) {
    fetchJsonp(data.tracklist+"&output=jsonp")
    .then(response => response.json())
    .then(tracklistData => {
        artistInfos.ablumCover = tracklistData.data[0].album.cover_big;
        let rendered = Mustache.render(template, artistInfos);
        document.getElementById("artist").innerHTML += rendered;
    })
}

export function getArtistCover(data,template,albumInfos) {
    let artistId = data.artist.id;
    let url_api =`https://api.deezer.com/artist/${artistId}&output=jsonp`;
    fetchJsonp(url_api)
    .then(response => response.json())
    .then(artistData => {
        albumInfos.artistCover = artistData.picture_big;
        let rendered = Mustache.render(template, albumInfos);
        document.getElementById("album").innerHTML += rendered;
    })
    .catch(err => console.log(err))
}

export function favoriteMarkDisplay(trackId, favButton) {
    let favoriteTracks = JSON.parse(localStorage.getItem("favoriteTracks"));
    let favorite;

    if (favoriteTracks) {
        favorite = favoriteTracks.find(element => element === Number(trackId));
    }
    
    if (!favorite) {
        favButton.style.color = "white";
    } else {
        favButton.style.color = "#d53a9d";
    }
}

export function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}