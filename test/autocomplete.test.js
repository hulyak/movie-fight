// mocha hooks - execute for every test
beforeEach (() => {
  document.querySelector ('#target').innerHTML = ''; //clear the autocomplete
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

it ('Dropdown starts closed', () => {
  //dropdown must be closed, remove is-active class
  const dropdown = document.querySelector ('.dropdown');
  // assert.strictEquals (dropdown.className, 'dropdown'); use chai
  expect (dropdown.className).not.to.include ('is-active');
});

it ('After searching, dropdown opens up', () => {
  const input = document.querySelector ('input');
  input.value = 'avengers';
  input.dispatchEvent (new Event ('input')); //fake event

  const dropdown = document.querySelector ('.dropdown');
  expect (dropdown.className).to.include ('is-active');
});
