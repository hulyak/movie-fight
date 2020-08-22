const waitFor = selector => {
  return new Promise ((resolve, reject) => {
    const interval = setInterval (() => {
      if (document.querySelector (selector)) {
        clearInterval (interval);
        clearTimeout (timeout);
        resolve ();
      }
    }, 30);

    const timeout = setTimeout (() => {
      clearInterval (interval);
      reject ();
    }, 2000);
  });
};

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

it ('After searching, dropdown opens up', async () => {
  const input = document.querySelector ('input');
  input.value = 'avengers';
  input.dispatchEvent (new Event ('input')); //fake event

  //delay this event, wait for dropdown-item to appear
  await waitFor ('.dropdown-item');

  const dropdown = document.querySelector ('.dropdown');
  expect (dropdown.className).to.include ('is-active');
});

it ('After searching, displays some results', async () => {
  const input = document.querySelector ('input');
  input.value = 'avengers';
  input.dispatchEvent (new Event ('input')); //fake event

  await waitFor ('.dropdown-item');
  const items = document.querySelectorAll ('.dropdown-item');
  expect (items.length).to.equal (3);
});
