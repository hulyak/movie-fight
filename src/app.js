const autoCompleteConfig = {
  renderOption (movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
       <img src="${imgSrc}"/>
       ${movie.Title}(${movie.Year})
    `;
  },

  inputValue (movie) {
    return movie.Title;
  },

  async fetchData (searchTerm) {
    //pass parameter for input value
    const response = await axios.get ('http://www.omdbapi.com/', {
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
  },
};

// left autocomplete
createAutoComplete ({
  ...autoCompleteConfig,
  root: document.querySelector ('#left-autocomplete'),
  onOptionSelect (movie) {
    document.querySelector ('.tutorial').classList.add ('is-hidden');
    onMovieSelect (movie, document.querySelector ('#left-summary'), 'left');
  },
});

// right autocomplete
createAutoComplete ({
  ...autoCompleteConfig,
  root: document.querySelector ('#right-autocomplete'),
  onOptionSelect (movie) {
    document.querySelector ('.tutorial').classList.add ('is-hidden');
    onMovieSelect (movie, document.querySelector ('#right-summary'), 'right');
  },
});

// references for comparison
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get ('http://www.omdbapi.com/', {
    params: {
      apikey: '24be0e45',
      i: movie.imdbID, //individual movie id
    },
  });
  // console.log(response.data);
  summaryElement.innerHTML = movieTemplate (response.data);
  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison ();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll (
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll (
    '#right-summary .notification'
  );

  leftSideStats.forEach ((leftStat, index) => {
    const rightStat = rightSideStats[index];

    console.log (leftStat, rightStat);
    // in the DOM, all dataset values are stored as strings
    const leftSideValue = parseInt (leftStat.dataset.value);
    const rightSideValue = parseInt (rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove ('is-primary');
      leftStat.classList.add ('is-warning');
    } else {
      rightStat.classList.remove ('is-primary');
      rightStat.classList.add ('is-warning');
    }
  });
};

//helper function
const movieTemplate = movieDetail => {
  //turn into number values, replace commas and $ sign
  const dollars = parseInt (
    movieDetail.BoxOffice.replace (/\$/g, '').replace (/,/g, '')
  );
  const metascore = parseInt (movieDetail.Metascore);
  const imdbRating = parseFloat (movieDetail.imdbRating);
  const imdbVotes = parseInt (movieDetail.imdbVotes.replace (/,/g, ''));

  // let count = 0; //split turns into an array
  // const awards = movieDetail.Awards.split(' ').forEach((word) => {
  //   const value = parseInt(word);
  //   if (isNaN(value)) {  //if it is string returns NaN
  //     return;
  //   } else {
  //     count = count + value;
  //   }
  // });

  const awards = movieDetail.Awards.split (' ').reduce ((prev, word) => {
    const value = parseInt (word);
    if (isNaN (value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0); //start counting from 0

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

  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>

  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>

  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>

  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>

   <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
