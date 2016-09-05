import $ from 'jquery'

import testCardName, {
  splitIntoNameAndStatus
} from './testCardName'

import BASIC_LANDS from '../constants/basicLands'
import {
  REQUEST_DATA_TEMPLATE, 
  DOMAIN, 
  LOAD_CARD_URL
} from '../constants/cernyRytir/config'
import CARD_TEMPLATE from '../constants/cardTemplate'

var createRequestData = function(cardName) {
   return Object.assign({}, REQUEST_DATA_TEMPLATE, { jmenokarty: cardName });
};

/*
   Loads HTML for one single card (but multiple mutations
*/
var loadCardPage = function(cardName, onSuccess, onFail) {
   $.ajax({
     type: "POST",
     url: LOAD_CARD_URL,
     data: createRequestData(cardName),
     success: function(data) {
         onSuccess(data, cardName);
     },
     dataType: 'html'
   });
};


export function parseImport (input) {
   var lines = input.split('\n');
   //console.info(lines);
   
   var cards = [];
   lines.forEach(function(line, index) {
      // split line into tokens
      var tokens = line.split(/\s/);
      
      var card = Object.assign({}, CARD_TEMPLATE);

      // comment or empty line? skip it
      if(!line.trim().length || line.trim().indexOf('//') == 0) {
         return;
      }

      // first token is SB? add the card to the sideboard
      if(tokens[0].indexOf('SB:') == 0) {
         card.sideboard = true;
         tokens = tokens.slice(1);
      }

      // next token is number? it means the count of the card
      if(/^\d+$/.test(tokens[0])) {
         card.count = parseInt(tokens[0]);
         tokens = tokens.slice(1);
      }

      card.name = tokens.join(' ').replace('Æ', 'Ae');

      var isRestricted = false;
      for(var i in BASIC_LANDS) {
        var name = BASIC_LANDS[i];
        if(card.name === name) {
          alert(card.name + " cards won't be loaded (basic lands are banned).");
          isRestricted = true;
          break;
        }
      }
      if(!isRestricted)
        cards.push(card);
   });
   console.info(cards);
   return cards;
};

var getCardInfo = function getCardInfo(html, originalCard) {
   var $html = $(html);
   var $container = $($('.kusovkytext tbody', $html)[1]);
   console.info($container);
   var children = $container.children();
   console.info('children:', children);
   var chLen = children.length;
   var card = originalCard;
   card.mutations = [];
   for(var i = 0; i < chLen; i+= 3) {
      const cardName = $('td div', children[i]).text();
      console.info('for: ', originalCard, cardName, 'split: ', splitIntoNameAndStatus(cardName))
      // check card name
      if(! 
        testCardName(
          originalCard.name, 
          splitIntoNameAndStatus(cardName).name
        )
      ) {
        continue;
      }
      var mutation = {};
      mutation.imgUrl = DOMAIN + $('a', children[i]).attr('href');
      mutation.name = $('td div', children[i]).text();
      mutation.edition = $('td:first-child', children[i+1]).text();
      mutation.rarity = $('td:nth-child(1)', children[i+2]).text();
      mutation.count = parseInt($('td:nth-child(2)', children[i+2]).text());
      mutation.price = parseInt($('td:nth-child(3)', children[i+2]).text());
      // init form
      mutation.form = {}
      var $form = $('form', children[i+2]);
      console.info($form);
      mutation.form.action = $form.attr('action');
      mutation.form.carovy_kod = $('input[name="carovy_kod"]', $form).val();
      mutation.form.databaze = $('input[name="databaze"]', $form).val();
      mutation.form.nakupzbozi = $('input[name="nakupzbozi"]', $form).val();
      mutation.form.kusu = $('input[name="kusu"]', $form).val();
      console.info('form: ', mutation.form);
      mutation.orderedCount = 0;
      mutation.id = mutation.name + i + card.name;
      card.mutations.push(mutation);
   }
   card.loaded = true;
   return card;
};

export function loadCards(cards, cb) {
  cards.forEach(function(card, index){
    console.info("Loading: ", card);
    loadCardPage(card.name, function(html) {
      var loadedCard = getCardInfo(html, card);
      cb(loadedCard);
    });
  });
};


