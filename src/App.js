import React, { Component, PropTypes } from 'react'
import PredictionMarketContract from '../build/contracts/PredictionMarket.json'
import QuestionList from './Containers/QuestionList'
import { connect } from 'react-redux'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="App">
        <QuestionList/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(App)
