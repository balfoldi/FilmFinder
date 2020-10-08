const URL = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=10&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes";
const selector = document.getElementById("holder")

const show = (response) => {
  console.log("writing response")
  console.log(response)
  console.log(response.records)
  showVelibStations(response)
  setInterval(function(){showVelibStations(response)},60*1000)
}

const showVelibStations = (response) => {
  console.log("processing request")
  selector.innerHTML = "";
  response.records.forEach ((station) => {
    selector.innerHTML += `
      <div class='card mb-3'>
        <div class='card-header'>
          <h2>Station : ${station.fields.name}</h2>
        </div>
        <div class='card-body'>
          <p>${station.fields.mechanical} classical Velibs</p>
          <p>${station.fields.ebike} electric Velibs</p>
        </div>
      </div>
    `
  });
};

fetch(URL, {
  method: "GET",
})
.then((response) => response.json())
.then((response) => {show(response)})
.catch((error) => console.error(error));
