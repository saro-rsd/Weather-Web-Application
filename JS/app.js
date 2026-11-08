const video = document.getElementById(`bg-video`);
video.playbackRate = 0.60;

const cityInput = document.getElementById(`city`);
const suggestions = document.getElementById(`suggestions`);

window.onload = () => getWeather(`Colombo`);

document.querySelector(".searchIcon").onclick = () => {
    getWeather();
    suggestions.innerHTML = "";
};

cityInput.addEventListener("keypress    ", e => {
    if (e.key === "enter") {
        getWeather();
        suggestions.innerHTML = "";
    }
});

async function getWeather(defaultCity = "Colombo") {
    const city = cityInput.value.trim() || defaultCity;

    try {
        const api = await fetch(`https://api.weatherapi.com/v1/current.json?key=106d4b8e65fb49fabf9110519261210&q=${city}`)
            .then(r => r.json())
            .then(data => {
                console.log(data);
                if(data.error){
                    if(data.error.code === 1006){
                        cityInput.value = "";
                        return alert("City Not Found...");
                    }else{
                        return alert(data.error.message);
                    }
                    return;
                }
                document.getElementById(`town`).innerHTML = data.location.name + `, `;
                document.getElementById(`country`).innerHTML = data.location.country;
                document.getElementById(`temp`).innerHTML = data.current.temp_c + `°C`;
                document.getElementById(`condition`).innerHTML = data.current.condition.text;
                document.getElementById(`feelsLike`).innerHTML = data.current.feelslike_c + `°C`;
                document.getElementById(`humidity`).innerHTML = data.current.humidity + `%`;
                document.getElementById(`wind`).innerHTML = data.current.wind_kph + ` km/h`;
                document.getElementById(`pressure`).innerHTML = data.current.pressure_in + ` hpa`;
                document.getElementById(`lastUpdate`).innerHTML = data.location.localtime;
                const icon = document.getElementById(`icon`);
                icon.src = data.current.condition.icon;
            });

    } catch(error){
        alert("Something went wrong. Check your internet connection.");
        console.error(error);
    }
}