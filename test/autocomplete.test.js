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

  //dropdown must be closed, remove is-active class
  const dropdown = document.querySelector ('.dropdown');
  // assert.strictEquals (dropdown.className, 'dropdown'); use chai
  expect (dropdown.className).not.to.include ('is-active');
});
