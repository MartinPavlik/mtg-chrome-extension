import $ from 'jquery'
import BASIC_LANDS from '../constants/basicLands'
import {
  getUrl, 
  DOMAIN
} from '../constants/rishada/config'
import CARD_TEMPLATE from '../constants/cardTemplate'

/*
   Loads HTML for one single card (but multiple mutations
*/
var loadCardPage = function(cardName, onSuccess, onFail) {
   $.ajax({
     type: "GET",
     url: getUrl(cardName),
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
   console.info("PARSED IMPORT:\n" + cards);
   return cards;
};

var getCardInfo = function getCardInfo(html, originalCard) {
   var $html = $(html);
   var $container = $($('.buytable tbody', $html)[0]);
   console.info('container', $container)
   var children = $container.children();
   console.info('children:', children);
   var chLen = children.length;
   var card = originalCard;
   card.mutations = [];
   for(var i = 1; i < chLen; i+= 3) {
      var mutation = {};
      mutation.imgUrl = DOMAIN + $('a.cardover', children[i]).attr('href');
      mutation.name = $('a.cardover', children[i]).text();
      mutation.edition = $('td:nth-child(2)', children[i]).text();
      mutation.rarity = $('td:nth-child(5)', children[i]).text();
      mutation.count = parseInt($('td:nth-child(6)', children[i]).text());
      mutation.price = parseInt($('td:nth-child(7)', children[i]).text());
      // init form
      mutation.form = {}
      var $form = $('form', children[i+2]);
      console.info($form);
      mutation.form.action = $form.attr('action');
      mutation.form.sell = $('input[name="sell"]', $form).val();
      mutation.form.cardid = $('input[name="cardid"]', $form).val();
      mutation.form.act = $('input[name="act"]', $form).val();
      mutation.form.max = $('input[name="max"]', $form).val();
      console.info('form: ', mutation.form);
      mutation.orderedCount = 0;
      mutation.id = mutation.name + i + card.name;
      card.mutations.push(mutation);
      console.info("mutation: ", mutation)
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


