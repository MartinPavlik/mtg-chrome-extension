import React, { Component, PropTypes } from 'react'
import {Button, ProgressBar} from 'react-bootstrap'

const LOCAL_STORAGE_KEY = 'magic-states';

export default React.createClass({
  displayName: 'StateList',

  render: function render() {
    var that = this;

    var createState = function createState(state) {
      return React.createElement(Button, { 
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
        React.createElement(Button, {bsStyle: 'success', onClick: this.props.handleSaveState}, 'Save work')
      )
    )
  }

});
