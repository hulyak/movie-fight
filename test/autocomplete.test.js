it ('Shows an autocomplete', () => {
  createAutoComplete ({
    root: document.querySelector ('#target'),
    fetchData () {
      //fake data
      return [
        {Title: 'Avengers'},
        {Title: 'Dark Knight'},
        {Title: 'Some other movie'},
      ];
    },
    renderOption (movie) {
      return movie.Title;
    },
  });
});
