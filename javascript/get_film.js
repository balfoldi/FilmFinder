const API = "5cf72b5a"
const holder = document.getElementById("holder")
const searchBtn = document.getElementById("search")
const searchBar = document.querySelector("input")
var fetchCount = 0
const displayIndex = (response) => {
  console.log("Response Search is ...")
  console.log(response)
  console.log("Numbers of matching films : " + response.totalResults)
  console.log("Numbers of films in index: " + response.Search.length + " <===============================")
  writeIndexHTML(response)
  console.log("... Response procesing done")
}

const writeIndexHTML = (response) => {
  var options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }
  var response = response
  console.log("writing HTML ...")
  response.Search.forEach ((film) => {
    holder.insertAdjacentHTML("beforeend",`
    <div class=' d-flex w-100 justify-content-center' id='${film.imdbID}'>
      <img class='hide align-self-center' height='300px' src='images/gogetter.png' alt='go getter'>
      <div class='hide card mb-5' style="width: 300px;">
        <div class='card-header text-center'>
          <h4>${film.Title.slice(0, film.Title.indexOf(':'))}</h4>
          <p class='mb-0 text-secondary'>${film.Year}</p>
        </div>
        <img src='${film.Poster}' alt='film poster of ${film.Title}'>
        <div class='card-footer mt-auto d-flex justify-content-center'>
          <div class='btn btn-info mr-2'> Go Get more</div>
        </div>
      </div>
    </div>
    `)
    var cardHolder = document.getElementById(film.imdbID)
    var btn = cardHolder.querySelector(".btn")
    btn.addEventListener("click", () => {
      console.log("...processing show")
      let process = buildGetResponse(`i=${film.imdbID}`, displayShow)
      process()
    })
    console.log(cardHolder)
    var callback = function(entries, observer) { 
      entries.forEach(entry => {
        if (entry.isIntersecting){
          console.log("Animating..." + entry.target.id)
          entry.target.children[0].classList.remove("hide")
          entry.target.children[0].classList.add("slide-come-leave")
          entry.target.children[1].classList.remove("hide")
          entry.target.children[1].classList.add("slide-come")
        }
      });
    };
    var observer = new IntersectionObserver(callback, options)
    const observe = () => {
      observer.observe(cardHolder)
    }
    setTimeout(observe,1000)
  });
  lastCardHolder = document.getElementById(response.Search[9].imdbID)
  var callback = function(entries, observer) { 
    entries.forEach(entry => {
      var trigered = false
      if (entry.isIntersecting && !trigered){
        trigered = true
        fetchCount ++
        let process = buildGetResponse(`s=${searchBar.value.replace(" ", "_")}&page=${fetchCount}`, displayIndex)
        process()
      }
    });
  };
  var observer = new IntersectionObserver(callback, options)
  const observe = () => {
    observer.observe(lastCardHolder)
  }
  setTimeout(observe,1000)
};

const displayShow = (response) => {
  console.log("Response is ...")
  console.log(response)
  console.log("Title of showing film : " + response.Title)
  writeShowHTML(response)
  console.log("... Response procesing done")
  document.getElementById('close-popup').addEventListener("click", () => {
    console.log("removing...")
    document.getElementsByClassName("popup")[0].remove()
  })
}

const writeShowHTML = (response) => {
  document.body.insertAdjacentHTML("beforeend",(`
  <div class='popup d-flex justify-content-center'>
    <div class='card card-popup align-self-center mb-3'>
      <div class='card-header text-center'>
        <h4>${response.Title}</h4>
        <p class='mb-0 text-secondary'>Release date : ${response.Released}</p>
      </div>
      <div class='card-body d-flex'>
        <img class='mr-3 border rounded' src='${response.Poster}' alt='film poster of ${response.Title}'>
        <p class='align-self-center'>${response.Plot}</p>
      </div>
      <div class='card-footer d-flex justify-content-center'>
        <div class='btn btn-secondary mr-2' id='close-popup'">Close</div>
      </div>
    </div>
  </div>
  `))
}


const buildGetResponse = (urlFragment, method) => {
  const urlblock = urlFragment
  const process = method
  let getResponse = () => {
    let process = method
    let url = `https://www.omdbapi.com/?${urlblock}&apikey=${API}`
    console.log("target URL is " + url.replace(API, "********"))
    fetch(url, {
      method: "GET",
    })
    .then((response) => response.json())
    .then((response) => {process(response)})
    .catch((error) => console.error(error));
  }
  return getResponse
}

searchBtn.addEventListener("click", () => {
  console.log('click')
  holder.innerHTML = "";
  fetchCount = 2;
  let process = buildGetResponse(`s=${searchBar.value.replace(" ", "_")}&page=1`, displayIndex)
  process()
})
