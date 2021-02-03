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
  const id = option['id'];
  const group = option['group'];
  const championship = option['championship'];
  const game = option['game'];
  const gameId = option['gameId'];
  const quoteType = option['quoteType'];
  const quote = option['quote'];
  const title = option['title'];

  if (!id || !group || !championship || !game || !gameId || !quoteType || !quote || !title) {
    showError("Invalid option: " + JSON.stringify(option), 'Erro', 'Ocorreu um erro');
    return;
  }

  let options = getOptions();

  for (let existingOption of options) {
    if (existingOption['gameId'] === option['gameId']) {
      showError("Invalid option (duplicated game): " + JSON.stringify(option), 'Erro', 'Você não pode fazer mais de uma aposta no mesmo jogo nesse cupom!');
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
  const betValue = getBetValueInCents();
  const options = getOptions();

  const params = {
    betValue,
    options,
  };

  if (!betValue || isNaN(betValue) || betValue < 200 || betValue > 100000) {
    showError(null, 'Erro', 'Valor da aposta inválido');
    return;
  }

  if (!options || options.length < 1) {
    showError(null, 'Erro', 'O cupom está vazio');
    return;
  }

  let gameIds = [];
  let totalQuote = 0.0;
  for (let option of options) {
    if (!option['id'] || !option['gameId'] || !option['quote']) {
      showError(null, 'Erro', 'Aposta inválida');
      return;
    }

    if (gameIds.includes(option['gameId'])) {
      showError(null, 'Erro', 'Você não pode fazer mais de uma aposta no mesmo jogo nesse cupom!');
      return;
    }

    gameIds.push(option['gameId']);
    totalQuote += option['quote'];
  }

  if (totalQuote < 2.0) {
    showError(null, 'Erro', 'São aceitas somente apostas com cotação maior que 2,00.');
    return;
  }

  startSpinner();

  firebase.functions().httpsCallable('placeBet')(params)
    .then(function (result) {
      stopSpinner();

      // TODO show success alert
      // TODO remove logs
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
  firebase.functions().httpsCallable('reportError')({ error, title, message });

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

function prepareBetModal() {
  const options = getOptions();
  let content = '';

  for (let option of options) {
    const id = option['id'];
    const group = option['group'];
    const championship = option['championship'];
    const game = option['game'];
    const quoteType = option['quoteType'];
    const quote = option['quote'];
    const title = option['title'];

    if (!id || !group || !championship || !game || !quoteType || !quote || !title) {
      continue;
    }

    content += '<div class="card">' +
      '<div class="card-header d-flex justify-content-between">' +
      '<div>' + title + '</div>' +
      '<a href="javascript:void(0);" onclick="onRemoveOption(this, \'' + id + '\')">X Excluir</a>' +
      '</div>' +
      '<div class="card-body">' +
      group + ' - ' + championship + '<br>' +
      game + '<br>' +
      quoteType + '<br>' +
      'Cotação: ' + quote +
      '</div>' +
      '</div>';
  }

  $('#bet-modal .modal-body').html(content);
  return true;
}

function onRemoveOption(element, id) {
  $(element).closest('.card').remove();
  removeOption(id);

  updateOptions();
  updateExpectedReturn();
  updateCurrentQuote();
}
