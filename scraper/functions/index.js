const rp = require('request-promise');
const $ = require('cheerio');
const Promise = require('bluebird');
const moment = require('moment');
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

const runtimeOpts = {
  timeoutSeconds: 300
}
// Firebase - END

const baseUrl = `https://thebets.bet/simulador`;

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

    const groups = await scrape();
    // await database.ref('snapshot').set(groups);

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

        championshipData['games'] = [];
        // for (let game of championship['games']) {
        //   const gameData = { title: game['title'], date: game['date'] };
        //   if (game['id']) {
        //     gameData['id'] = game['id'];
        //
        //     await gamesCol.doc(game['id']).set(game);
        //   }
        //
        //   championshipData['games'].push(gameData);
        // }
        //
        // await championshipsCol.doc(championship['id']).set(championshipData);
      }

      menu.push(groupData);
    }

    await menuCol.doc('snapshot').set({ data: menu });

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

exports.getCurrentSnapshot = functions
  .https
  // .onCall(async (data, context) => {
  .onRequest(async (req, res) => {
    console.log('here 1');
    const ref = database.ref('snapshot');
    console.log('here 2');
    const snapshot = await ref.once('value');
    console.log('here 3');

    // return JSON.parse(snapshot.val());

    res.status(200).send(JSON.parse(snapshot.val()));
});
