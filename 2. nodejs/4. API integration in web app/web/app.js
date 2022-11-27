
const url = window.location.href;
let baseUrl = "";

if (url.split(":")[0] === 'http') {
    baseUrl = 'http://localhost:5001';
} else {
    baseUrl = 'https://ill-pink-gorilla-cuff.cyclic.app';
}






let getWeather = () => {

    let cityName = document.querySelector("#cityName").value

    axios.get(`${baseUrl}/weather`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data);

            document.querySelector("#result").innerHTML =
                `<h1>${response.data.city}</h1>
                 <h3> temp: ${response.data.temp_c}°C </h3>
                 <h3> Humidity: ${response.data.humidity} </h3>
                 <h3> Min/Max: ${response.data.min_temp_c}°C - ${response.data.max_temp_c}°C </h3>`

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

}