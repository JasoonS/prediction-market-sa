import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import InstanceWrapper from './InstanceWrapper'
import App from './App'
import store from './store'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <Provider store={store}>
    <InstanceWrapper>
      <MuiThemeProvider>
        <App/>
      </MuiThemeProvider>
    </InstanceWrapper>
  </Provider>,
  document.getElementById('root')
)
