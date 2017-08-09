import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/app'
import configureStore from './store/configureStore'

function init() {
   const mountPoint = document.getElementById('app')
   const store = configureStore()
   render(
      <Provider store={store}>
         <App />
      </Provider>
      ,
      mountPoint
   )
}
init()