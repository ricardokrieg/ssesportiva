const rp = require('request-promise');
const $ = require('cheerio');
const Promise = require('bluebird');
const moment = require('moment');
require('moment-timezone');
const debug = require('debug')('betting-system');
const util = require('util');
const _ = require('lodash');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB8bSuyR3pdsPQexctwidYetQyGwsMGu0U",
//   authDomain: "betting-system-2021.firebaseapp.com",
//   databaseURL: "https://betting-system-2021-default-rtdb.firebaseio.com",
//   projectId: "betting-system-2021",
//   storageBucket: "betting-system-2021.appspot.com",
//   messagingSenderId: "366249710853",
//   appId: "1:366249710853:web:b583249338f05f201cd36c",
//   measurementId: "G-CBE2E23M3J"
// };

// Firebase - BEGIN
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// const database = admin.database();
const firestore = admin.firestore();

const menuCol = firestore.collection('menu');
const championshipsCol = firestore.collection('championships');
const gamesCol = firestore.collection('games');
const betsCol = firestore.collection('bets');
const membersCol = firestore.collection('members');

const runtimeOpts = {
  timeoutSeconds: 300
}
// Firebase - END

const baseUrl = `https://thebets.bet/simulador`;

const MIN_BET_VALUE = 200; // R$2,00
const MAX_BET_VALUE = 100000; // R$1.000,00
const MIN_QUOTE_VALUE = 2;

function isValidString(value) {
  return value && value.length > 0 && (typeof value === 'string');
}

function isValidBetOption(option) {
  const {
    group,
    championship,
    championshipId,
    game,
    gameId,
    gameDate,
    quoteType,
    quote,
    title,
    id
  } = option;

  if (!isValidString(group)) return false;
  if (!isValidString(championship)) return false;
  if (!isValidString(championshipId)) return false;
  if (!isValidString(game)) return false;
  if (!isValidString(gameId)) return false;
  if (!isValidString(gameDate) || moment.tz(gameDate, 'DD/MM/YYYY hh:mm', 'America/Sao_Paulo').isBefore(moment().tz('America/Sao_Paulo'))) return false;
  if (!isValidString(quoteType)) return false;
  if (!quote || isNaN(quote) || quote <= 0) return false;
  if (!isValidString(title)) return false;
  if (!isValidString(id)) return false;

  return true;
}

function isValidBet(bet) {
  const {
    expectedReturn,
    value,
    confirmedAt,
    code,
    options,
  } = bet;

  if (!expectedReturn || isNaN(expectedReturn) || expectedReturn <= 0) return false;
  if (!value || isNaN(value) || value < MIN_BET_VALUE || value > MAX_BET_VALUE) return false;
  if (confirmedAt && confirmedAt > new Date()) return false; // TODO validate date (this is a Firestore datetime)
  if (!isValidString(code) || code.length !== 6) return false;
  if (!options || options.length < 1) return false;
  if (!_.every(options, isValidBetOption)) return false;
  // const totalQuote = _.reduce(options, 'quote'); // TODO sum all quotes
  // for (let option of options) { if (!isValidBetOption(option)) return false; }

  return true;
}

function isValidQuoteOption(option) {
  const {
    id,
    quote,
    title,
  } = option;

  if (!isValidString(id)) {
    console.error(new Error(`invalid quote.option.id: ${id}`));
    return false;
  }
  if (!quote || isNaN(quote) || quote <= 0) {
    console.error(new Error(`invalid quote.option.quote: ${quote}`));
    return false;
  }
  if (!isValidString(title)) {
    console.error(new Error(`invalid quote.option.title: ${title}`));
    return false;
  }

  return true;
}

function isValidGameQuote(quote) {
  const {
    type,
    options,
  } = quote;

  if (!isValidString(type)) {
    console.error(new Error(`invalid game.quote.type: ${type}`));
    return false;
  }
  if (!options || options.length < 1) {
    console.error(new Error(`invalid game.quote.options: ${options}`));
    return false;
  }
  // TODO use a filter/select to keep only valid options
  if (!_.every(options, isValidQuoteOption)) {
    console.error(new Error(`invalid game.quote.options: _every_`));
    return false;
  }
  // for (let option of options) { if (!isValidQuoteOption(option)) return false; }

  return true;
}

function isValidGame(game) {
  const {
    group,
    championshipTitle,
    championshipId,
    date,
    id,
    title,
    quotes,
  } = game;

  if (!isValidString(group)) {
    console.error(new Error(`invalid game.group: ${group}`));
    return false;
  }
  if (!isValidString(championshipTitle)) {
    console.error(new Error(`invalid game.championshipTitle: ${championshipTitle}`));
    return false;
  }
  if (!isValidString(championshipId)) {
    console.error(new Error(`invalid game.championshipId: ${championshipId}`));
    return false;
  }
  if (!isValidString(date) || moment.tz(date, 'DD/MM/YYYY hh:mm', 'America/Sao_Paulo').isBefore(moment().tz('America/Sao_Paulo'))) {
    console.error(new Error(`invalid game.date: ${date}`));
    console.error(new Error(`Game Date: ${moment.tz(date, 'DD/MM/YYYY hh:mm', 'America/Sao_Paulo')}`));
    console.error(new Error(`Current Date: ${moment().tz('America/Sao_Paulo')}`));
    return false;
  }
  if (!isValidString(id)) {
    console.error(new Error(`invalid game.id: ${id}`));
    return false;
  }
  if (!isValidString(title)) {
    console.error(new Error(`invalid game.title: ${title}`));
    return false;
  }
  if (!quotes || quotes.length < 1) {
    console.error(new Error(`invalid game.quotes: ${quotes}`));
    return false;
  }
  // TODO use a filter/select to keep only valid quotes
  if (!_.every(quotes, isValidGameQuote)) {
    console.error(new Error(`invalid game.quotes: _every_`));
    return false;
  }
  // for (let quote of quotes) { if (!isValidGameQuote(quote)) return false; }

  return true;
}

function isValidChampionshipGame(game) {
  const {
    date,
    title,
    quote,
  } = game;

  if (!isValidString(date) || moment.tz(date, 'DD/MM/YYYY hh:mm', 'America/Sao_Paulo').isBefore(moment().tz('America/Sao_Paulo'))) {
    console.error(new Error(`invalid championship.game.date: ${date}`));
    return false;
  }
  if (!isValidString(title)) {
    console.error(new Error(`invalid championship.game.title: ${title}`));
    return false;
  }
  if (!quote || !isValidGameQuote(quote) || quote['type'] !== 'Vencedor do Encontro') {
    console.error(new Error(`invalid championship.game.quote: ${quote}`));
    return false;
  }

  return true;
}

function isValidChampionship(championship) {
  const {
    group,
    id,
    title,
    games,
  } = championship;

  if (!isValidString(group)) {
    console.error(new Error(`invalid championship.group: ${group}`));
    return false;
  }
  if (!isValidString(id)) {
    console.error(new Error(`invalid championship.id: ${id}`));
    return false;
  }
  if (!isValidString(title)) {
    console.error(new Error(`invalid championship.title: ${title}`));
    return false;
  }
  if (!games || games.length < 1) {
    console.error(new Error(`invalid championship.games: ${games}`));
    return false;
  }
  // TODO use a filter/select to keep only valid games
  if (!_.every(games, isValidChampionshipGame)) {
    console.error(new Error(`invalid championship.games: _every_`));
    return false;
  }
  // for (let game of games) { if (!isValidChampionshipGame(game)) return false; }

  return true;
}

function isValidMenu(menu) {
  if (typeof menu !== 'object') {
    console.error(new Error(`invalid menu: ${menu}`));
    return false;
  }
  if (menu.length < 1) {
    console.error(new Error(`invalid menu.length: ${menu.length}`));
    return false;
  }

  // TODO use a filter/select to keep only valid groups
  for (let group of menu) {
    const {
      name,
      championships,
    } = group;

    if (!isValidString(name)) {
      console.error(new Error(`invalid menu.group.name: ${name}`));
      return false;
    }
    if (!championships || championships.length < 1) {
      console.error(new Error(`invalid menu.group.championships: ${championships}`));
      return false;
    }

    // TODO use a filter/select to keep only valid championships
    for (let championship of championships) {
      const {
        id,
        title,
      } = championship;

      if (!isValidString(id)) {
        console.error(new Error(`invalid menu.group.championship.id: ${id}`));
        return false;
      }
      if (!isValidString(title)) {
        console.error(new Error(`invalid menu.group.championship.title: ${title}`));
        return false;
      }
    }
  }

  return true;
}

async function getMember(context) {
  const user = context.auth;

  if (!user) {
    return null;
  }

  const userEmail = user.token ? user.token.email : null;

  if (!userEmail) {
    return null;
  }

  const docRef = membersCol.doc(userEmail);
  const docSnapshot = await docRef.get();

  return docSnapshot.data();
}

function randomCode() {
  let code = _.sample('123456789');
  while (code.length < 6) {
    code += _.sample('0123456789');
  }

  return code;
}

async function generateBetCode() {
  let code;

  do {
    code = randomCode();
  } while ((await betsCol.doc(String(code)).get()).exists)

  return code;
}

async function scrapeGame(title, date, url) {
  debug(`Scraping ${title} ${date} (${url})`);

  try {
    const id = url.match(/.*?idpartida=(?<id>\d+)/).groups['id']

    const html = await rp(url);

    const trs = $('table#conteudo_TableJogos tr', html);
    const quotes = [];
    let index = -1;

    for (let tr of trs) {
      if ($('th', tr).length) continue;

      if ($('td.th_2', tr).length === 0) {
        quotes.push({ type: $('td', tr).text(), options: [] });
        index++;
      } else {
        const id = $('td.th_2 a', tr)[0].attribs.id;

        const option = {
          title: $('td.th_1', tr).text(),
          quote: parseFloat($('td.th_2', tr).text().replace(',', '.')),
          id: id.match(/conteudo_opc(\d+)/)[1],
        };
        quotes[index]['options'].push(option);
      }
    }

    return {
      id,
      title,
      date,
      quotes,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function scrapeChampionship(category, title, url) {
  try {
    const id = url.match(/.*?idcampeonato=(?<id>\d+)/).groups['id']

    const html = await rp(url);
    const games = [];

    const trs = $('table#conteudo_TableJogos tr', html);
    for (let tr of trs) {
      if ($('td.th_1', tr).length) {
        const title = $('td.th_1 b', tr).text();
        const date = $('td.th_1 p', tr).text();
        const link = $('td.th_5 a', tr)[0];

        if (link) {
          const gameUrl = link.attribs.href.replace('./', baseUrl + '/');
          games.push(scrapeGame(title, date, gameUrl));
        } else {
          const options = [
            {
              title: 'Casa',
              quote: parseFloat($('td.th_2', tr).text().replace(',', '.')),
              id: $('td.th_2 a', tr)[0].attribs.id.match(/conteudo_opc(\d+)/)[1],
            },
            {
              title: 'Empate',
              quote: parseFloat($('td.th_3', tr).text().replace(',', '.')),
              id: $('td.th_3 a', tr)[0].attribs.id.match(/conteudo_opc(\d+)/)[1],
            },
            {
              title: 'Fora',
              quote: parseFloat($('td.th_4', tr).text().replace(',', '.')),
              id: $('td.th_4 a', tr)[0].attribs.id.match(/conteudo_opc(\d+)/)[1],
            },
          ];

          const quotes = [{ type: 'Vencedor do Encontro', options }];
          games.push({ title, date, quotes });
        }
      }
    }

    return {
      id,
      category,
      title,
      games: await Promise.all(games),
    }
  } catch (err) {
    console.error(err);
    console.log(url);
    return null;
  }
}

async function scrapeCategory() {

}

async function scrape() {
  const url = `${baseUrl}/campeonatos.aspx`;
  const html = await rp(url);

  const categories = [];

  const countries = $('#drop2 #AccordionPaises .accordionHeader', html);
  for (let country of countries) {
    if (country.attribs.id === `0_header`) continue;

    const category = _.trim($(country).text());
    const championships = [];

    const championshipsNode = $('a', country.next);
    for (let championshipNode of championshipsNode) {
      const title = $(championshipNode).text();
      const url = championshipNode.attribs.href.replace('./', baseUrl + '/');

      championships.push(scrapeChampionship(category, title, url));
    }

    categories.push({
      name: category,
      championships: await Promise.all(championships),
    });
  }

  debug(util.inspect(categories, false, null, true));
  return categories;
}

exports.scrape = functions
  .runWith(runtimeOpts)
  .pubsub
  .schedule('every 2 minutes')
  .onRun(async (context) => {
    console.log('Starting the scraper...');
    console.log(`Time now: ${moment().tz('America/Sao_Paulo')}`);

    const groups = await scrape();

    // mark each championship to be removed
    let querySnapshot = await championshipsCol.get();
    for (let docSnapshot of querySnapshot.docs) {
      await docSnapshot.ref.update({ keep: false });
    }

    // mark each game to be removed
    querySnapshot = await gamesCol.get();
    for (let docSnapshot of querySnapshot.docs) {
      await docSnapshot.ref.update({ keep: false });
    }

    const menu = [];

    for (let group of groups) {
      console.log(`Adding group "${group['name']}"`);

      const groupData = { name: group['name'], championships: [] };

      for (let championship of group['championships']) {
        console.log(`Adding championship "${championship['title']}"`);

        const championshipData = { title: championship['title'], id: championship['id'] };
        groupData['championships'].push({ ...championshipData });

        championshipData['group'] = group['name'];
        championshipData['games'] = [];
        for (let game of championship['games']) {
          const gameData = { title: game['title'], date: game['date'] };
          const quoteData = game['quotes'][0];

          if (game['id'] && quoteData) {
            gameData['id'] = game['id'];
            gameData['quote'] = quoteData;

            game['group'] = championshipData['group'];
            game['championshipTitle'] = championshipData['title'];
            game['championshipId'] = championshipData['id'];
            if (isValidGame(game)) {
              await gamesCol.doc(game['id']).set({ ...game, keep: true });
            } else {
              console.error(new Error(`invalid game ${game['id']}: ${JSON.stringify(game)}`));
            }
          }

          championshipData['games'].push(gameData);
        }

        if (isValidChampionship(championshipData)) {
          await championshipsCol.doc(championship['id']).set({ ...championshipData, keep: true });
        } else {
          console.error(new Error(`invalid championship ${championship['id']}: ${JSON.stringify(championshipData)}`));
        }
      }

      menu.push(groupData);
    }

    if (isValidMenu(menu)) {
      await menuCol.doc('snapshot').set({ data: menu });
    } else {
      console.error(new Error(`invalid menu: ${JSON.stringify(menu)}`));
    }

    querySnapshot = await championshipsCol.where('keep', '==', false).get();
    for (let docSnapshot of querySnapshot.docs) {
      console.log(`Deleting championship "${docSnapshot.id}"`);
      await docSnapshot.ref.delete();
    }

    querySnapshot = await gamesCol.where('keep', '==', false).get();
    for (let docSnapshot of querySnapshot.docs) {
      console.log(`Deleting championship "${docSnapshot.id}"`);
      await docSnapshot.ref.delete();
    }

    console.log('Done');
    return null;
});

exports.getMenu = functions
  .https
  .onCall(async (_data, _context) => {
    try {
      const docRef = menuCol.doc('snapshot');
      const docSnapshot = await docRef.get();

      return docSnapshot.data();
    } catch (e) {
      console.error(e);
      return { error: "Ocorreu um erro!" };
    }
});

exports.getChampionship = functions
  .https
  .onCall(async (data, _context) => {
    try {
      const id = data['id'];

      const docRef = championshipsCol.doc(id);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return { error: "Campeonato não encontrado" };
      }

      return docSnapshot.data();
    } catch (e) {
      console.error(e);
      return { error: "Ocorreu um erro!" };
    }
  });

exports.getGame = functions
  .https
  .onCall(async (data, _context) => {
    try {
      const id = data['id'];

      const docRef = gamesCol.doc(id);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return { error: "Partida não encontrada" };
      }

      return docSnapshot.data();
    } catch (e) {
      console.error(e);
      return { error: "Ocorreu um erro!" };
    }
  });

exports.placeBet = functions
  .https
  .onCall(async (data, _context) => {
    try {
      const betValue = data['betValue'];
      const options = data['options'];

      if (!betValue || isNaN(betValue) || betValue < MIN_BET_VALUE || betValue > MAX_BET_VALUE) {
        return { error: "Valor da aposta inválido" };
      }

      if (!options || options.length < 1) {
        return { error: "Aposta inválida" };
      }

      let gameIds = [];
      for (let option of options) {
        if (!option['id'] || !option['gameId']) {
          return { error: "Aposta inválida" };
        }

        if (gameIds.includes(option['gameId'])) {
          return { error: "Aposta inválida: Múltiplas apostas na mesma partida" };
        }

        gameIds.push(option['gameId']);
      }

      const betData = {
        value: betValue,
        options: [],
      };

      for (let option of options) {
        console.log(option);

        const id = option['id'];
        const gameId = option['gameId'];
        const optionData = { id, gameId };

        const gameRef = gamesCol.doc(gameId);
        const gameSnapshot = await gameRef.get();

        if (!gameSnapshot.exists) {
          return { error: "Partida não encontrada" };
        }

        const gameData = gameSnapshot.data();
        const gameTitle = gameData['title'];
        const gameDate = gameData['date'];

        const championshipRef = championshipsCol.doc(gameData['championshipId']);
        const championshipSnapshot = await championshipRef.get();

        if (!championshipSnapshot.exists) {
          return { error: "Campeonato não encontrado" };
        }

        const championshipData = championshipSnapshot.data();
        const championshipId = championshipData['id'];
        const championshipTitle = championshipData['title'];
        const groupName = championshipData['group'];

        let found = false;
        for (let quote of gameData['quotes']) {
          for (let storedOption of quote['options']) {
            if (storedOption['id'] === id) {
              found = true;

              optionData['group'] = groupName;
              optionData['championshipId'] = championshipId;
              optionData['championship'] = championshipTitle;
              optionData['game'] = gameTitle;
              optionData['gameDate'] = gameDate;
              optionData['quoteType'] = quote['type'];
              optionData['title'] = storedOption['title'];
              optionData['quote'] = storedOption['quote'];

              betData['options'].push(optionData);

              break;
            }
          }

          if (found) {
            break;
          }
        }

        if (!found) {
          return { error: 'Cotação não encontrada' };
        }
      }

      let totalQuote = 0.0;
      for (let option of betData['options']) {
        totalQuote += option['quote'];
      }

      if (totalQuote < MIN_QUOTE_VALUE) {
        return { error: "Aposta inválida: Cotação abaixo do mínimo" };
      }

      betData['expectedReturn'] = totalQuote * betValue;

      const code = String(await generateBetCode());
      betData['code'] = code;
      if (isValidBet(betData)) {
        await betsCol.doc(code).set(betData);

        return betData;
      } else {
        console.error(new Error(`invalid bet: ${JSON.stringify(betData)}`));
        return { error: "Ocorreu um erro!" };
      }
    } catch (e) {
      console.error(e);
      return { error: "Ocorreu um erro!" };
    }
  });

exports.searchBet = functions
  .https
  .onCall(async (data, context) => {
    try {
      const code = data['code'];

      if (!code || code.length === 0) {
        return { error: "Por favor insira o código do bilhete" };
      }

      const docRef = betsCol.doc(code);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return { error: "Bilhete não encontrado" };
      }

      const betData = docSnapshot.data();
      const member = await getMember(context);

      if (!member && !betData['confirmedAt']) {
        return { error: "Bilhete não encontrado" };
      }

      return betData;
    } catch (e) {
      console.error(e);
      return { error: "Ocorreu um erro!" };
    }
  });

exports.reportError = functions
  .https
  .onCall(async (data, context) => {
    try {
      console.error(new Error(`Error Reported: ${JSON.stringify(data)}`));
    } catch (e) {
      console.error(e);
    }
  });
