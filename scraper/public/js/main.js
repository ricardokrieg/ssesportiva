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
  return 1.56;
}

function getExpectedReturnInCents() {
  const betValue = getBetValueInCents();
  const currentQuote = getCurrentQuote();

  if (betValue === null || currentQuote === null) {
    return 0;
  }

  return betValue * currentQuote;
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

function getQuotes() {
  const quotes = localStorage.getItem('quotes');

  if (quotes === null) return [];

  return quotes;
}

function setQuotes(quotes) {
  localStorage.setItem('quotes', quotes);
}

function addQuote(quote) {
  let quotes = getQuotes();
  quotes.push(quote);

  setQuotes(quotes);
}
