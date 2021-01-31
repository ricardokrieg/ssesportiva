function clear() {
  localStorage.clear();
}

function getBetValue() {
  return localStorage.getItem('betValue');
}

function setBetValue(value) {
  return localStorage.setItem('betValue', value);
}

function getBetValueInCents() {
  return getBetValue() * 100;
}

// TODO this should be the sum of all quotes
function getCurrentQuote() {
  let currentQuote = 0.0;

  for (let option of getOptions()) {
    currentQuote += option['quote'];
  }

  return currentQuote;
}

function getExpectedReturnInCents() {
  const betValue = getBetValueInCents();
  const currentQuote = getCurrentQuote();

  if (betValue === null || currentQuote == null) {
    return 0;
  }

  return betValue * currentQuote;
}

function updateOptions() {
  // TODO for each option in the LocalStorage, mark the appropriate button as selected/clicked
}

function updateBetValue() {
  const betValue = getBetValue();

  if (betValue === null) return;

  $('#bet-value').val(betValue);
}

function updateExpectedReturn() {
  const expectedReturn = getExpectedReturnInCents();

  $('#expected-return').val(format(expectedReturn));
}

function format(value) {
  let cents = String(value % 100);
  if (cents.length === 1) cents = cents + '0';

  return 'R$ ' + Math.floor(value / 100) + ',' + cents;
}

function getOptions() {
  const options = localStorage.getItem('options');

  if (options === null) return [];

  return JSON.parse(options);
}

function setOptions(options) {
  localStorage.setItem('options', JSON.stringify(options));
}

function addOption(option) {
  if (!option['id'] || !option['quote'] || !option['gameId']) {
    return;
  }

  let options = getOptions();

  for (let existingOption of options) {
    if (existingOption['gameId'] === option['gameId']) {
      return;
    }
  }

  options.push(option);

  setOptions(options);
}
