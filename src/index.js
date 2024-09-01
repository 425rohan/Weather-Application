let inputCity = document.querySelector('#city');
let btnCity = document.querySelector('#userCityButton')
let locBtn = document.querySelector('#userLocBtn');
let dropdownElem = document.querySelector('.dropdown');
let inputArea = document.querySelector('.input-text');
let message = document.querySelectorAll('.message')[0];
let dropdownItems = localStorage.getItem('dropdownItems')? JSON.parse(localStorage.getItem('dropdownItems')) : [];


// Below Operations are when we submit city/place name

btnCity.addEventListener('click',handleCitySubmit);

// on loading window for user, i want to display a sample city data for user, so below code
window.onload =function(){
   
    onRefresh();
}
function onRefresh(){    
    updateDropdown();
    
}

// convert city name to latitide and longitude using a geolocation api and then call weatherData function
async function cityNameConvert(cityName){
    try{
        let latiLongi = [];
        let result = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}}&limit=5&appid=7dc2efeab9c5c6be0855cfad7d780aea`);
        let resultJson = await result.json();
        latiLongi.push(resultJson[0]['lat']);
        latiLongi.push(resultJson[0]['lon']);
        weatherData(latiLongi,cityName);
        setTimeout(()=>{
            // alert('Data Loaded Successfully');
            message.innerText = 'New Data Fetched';
            message.classList.add('message-visible');
            setTimeout(()=>{
                message.classList.remove('message-visible');
            },2000)

        },1000)
        // return latiLongi;
        
        
    }
    catch(err){
        alert('Please check city name again.  ' + err);
    }
    
}

// to obtain weatherdata using an api, below function. after obtaining weather data calling displayWeatherData function to display data on our webpage
async function weatherData(data,cityName){
    try{
        let weatherInfo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data[0]}&longitude=${data[1]}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,wind_speed_10m_max&timezone=Asia%2FBangkok`)
        let resJson = await weatherInfo.json();
        let weatherDataArr = [];
        let currTime = (resJson.current.time.slice(0,10));
        let currHumi = resJson.current.relative_humidity_2m;
        let currTemp = resJson.current.temperature_2m;
        let currWind = resJson.current.wind_speed_10m;
        let currWCode = resJson.current.weather_code;
        let foreDate = (resJson.daily.time.slice(0,6));
        let foreTemp = (resJson.daily.temperature_2m_max.slice(0,6));
        let foreUv = (resJson.daily.uv_index_max.slice(0,6));
        let foreWind = (resJson.daily.wind_speed_10m_max.slice(0,6));
        let foreWcode = (resJson.daily.weather_code.slice(0,6));
    
        weatherDataArr.push(currTime,currHumi,currTemp,currWind,foreDate,foreTemp,foreUv,foreWind,currWCode,foreWcode);
        // console.log(weatherDataArr);
        displayWeatherData(cityName,weatherDataArr);
        
        // return weatherDataArr;
    }
    catch(err){
         alert(err);
    }
    
}
// below function to dispplay obtained weather data on our webpage
function displayWeatherData(city,wArr){
    let bannerName = document.querySelector('.banner-name');
    let bannerTemp = document.querySelector('.banner-temp');
    let bannerHumi = document.querySelector('.banner-humi');
    let bannerWind = document.querySelector('.banner-wind');
    let bannerImg =document.querySelector('.banner-img img');
    let bannerDesc = document.querySelector('.banner-desc');

    bannerName.innerText = city[0].toUpperCase() + (city.slice(1)).toLowerCase() + ' ('+wArr[0]+')';
    bannerTemp.innerText = 'Temperature (2m): ' + wArr[2];
    bannerHumi.innerText = 'Humidity: ' + wArr[1];
    bannerWind.innerText = 'Wind Speed (10m): ' +wArr[3];
    if(wArr[9][0] === 1){
       bannerImg.src = './src/images/sunny.png';
       bannerDesc.innerText = 'Sunny';
    }
    else if(wArr[9][0] === 2 || wArr[9][0] === 3){
        bannerImg.src = './src/images/cloudy.png';
        bannerDesc.innerText = 'Cloudy/Partly Cloudy';
    }
    else if(wArr[9][0] === 80 || wArr[9][0] === 95){
        bannerImg.src = './src/images/rainy.png';
        bannerDesc.innerText = 'Rainy';
    }
    else{
        bannerImg.src = './src/images/sunny.png';
        bannerDesc.innerText = 'Sunny';
    }


    for(let i=1; i<6; i++){
       let fDate = document.querySelector(`.f-item${i} .f-date`);
       let fTemp = document.querySelector(`.f-item${i} .f-temp`);
       let fUv = document.querySelector(`.f-item${i} .f-uv`);
       let fWind = document.querySelector(`.f-item${i} .f-wi`);
       let fImg = document.querySelector(`.f-item${i} img`);

       fDate.innerText = wArr[4][i];
       fTemp.innerText ='Temp: ' +  wArr[5][i];
       fUv.innerText ='UV Index: '+ wArr[6][i];
       fWind.innerText ='Wind(10m): '+ wArr[7][i];
       
    if(wArr[9][i] === 1){
        fImg.src = './src/images/sunny.png';
     }
     else if(wArr[9][i] === 2 || wArr[9][i] === 3){
         fImg.src = './src/images/cloudy.png';
     }
     else if(wArr[9][i] === 80 || wArr[9][i] === 95){
         fImg.src = './src/images/rainy.png';
     }
     else{
         fImg.src = './src/images/sunny.png';
     }

    }

}
// defined dropdown operation in below function
function dropDown(currItem,dropdownItems){
       
    if(dropdownItems.length < 5){
        dropdownItems.push(currItem);
        
    }
    else{
        dropdownItems.shift();
        dropdownItems.push(currItem);
    }
    localStorage.setItem('dropdownItems', JSON.stringify(dropdownItems))
    
    dropdownElem.innerText = '';
    for(let i = 0; i<dropdownItems.length; i++){
        
        let para = document.createElement('p');
        para.innerText = dropdownItems[i];
        para.classList.add('drop-item','bg-white','border-2','border-grey','p-1');
        dropdownElem.appendChild(para);
        
    }
    
}
// In below function, want to populate dropdown field when page is refreshed and we want to see dropdown when input field is clicked for first time after refresh

function updateDropdown(){

    let storedItems = localStorage.getItem('dropdownItems');
    console.log('stored items are '+storedItems);
    if (storedItems) {
        dropdownItems = JSON.parse(storedItems);
        cityNameConvert(dropdownItems[dropdownItems.length-1]);
    } else {
        dropdownItems = [];
        cityNameConvert('New York');
    }
    

    for (let i = 0; i < dropdownItems.length; i++) {
        let para = document.createElement('p');
        para.innerText = dropdownItems[i];
        para.classList.add('drop-item', 'bg-white', 'border-2', 'border-grey', 'p-1');
        dropdownElem.appendChild(para);
    }

}





// adding appropriate event listeners
inputCity.addEventListener('click',function(){
    dropdownElem.classList.add('dropdown-visible');
    setTimeout(()=>{dropdownElem.classList.remove('dropdown-visible');},2000)
})

inputArea.addEventListener('click',function(e){
    if(e.target.classList[0] === 'drop-item'){
        let data = e.target.innerText;
        
        cityNameConvert(data);
        inputCity.value = data;
        if(dropdownItems.length < 5){
            dropdownItems.push(data);
        }
        else{
            dropdownItems.shift();
            dropdownItems.push(data);
        }
        
        localStorage.setItem('dropdownItems', JSON.stringify(dropdownItems));
    }
})

//defining when city submit is clicked
function handleCitySubmit(){
    let data = inputCity.value;
    
    
    if(data === ''){
        alert('Please dont leave city field empty')
    }
    else{
        dropDown(data,dropdownItems);
        cityNameConvert(data);
        inputCity.value = ''
    }   
}

//**************************************************************
// Below operations when 'use current location' button is clicked
//**************************************************************


locBtn.addEventListener('click',handleLocBtn)

// defining what to do when location button is clicked
async function handleLocBtn(){
    let userDecision = confirm('Are you sure you want to share your location? ')
    console.log(userDecision);
    if(userDecision){
        try{
            let coord = await getLatiLongi();
            console.log(coord);
            let placeData = await showCity(coord);
            let city = placeData.address.city;
            
            //callling weather data after gettin coordinates and city value
            weatherData(coord,city);
            setTimeout(()=>{
                // alert('Data Loaded Successfully');
                message.innerText = 'Current Location Fetched';
                message.classList.add('message-visible');
                setTimeout(()=>{
                    message.classList.remove('message-visible');
                },2000)
    
            },1000)
        }
        catch(err){
           console.log(err)
        }    
    }
}

//below, we are getting user's coordinates
async function getLatiLongi(){
    
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve([latitude, longitude]);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    else {
        throw new Error('Geolocation is not supported by this browser')
      }
}

// getting city name from coordinates
async function showCity(coord){
      let result = await fetch(`https://geocode.maps.co/reverse?lat=${coord[0]}&lon=${coord[1]}&api_key=66d1dd48853b5405679276dlz6e6cb4`);
      let resultJson = await result.json();
      
      return resultJson;
}

// let a = showCity([18.625,74]);
// console.log(a);