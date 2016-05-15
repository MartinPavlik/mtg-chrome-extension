import React from 'react'

import MutationList from './mutationList'

export default React.createClass({
  displayName: 'CardList',

  handleToggleExpand: function handleToggleExpand(e, item) {
    e.preventDefault();
    console.info("expand: ", e, item, this.props);
    this.props.handleExpandCard(item);
  },

  render: function render() {
    var that = this;
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
