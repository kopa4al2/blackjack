import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import InitializationLayer from './InitializationLayer'
import store from './reduxStore'
import * as serviceWorker from './serviceWorker'
import './index.css'


ReactDOM.render(
  <Provider store={store}>
    <InitializationLayer/>
  </Provider>
  , document.getElementById('root'))


serviceWorker.unregister()
