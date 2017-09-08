import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import InstanceWrapper from './InstanceWrapper'
import App from './App'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <InstanceWrapper>
      <App/>
    </InstanceWrapper>
  </Provider>,
  document.getElementById('root')
)
