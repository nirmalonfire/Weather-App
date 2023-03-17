const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorPage = document.querySelector("[data-error]");

//initially vairables need????

let oldTab = userTab;
const API_KEY = "c992faacdb9fba76745297c8fdf63cfa";
oldTab.classList.add("current-tab");
getfromSessionStorage();

// step-1
function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorPage.classList.remove("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            errorPage.classList.remove("active");

            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
        errorPage.classList.remove("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    errorPage.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorPage.classList.remove("active");

        // errorPage.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW
        // errorPage.classList.add("active");
        grantAccessContainer.classList.add("active");
        loadingScreen.classList.remove("active");
        



    }

}


// step-3
function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}


// step-4

function getLocation(){
    if(navigator.geolocation){
        //this is geo location api/syntax for finding coordinates
        navigator.geolocation.getCurrentPosition
        (showPosition);
    }else{
        alert("Your Browser does not Have geo location support");
    }
}


// function getLocation() {
    // if(navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition(showPosition, showError);
    // }
    // else if(navigator.geolocation != "Not found"){
    //     //HW - show an alert for no gelolocation support available
    //     // alert("No geolocation access")
    //     errorPage.classList.add("active");
    //     // showError();
    //     grantAccessContainer.classList.remove("active");
    // }
//     else{
//         alert("No geolocation found");
//     }
// }

function showError(){
    return errorPage.classList.add("active");
}



//finding longitude and latitude coordinates
function showPosition(position) {
//store value of coordinates in object
    const userCoordinates = {
        //syntax to find longi.. lati... on w3school
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

//grant location button on-click listner
const grantAccessButton = document.querySelector("[data-grantAccess]");

// search button all functning start from here
grantAccessButton.addEventListener("click", getLocation
// function ntFound(){
    // grantAccessContainer.classList.remove("active");
    // getLocation();
// }
);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        
        return;
    }
    else 
        fetchSearchWeatherInfo(cityName);
        
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorPage.classList.remove("active");


    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorPage.classList.remove("active");

        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
        errorPage.classList.add("active");
        alert("city api not working");
        // userInfoContainer.classList.remove("active");

    }
}

























/*
let div = document.getElementById("location");
function showError(error) {
    if (error.PERMISSION_DENIED) {
        div.innerHTML = "The User have denied the request for Geolocation.";
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        div.innerHTML = "The Browser Does not Support Geolocation";
      }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", function showPermission() {
    let x = alert("please giver your permission");
    return getLocation();
});
*/

