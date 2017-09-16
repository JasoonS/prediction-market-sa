import React, { Component, PropTypes } from 'react'
import getInstance from './utils/getInstance'
import { loadQuestionInfoById } from './actions'
import { connect } from 'react-redux'
import { newQuestionAdded, updateQuestionPossitions } from './actions'

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

      // set up listeners on the contract.
      result.predictionMarketInstance.LogQuestionAdded().watch ( (err, response) => {
        console.log('EVENT LOG(LogQuestionAdded):', response.args)
        this.props.dispatch(newQuestionAdded(response.args))
      })

      result.predictionMarketInstance.LogPositionCreated().watch ((err, response) => {
        console.log('EVENT LOG(LogPositionCreated):', response.args)
        this.props.dispatch(updateQuestionPossitions(response.args))
      })
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

export default connect()(InstanceWrapper)
