const fetchData = async (searchTerm) => {
  //pass parameter for input value
  const response = await axios.get('http://www.omdbapi.com/', {
    // string parameters here, this will append after the url in axios
    //http://www.omdbapi.com/?apikey=24be0e45&s=avengers
    params: {
      apikey: '24be0e45',
      s: searchTerm, // movie title search  - input term
      // i: 'tt0848228', //individual movie id
    },
  });

  //handle errors
  if (response.data.Error) {
    return []; //nothing
  }
  // console.log(response.data); //actual info from api
  return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search for a movie</b></label>
  <input class="input" />
   <div class="dropdown">
    <div class="dropdown-menu">
     <div class="dropdown-content results">
     </div>
  </div>
 </div>
`;
// <a href="#" class="dropdown-item"> between results

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);

  // close the menu, if nothing is searched
  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = ''; //empty search after one search

  dropdown.classList.add('is-active'); //open up the menu
  // render movies
  for (let movie of movies) {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    option.classList.add('dropdown-item');
    // multi line ``
    option.innerHTML = `
       <img src="${imgSrc}"/>
       ${movie.Title}
    `;
    option.addEventListener('click', () => {
      //close the dropdown
      dropdown.classList.remove('is-active');
      // update the value of the input
      input.value = movie.Title;
    });
    resultsWrapper.appendChild(option);
    //helper function for second api
    onMovieSelect(movie);
  }
};

input.addEventListener('input', debounce(onInput, 500));
//input event triggers for onChange

//close the menu when they click away from dropdown
//global event listener
document.addEventListener('click', (event) => {
  //events bubble up to document
  // console.log(event.target);
  if (!root.contains(event.target)) {
    //outside of root
    dropdown.classList.remove('is-active');
  }
});

const onMovieSelect = async (movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '24be0e45',
      i: movie.imdbID, //individual movie id
    },
  });
  // console.log(response.data);
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

//helper function
const movieTemplate = (movieDetail) => {
  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
      </div>
    </div>  
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>

   <article class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
