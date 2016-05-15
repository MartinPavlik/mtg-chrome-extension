
'use strict';


var requestDataTemplate = {
   edice_magic: 'libovolna',
   rarita: 'A',
   foil: 'A',
   jmenokarty: 'test',
   triditpodle: 'ceny',
   submit: 'Vyhledej'
};

var BASIC_LANDS = [
  'Mountain',
  'Island',
  'Forest',
  'Plains',
  'Swamp'
];

var DOMAIN = 'http://www.cernyrytir.cz/';

var LOAD_CARD_URL = DOMAIN + 'index.php3?akce=3';

var createRequestData = function(cardName) {
   return Object.assign({}, requestDataTemplate, {jmenokarty: cardName});
};

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


var sendOrder = function(queue, onSuccess) {
  console.info("Sending order: ", queue);
  queue.forEach(function(item){
    var payload = Object.assign({}, item.form);
    payload.kusu = item.orderedCount;
    var reqUrl = DOMAIN + payload.action;
    console.info("ordering: ", reqUrl, payload);
    $.ajax({
      type: "POST",
      url: reqUrl,
      data: payload,
      success: function(data) {
        onSuccess(data, item);
      },
      dataType: 'html'
    });
  });
};

var cardTemplate = {
  id: null,
  name: '',
  count: 1,
  sideboard: false,
  loaded: false,
  mutations: null,
  expanded: false,
  orderedCount: 0
};

var parseImport = function(input) {
   var lines = input.split('\n');
   //console.info(lines);
   
   var cards = [];
   lines.forEach(function(line, index) {
      var tokens = line.split(/\s/);
      
      var card = Object.assign({}, cardTemplate);

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
          alert(card.name + " won't be loaded (basic lands are banned).");
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
      var mutation = {};
      mutation.imgUrl = $('a', children[i]).attr('href');
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

var loadCards = function loadCards(cards, cb) {
  cards.forEach(function(card, index){
    console.info("Loading: ", card);
    loadCardPage(card.name, function(html) {
      var loadedCard = getCardInfo(html, card);
      cb(loadedCard);
    });
  });
};

var bs = window.ReactBootstrap;

console.info("bootstrap: ", bs);

var MutationList = React.createClass({
  displayName: 'MutationList',

  getBsStyle: function getBsStyle(name) {
    if(name.indexOf('foil') != -1)
      return 'success';
    if(name.indexOf('lightly played') != -1 || name.indexOf('moderately played') != -1)
      return 'warning';
    if(name.indexOf('heavily played') != -1)
      return 'danger'; 
    return 'default;'
  },

  render: function render() {
    var that = this;
    var createMutation = function createMutation(item) {
      return React.createElement(
        'tr',
        { className: 'mutation', key: item.id },
        React.createElement(
          'td',
          null,
          React.createElement(
            bs.OverlayTrigger, 
            {
              trigger: 'hover', 
              placement: 'right',
              container: this,
              overlay: React.createElement(bs.Popover, null,
                React.createElement('img', {src: 'http://www.cernyrytir.cz/' + item.imgUrl, width: 300}),
                (item.orderedCount >= item.count && React.createElement('p', {className: 'alert alert-danger'}, 
                  'No more cards available')
                )
              )
            },
            React.createElement(
              bs.Button,
              {
                bsStyle: that.getBsStyle(item.name),
                onClick: function(e) {
                  e.preventDefault();
                  that.props.handleAddToCart(item, that.props.card);
                }
              },
              item.name
            )
          ),
          (item.orderedCount >= item.count && React.createElement('span', {className: 'alert alert-danger'}, 'No more cards available'))
        ),
        React.createElement('td', null,
          (item.orderedCount != 0 &&
            React.createElement(
              'span', null,
              React.createElement('span',
                {className: 'alert alert-warning'},
                item.orderedCount + ' x  ' + item.price + '=' + (item.orderedCount*item.price) + ',-'
              ),
              React.createElement(bs.Button,
                {
                  bsStyle: 'danger',
                  bsSize: 'sm',
                  onClick: function(e) {
                    e.preventDefault()
                    that.props.handleRemoveFromCart(item, that.props.card);
                  }
                },
                '-1'
              )
            )
          )
        ),
        React.createElement('td',null,
          item.edition
        ),
        React.createElement('td', null,
          item.rarity
        ),
        React.createElement('td', null,
          item.count  + 'x'
        ),
        React.createElement('td', null,
          item.price  + ',-'
        )
      );
    };
    return React.createElement(
      'table',
      { className: 'mutations' },
      React.createElement(
        'tbody',
        null,
        this.props.items.map(createMutation)
      )
    );
   }
});


var LOCAL_STORAGE_KEY = 'magic-states';

var CardList = React.createClass({
  displayName: 'CardList',

  handleToggleExpand: function handleToggleExpand(e, item) {
    e.preventDefault();
    console.info("expand: ", e, item, this.props);
    this.props.handleExpandCard(item);
  },

  render: function render() {
    var that = this;

    console.info(that, that.handleToggleExpand);
    var createCard = function createCard(item) {
      return React.createElement(
        'div',
        {
          key: item.id,
          className: 'card',
        },
        React.createElement(
          'div',
          {
            className: item.orderedCount >= item.count ? 'card-head finished' : 'card-head',
            onClick: function onClick(e) {
              that.handleToggleExpand(e, item);
            }
          },
          item.name,
          React.createElement('span', {className: 'pull-right'}, item.orderedCount + ' / ' + item.count)
        ),
        React.createElement(
          'div',
          {className: 'card-mutations'},
          (item.expanded && React.createElement(
              MutationList,
              { 
                items: item.mutations, 
                handleAddToCart: that.props.handleAddToCart,
                handleRemoveFromCart: that.props.handleRemoveFromCart,
                card: item
              }
            )
          )
        )
      );
    };
    return React.createElement(
      'div',
      {className: 'card-list'},
      this.props.items.map(createCard)
    );
  }
});

var getPrevStates = function() {
  return JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY)
  ) || [];
};

var saveState = function(state) {
  var prevStates = getPrevStates();

  var tmp = {
    snapshot: state,
    id: new Date()
  }

  prevStates = prevStates.concat([tmp]);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prevStates));

  return getPrevStates();
};

var StateList = React.createClass({
  displayName: 'CardList',

  render: function render() {
    var that = this;

    var createState = function createState(state) {
      return React.createElement(bs.Button, { 
        key: state.id, 
        bsStyle: 'warning', 
        bsSize: 'sm',
        onClick: function(e) {
          e.preventDefault();
          that.props.handleLoadState(state);
        }
      }, state.id);
    };
    return (
      React.createElement('div', {className: 'state-list'}, 
        this.props.states.map(createState),
        React.createElement(bs.Button, {bsStyle: 'success', onClick: this.props.handleSaveState}, 'Save work')
      )
    )
  }

});

var LOADING_STATUS = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2
};

var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return { 
      items: [],
      text: '',
      totalPrice: 0,
      loadingStatus: LOADING_STATUS.NOT_LOADED,
      toBeLoaded: 0,
      loaded: 0
    };
  },
  onChange: function onChange(e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var that = this;
    var queue = parseImport(this.state.text);
    var addItem = function addItem(card) {
      console.info(card);
      var newItem = Object.assign({}, card, { id: Date.now() });
      var nextItems = that.state.items.concat([newItem]);

      that.setState( Object.assign({}, that.state, { items: nextItems, loaded: that.state.loaded+1 }));

      if(that.state.loaded == that.state.toBeLoaded) {
        that.setState( Object.assign({}, that.state, {loadingStatus: LOADING_STATUS.LOADED}))
      }
    };

    this.setState(Object.assign({}, this.state, { text: '', loadingStatus: LOADING_STATUS.LOADING, toBeLoaded: queue.length, loaded: 0}));
    loadCards(queue, addItem);
  },
  handleOrder: function handleOrder(e) {
    e.preventDefault();
    var queue = [];
    this.state.items.forEach(function(card){
      if(card.orderedCount) {
        card.mutations.forEach(function(mutation){
          if(mutation.orderedCount) {
            queue.push(mutation);
          }
        })
      }
    });

    var onSuccess = function onSuccess(data) {

    };
    sendOrder(queue, onSuccess);
  },
  handleExpandCard: function handleExpandCard(item) {
    console.info(item);

    var nextItems = this.state.items.map(function(adept) {
      if(item.id == adept.id) {
        adept.expanded = ! adept.expanded;
      }
      return adept;
    });
    this.setState(Object.assign({}, this.state, {items: nextItems}));
  },


  handleUseCheapest: function handleUseCheapest(e) {
    e.preventDefault();

    var cardLen = this.state.items.length;

    for(var i = 0; i < cardLen; i++) {
      var mutLen = this.state.items[i].mutations.length;
      console.info('card', i, this.state.items[i], mutLen);
      var count = this.state.items[i].count;
      for(var j = mutLen - 1; j >= 0 && this.state.items[i].orderedCount < count; j--) {
        console.log("\tmutation: ", j, this.state.items[i].mutations[j]);
        for(var k = 0; k < this.state.items[i].mutations[j].count && this.state.items[i].orderedCount < count; k++) {
          console.log("\t\tordering: ");
          this.handleAddToCart(this.state.items[i].mutations[j], this.state.items[i]);
        }
      }
    }
  },

  handleAddToCart: function handleAddToCart(item, card) {
    if(item.orderedCount == item.count)
      return
    console.info(item);
    item.orderedCount++;
    card.orderedCount++;
    this.state.totalPrice += item.price;
    this.setState(this.state);
  },

  handleSaveState: function handleSaveState(e) {
    e.preventDefault();
    saveState(this.state);
    //this.setState(Object.assign({}, this.state));
  },

  handleLoadState: function handleLoadState(state) {
    console.info("loading state...", state);
    this.setState(Object.assign({}, state.snapshot));
  },

  handleRemoveFromCart: function handleRemoveFromCart(item, card) {
    item.orderedCount--;
    card.orderedCount--;
    this.state.totalPrice -= item.price;
    this.setState(this.state);
  },

  getHeaderText: function getHeaderText() {
    if(this.state.loadingStatus == LOADING_STATUS.NOT_LOADED)
      return 'Import cards';
    if(this.state.loadingStatus == LOADING_STATUS.LOADING)
      return 'Loading cards, please wait...';
    return 'Cards overview';
  },

  render: function render() {
    var that = this;
    return React.createElement(
      'div',
      null,
      React.createElement('div', {className: 'row'},
        React.createElement('div', {className: 'col-lg-12'}, 
          React.createElement(StateList, {states: getPrevStates(), handleSaveState: this.handleSaveState, handleLoadState: this.handleLoadState}, null)
        )
      ),
      React.createElement(
        'h1',
        {className: 'page-header'},
        this.getHeaderText()
      ),
      (this.state.loadingStatus == LOADING_STATUS.LOADING && React.createElement('div', null,
          React.createElement(bs.ProgressBar, 
            {
              stripped: true, 
              bsStyle: 'success',
              label: this.state.loaded + ' / ' + this.state.toBeLoaded,
              now: (this.state.loaded/this.state.toBeLoaded)*100
            }
          )
        )
      ),
      (this.state.loadingStatus == LOADING_STATUS.LOADED && 
        React.createElement('div', {className: 'row'},
          React.createElement('div', {className: 'col-lg-12 extra-margin'},  
            React.createElement(bs.Button, {bsStyle: 'default', onClick: this.handleUseCheapest},
              'Use the cheapest set of cards'
            )
          )
        )
      ),
      React.createElement(
        CardList, 
        { 
          items: this.state.items, 
          handleExpandCard: that.handleExpandCard, 
          handleAddToCart: that.handleAddToCart,
          handleRemoveFromCart: that.handleRemoveFromCart
        }
      ),
      (this.state.loadingStatus == LOADING_STATUS.NOT_LOADED && React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement('textarea', { onChange: this.onChange, value: this.state.text }),
          React.createElement(bs.Button, {bsStyle: 'primary', bsSize: 'lg', type: 'submit'}, 'Do the magic!')
        )
      ),
      (this.state.loadingStatus == LOADING_STATUS.LOADED && React.createElement('div', null,
          React.createElement(bs.Button, {bsStyle: 'primary', bsSize: 'lg', onClick: this.handleOrder}, 
            'Confirm & order these cards, total: ' + this.state.totalPrice + ',-'
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));