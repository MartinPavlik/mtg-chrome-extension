import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MutationList from './mutationList'

export default class CardList extends Component {

  constructor(props) {
    super(props)
    this.renderCard = this.renderCard.bind(this)
    this.handleToggleExpand = this.handleToggleExpand.bind(this)
  }

  handleToggleExpand(e, item) {
    const { handleExpandCard } = this.props;
    handleExpandCard(item);
  }

  renderCard(item) {
    const that = this
    return (
      <div className='card' key={ item.id }>
        <div 
          className={ item.orderedCount >= item.count ? 'card-head finished' : 'card-head' }
          onClick={ (e) => that.handleToggleExpand(e, item) }
        >
          { item.name }
          <span className='pull-right'>
            { item.orderedCount + ' / ' + item.count }
          </span>
        </div>
        <div className='card-mutations'>
          { item.expanded == true && 
            <MutationList
              items={ item.mutations }
              handleAddToCart={ that.props.handleAddToCart }
              handleRemoveFromCart={ that.props.handleRemoveFromCart }
              card={ item }
            />
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='card-list'>
        { this.props.items.map(this.renderCard) }
      </div>
    );
  }
}

CardList.propTypes = {
  items: PropTypes.array.isRequired,
  handleExpandCard: PropTypes.func.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired
};