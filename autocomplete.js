const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //config object
  // const root = document.querySelector('.autocomplete');
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
   <div class="dropdown">
    <div class="dropdown-menu">
     <div class="dropdown-content results">
     </div>
  </div>
 </div>
`;
  // <a href="#" class="dropdown-item"> between results

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);

    // close the menu, if nothing is searched
    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = ''; //empty search after one search

    dropdown.classList.add('is-active'); //open up the menu
    // render movies
    for (let item of items) {
      const option = document.createElement('a');

      option.classList.add('dropdown-item');
      // multi line ``;
      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        //close the dropdown
        dropdown.classList.remove('is-active');
        // update the value of the input
        input.value = inputValue(item);
        //helper function for second api
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(option);
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
};
