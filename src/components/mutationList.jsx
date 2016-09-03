import React from 'react'

import {Button, Popover, OverlayTrigger} from 'react-bootstrap'

export default React.createClass({
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
            OverlayTrigger, 
            {
              trigger: 'hover', 
              placement: 'right',
              container: this,
              overlay: React.createElement(Popover, null,
                React.createElement('img', {src: item.imgUrl, width: 300}),
                (item.orderedCount >= item.count && React.createElement('p', {className: 'alert alert-danger'}, 
                  'No more cards available')
                )
              )
            },
            React.createElement(
              Button,
              {
                bsStyle: that.getBsStyle(item.name),
                onClick: function(e) {
                  e.preventDefault();
                  console.info(item, that.props.card)
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
              React.createElement(Button,
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