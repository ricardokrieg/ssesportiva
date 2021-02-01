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
  $('.current-quote-text').text(getCurrentQuote().toFixed(2));
}

function format(valueInCents) {
  return 'R$ ' + (valueInCents / 100).toFixed(2).replace('.', ',');
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
  startSpinner();

  firebase.functions().httpsCallable('searchBet')({ code })
    .then(function (result) {
      stopSpinner();

      const data = result['data'];

      if (data['error']) {
        showError(data['error'], "Erro", data['error']);
      }

      showTicket(data);
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

function showTicket(data) {
  const value = data['value'];
  const expectedReturn = data['expectedReturn'];
  const options = data['options'];

  if (!value || !expectedReturn || !options || options.length < 1) {
    return;
  }

  let content = '';

  for (let option of options) {
    const group = option['group'];
    const championship = option['championship'];
    const game = option['game'];
    const quoteType = option['quoteType'];
    const quote = option['quote'];
    const title = option['title'];

    if (!group || !championship || !game || !quoteType || !quote || !title) {
      continue;
    }

    content += '<div class="card">' +
      '<div class="card-header">' + title + '</div>' +
      '<div class="card-body">' +
      group + ' - ' + championship + '<br>' +
      game + '<br>' +
      quoteType + '<br>' +
      'Cotação: ' + quote +
      '</div>' +
      '</div>';
  }

  $('#ticket-modal .modal-body').html(content);
  const modal = new bootstrap.Modal(document.getElementById('ticket-modal'), {});
  modal.show();
}
