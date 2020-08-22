// delay search input
//DEBOUNCING AN INPUT : waiting for some time to pass after the last event to actually do sth
//first time timeoutId is undefined, second time is defined and stop the timer
//after set up again

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    //takes all different arguments
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args); //call the function with multiple arguments passed through
    }, delay);
  };
};

// The apply() method calls a function with a given this value, and arguments provided as an array
//only make a search when user finish typing, wait and make api call, not every time
