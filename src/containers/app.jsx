import React, { Component, PropTypes } from 'react'
import {Button, ProgressBar} from 'react-bootstrap'
import { connect } from 'react-redux'

import {loadCards as loadCardsRishada, parseImport as parseImportRishada} from '../utils/scraper.rishada'
import {sendOrder as sendOrderRishada} from '../utils/api.rishada'

import {loadCards as loadCardsCR, parseImport as parseImportCR} from '../utils/scraper.cernyRytir'
import {sendOrder as sendOrderCR} from '../utils/api.cernyRytir'

import {loadStates, saveState} from '../utils/api.saveState'

import * as CardActions from '../actions/CardActions'

import CardList from '../components/cardList'

import StateList from '../components/stateList'

import * as LOADING_STATUS from '../constants/LoadingStatus'
import * as ORDERING_STATUS from '../constants/OrderingStatus'

import { LOCAL_STORAGE_KEY } from '../constants/localStorage'

const INIT_STATE = {
   items: [],
   text: '',
   totalPrice: 0,
   toBeLoaded: 0,
   loaded: 0,
   loadingStatus: LOADING_STATUS.NOT_LOADED,
   states: [],
   server: 'cerny-rytir'
};



const App = React.createClass({

  getInitialState () {
    return INIT_STATE;
  },

  onChange (e) {
    this.setState(Object.assign({}, this.state, { text: e.target.value }));
  },

  onChangeRadio (e) {
    this.setState(Object.assign({}, this.state, { server: e.target.value }));
    console.info(this.state, e.target.value)
  },

  handleStatesResponse(states) {
    this.setState(
      Object.assign(
        {},
        this.state, 
        {states: states}
      )
    );

    console.info("state: ", this.state.states);
  },

  componentDidMount() {
    var that = this;
    loadStates(that.handleStatesResponse);
  },

  handleSaveState (e) {
    console.log("Saving state");
    e.preventDefault();
    var that = this;
    saveState(this.state, that.handleStatesResponse);
    //this.setState(Object.assign({}, this.state));
  },

  handleLoadState (state) {
    console.info("loading state...", state.state, JSON.parse(state.state));
    this.setState(Object.assign({}, JSON.parse(state.state)));
  },

  handleSubmit (e) {
    e.preventDefault();
    /*
    var that = this;
    var queue = this.state.server == 'cerny-rytir' ? parseImportCR(this.state.text) : parseImportRishada(this.state.text);
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
    var loadCards =  this.state.server == 'cerny-rytir' ? loadCardsCR : loadCardsRishada;
    loadCards(queue, addItem);*/
    const { loadCardsRequest } = this.props
    console.info(this.props)
    loadCardsRequest(this.state.text)
  },

  handleOrder (e) {
    e.preventDefault();
    const { orderCardsRequest } = this.props
    orderCardsRequest()
  },

  handleExpandCard (item) {
    const { toggleCardExpand } = this.props
    toggleCardExpand(item.id)
  },


  handleUseCheapest (e) {
    e.preventDefault();
    const { useCheapest } = this.props
    useCheapest()
  },

  handleAddToCart (mutation, card) {
    if(mutation.orderedCount == mutation.count)
      return
    const { addToCart } = this.props
    addToCart(mutation, card);
  },

  handleRemoveFromCart (mutation, card) {
    if(mutation.orderedCount == 0)
      return
    const { removeFromCart } = this.props
    removeFromCart(mutation, card);
  },

  getHeaderText () {
    if(this.state.loadingStatus == LOADING_STATUS.NOT_LOADED)
      return 'Import cards';
    if(this.state.loadingStatus == LOADING_STATUS.LOADING)
      return 'Loading cards, please wait...';
    return 'Cards overview';
  },

  render () {
    const { items, loadingStatus, orderingStatus, loaded, toBeLoaded, totalPrice} = this.props
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <StateList states={this.state.states} handleSaveState={this.handleSaveState} handleLoadState={this.handleLoadState} />
          </div>
        </div>
        <h1 className="page-header">{this.getHeaderText()}</h1>
        {loadingStatus == LOADING_STATUS.LOADING && 
          <div>
            <ProgressBar 
              stripped={true} 
              bsStyle="success"
              label={ loaded + ' / ' + toBeLoaded }
              now={ (loaded / toBeLoaded) * 100 }
            />
          </div>
        }
        {loadingStatus == LOADING_STATUS.LOADED && 
          <div className="row">
            <div className="col-lg-12">
              <Button bsStyle="default" onClick={this.handleUseCheapest}>Use cheapest</Button>
            </div>
          </div>
        }
        <CardList
          items={items}
          handleExpandCard={this.handleExpandCard}
          handleAddToCart={this.handleAddToCart}
          handleRemoveFromCart={this.handleRemoveFromCart} 
          />
        {loadingStatus == LOADING_STATUS.NOT_LOADED && 
          <form onSubmit={this.handleSubmit}>
            <textarea onChange={this.onChange} value={this.state.text} />
            <Button bsStyle="primary" bsSize="lg" type="submit">
              Do the magic
            </Button>
          </form>
        }
        {loadingStatus == LOADING_STATUS.LOADED && orderingStatus == ORDERING_STATUS.NOT_ORDERED &&
          <div>
            <Button bsStyle="primary" bsSize="lg" onClick={this.handleOrder}>
              {'Confirm & order these cards, total: ' + totalPrice + ',-'}
            </Button>
          </div>
        }
        {orderingStatus == ORDERING_STATUS.ORDERING &&
          <div className='alert alert-info'>
            <p>
              Ordering
            </p>
          </div>
        }
        {orderingStatus == ORDERING_STATUS.ORDERED && 
          <div className="alert alert-success">
            <p>
              Your order has been completed, <a href='http://www.cernyrytir.cz/index.php3?akce=0&kosicek=1' target='_blank'>continue to eshop</a>.
            </p>
          </div>
        }
      </div>
    )
  }

/*
  render: function render() {
    var that = this;
    return React.createElement(
      'div',
      null,
      React.createElement('div', {className: 'row'},
        React.createElement('div', {className: 'col-lg-12'}, 
          React.createElement(StateList, {states: this.state.states, handleSaveState: this.handleSaveState, handleLoadState: this.handleLoadState}, null)
        )
      ),
      React.createElement(
        'h1',
        {className: 'page-header'},
        this.getHeaderText()
      ),
      (this.state.loadingStatus == LOADING_STATUS.LOADING && React.createElement('div', null,
          React.createElement(ProgressBar, 
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
            React.createElement(Button, {bsStyle: 'default', onClick: this.handleUseCheapest},
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
          React.createElement(
            'div', null,
            React.createElement('input', { type: "radio", name: "server", onChange: this.onChangeRadio, value: "cerny-rytir" }), " Cerny rytir"
          ),
          React.createElement(
            'div', null,
            React.createElement('input', { type: "radio", name: "server", onChange: this.onChangeRadio, value: "rishada" }), " Rishada"
          ),
          React.createElement(Button, {bsStyle: 'primary', bsSize: 'lg', type: 'submit'}, 'Do the magic!')
        )
      ),
      (this.state.loadingStatus == LOADING_STATUS.LOADED && React.createElement('div', null,
          React.createElement(Button, {bsStyle: 'primary', bsSize: 'lg', onClick: this.handleOrder}, 
            'Confirm & order these cards, total: ' + this.state.totalPrice + ',-'
          )
        )
      )
    );
  }
*/
});

function mapStateToProps(state, ownProps) {
  return state.cards
}

export default connect(mapStateToProps, CardActions)(App)