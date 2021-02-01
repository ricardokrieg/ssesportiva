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
  const options = getOptions();

  $('[data-option-id]').removeAttr('data-option-selected');

  for (let option of options) {
    $('[data-option-id=' + option['id'] + ']').attr('data-option-selected', true);
  }
}

function updateBetValue() {
  const betValue = getBetValue();

  if (betValue === null) return;

  $('.bet-value').val(betValue);
}

function updateExpectedReturn() {
  const expectedReturn = getExpectedReturnInCents();

  $('.expected-return').val(format(expectedReturn));
  $('.expected-return-text').text(format(expectedReturn));
}

function updateCurrentQuote() {
  $('.current-quote-text').text(getCurrentQuote());
}

function format(valueInCents) {
  let cents = (valueInCents % 100).toFixed(0);
  if (cents.length === 1) cents = cents + '0';

  return 'R$ ' + Math.floor(valueInCents / 100) + ',' + cents;
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

function removeOption(id) {
  let options = getOptions();

  let i = 0;
  for (let existingOption of options) {
    if (existingOption['id'] === id) {
      options.splice(i, 1);
      break;
    }
    i++;
  }

  setOptions(options);
}

function placeBet() {
  const params = {
    betValue: getBetValueInCents(),
    options: getOptions(),
  };

  startSpinner();

  firebase.functions().httpsCallable('placeBet')(params)
    .then(function (result) {
      stopSpinner();

      // TODO show success alert

      console.log('PLACE BET RESULT');
      console.log(result);
    })
    .catch(function(error) {
      stopSpinner();
      showDefaultError(error);
    });
}

function searchBet(code) {
  // TODO start only a local spinner
  startSpinner();

  firebase.functions().httpsCallable('searchBet')({ code })
    .then(function (result) {
      stopSpinner();

      // TODO show Bet modal

      console.log('SEARCH BET RESULT');
      console.log(result);
    })
    .catch(function(error) {
      stopSpinner();
      showDefaultError(error);
    });
}

function login(email, password) {
  // TODO start local spinner

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
    })
    .catch(function (error) {
      showError(error, "Erro", "Email ou Senha incorreto");
    });
}

function logout() {
  // TODO start local spinner

  firebase.auth().signOut()
    .then(function () {
    })
    .catch(function (error) {
      showDefaultError(error);
    });
}

function startSpinner() {
  $('#spinner').show();
  $('#main').hide();
}

function stopSpinner() {
  $('#spinner').hide();
  $('#main').show();
}

function showError(error, title, message) {
  // TODO notify error

  const id = 'alert-modal';
  const el = $('#' + id);

  $(el).find('.modal-title').text(title);
  $(el).find('.modal-body').text(message);

  const modal = new bootstrap.Modal(document.getElementById(id), {});
  modal.show();
}

function showDefaultError(error) {
  showError(error, "Erro", "Aconteceu um erro");
}
