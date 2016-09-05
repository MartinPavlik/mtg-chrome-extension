import React, { Component, PropTypes } from 'react'
import {Button, ProgressBar} from 'react-bootstrap'
import { connect } from 'react-redux'

import {loadCards as loadCardsRishada, parseImport as parseImportRishada} from '../utils/scraper.rishada'
import {sendOrder as sendOrderRishada} from '../utils/api.rishada'

import {loadCards as loadCardsCR, parseImport as parseImportCR} from '../utils/scraper.cernyRytir'
import {sendOrder as sendOrderCR} from '../utils/api.cernyRytir'

import * as CardActions from '../actions/CardActions'

import CardList from '../components/cardList'

import ImportForm from '../components/importForm'

import * as LOADING_STATUS from '../constants/LoadingStatus'
import * as ORDERING_STATUS from '../constants/OrderingStatus'

const App = React.createClass({

  handleSubmit (e) {
    e.preventDefault();
    const { loadCardsRequest } = this.props
    const { text } = this.props.form.import.values
    loadCardsRequest(text)
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
    const { loadingStatus } = this.props.cards
    if(loadingStatus == LOADING_STATUS.NOT_LOADED)
      return 'Import cards';
    if(loadingStatus == LOADING_STATUS.LOADING)
      return 'Loading cards, please wait...';
    return 'Cards overview';
  },

  render () {
    const { items, loadingStatus, orderingStatus, loaded, toBeLoaded, totalPrice} = this.props.cards
    return (
      <div>
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
          <ImportForm handleSubmit={this.handleSubmit} />
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
});

function mapStateToProps(state, ownProps) {
  return state;
}

export default connect(mapStateToProps, CardActions)(App)