import React, { Component, PropTypes } from 'react'
import PredictionMarketContract from '../build/contracts/PredictionMarket.json'
import QuestionList from './Containers/QuestionList'
import getInstance from './utils/getInstance'
import { connect } from 'react-redux'
import { setInstanceLoaded } from './actions'

class InstanceWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instanceLoaded: false,
      accounts: null,
      web3: null,
      predMarketInstance: null
    }
  }

  componentDidMount() {
    getInstance().then(result =>{
      this.setState((prevState, props) => (
        {
          instanceLoaded: true,
          accounts: result.accounts,
          web3: result.web3,
          predMarketInstance: result.predictionMarketInstance
        })
      )
    })
  }

  getChildContext() {
    return this.state
  }


  render() {
    const { children } = this.props
    return (children && this.state.instanceLoaded) ? React.Children.only(children) : <h1>busy loading</h1>
  }
}

InstanceWrapper.childContextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

export default InstanceWrapper
