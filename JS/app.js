const video = document.getElementById(`bg-video`);
video.playbackRate = 0.60;

const cityInput = document.getElementById(`city`);
const suggestions = document.getElementById(`suggestions`);

window.onload = () => getWeather(`Colombo`);

document.querySelector(".searchIcon").onclick = () => {
    getWeather();
    suggestions.innerHTML = "";
};

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        getWeather();
        suggestions.innerHTML = "";
    }
});

async function getWeather(defaultCity = "Colombo") {
    const city = cityInput.value.trim() || defaultCity;

    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=106d4b8e65fb49fabf9110519261210&q=${encodeURIComponent(city)}&days=3`);

        const data = await res.json(); 
           
                console.log(data);
                if (data.error) {
                    if (data.error.code === 1006) {
                        cityInput.value = "";
                        return alert("City Not Found...");
                    } else {
                        cityInput.value = "";
                        return alert(data.error.message);
                    }
                }
                
                document.getElementById(`town`).innerHTML = data.location.name + `, `;
                document.getElementById(`country`).innerHTML = data.location.country;
                document.getElementById(`temp`).innerHTML = data.current.temp_c + `°C`;
                document.getElementById(`condition`).innerHTML = data.current.condition.text;
                document.getElementById(`feelsLike`).innerHTML = data.current.feelslike_c + `°C`;
                document.getElementById(`humidity`).innerHTML = data.current.humidity + `%`;
                document.getElementById(`wind`).innerHTML = data.current.wind_kph + ` km/h`;
                document.getElementById(`pressure`).innerHTML = data.current.pressure_mb + ` hpa`;
                document.getElementById(`lastUpdate`).innerHTML = data.location.localtime;
                const icon = document.getElementById(`icon`);
                icon.src = data.current.condition.icon;
                loadForcast(data);

    } catch (error) {
        alert("Something went wrong. Check your internet connection.");
        console.error(error);
    }
}

const forecast = document.getElementById(`forecast`);

function loadForcast(data) {
    forecast.innerHTML = "";
    const hours = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour
    ];

    const currentTime = parseInt(data.location.localtime.split(" ")[1]);

    for (let i = 1; i <= 5; i++) {
        const h = hours[currentTime + i];
        const time = h.time.split(" ")[1];

        forecast.innerHTML += `
            <div class="forcast-card">
                <p>${time}</p>
                <img src = "https:${h.condition.icon}" alt="${h.condition.text}">
                <p>${Math.round(h.temp_c)}°C </p>
                <p>${h.chance_of_rain} % <br> rain</p>
            </div>
        `;
    }
}

let debounceTimer;

cityInput.addEventListener("input",() =>{
    clearTimeout(debounceTimer);

    const city = cityInput.value.trim() ;
    if(city.length<2){
        suggestions.innerHTML = "";
        return; 
    }

    debounceTimer = setTimeout(() => loadSuggessions(city) , 400);
});

async function loadSuggessions(city){
    try{
        const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=106d4b8e65fb49fabf9110519261210&q=${encodeURIComponent(city)}`);

        const places = await res.json();
        suggestions.innerHTML = "";

        places.slice(0,5).forEach( place => { 
            const li = document.createElement("li");
            li.textContent = `${place.name}, ${place.country}`;

            li.onclick = ()=>{
                cityInput.value = place.name;
                suggestions.innerHTML = "";
                getWeather();
            };
            suggestions.appendChild(li);
        });

    } catch (error) {
        console.error(error);
    }
}