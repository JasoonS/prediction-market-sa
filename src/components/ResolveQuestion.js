import React, { Component } from 'react'
import { closeBet } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class ResolveQuestion extends Component {
  render() {
    const {
      accounts,
      predMarketInstance
    } = this.context
    const {
      trustedSource,
      dispatch,
      questionId
    } = this.props
    const isUserTheResolver = (trustedSource === accounts[0])
    if (isUserTheResolver){
      return (
        <div>
          <h3>Resolve Bet</h3>
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <RaisedButton label='Close question with True'
              onClick={
                () => dispatch(closeBet(predMarketInstance, accounts, questionId, true))
              }/>
            <RaisedButton label='Close question with False'
              onClick={
                () => dispatch(closeBet(predMarketInstance, accounts, questionId, false))
              }/>
          </div><br />
        </div>
      )
    } else {
      return <h3>Waiting for the Trusted Source to resolve this bet. (be patient or pester him!)</h3>
    }
  }
}

ResolveQuestion.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

export default connect()(ResolveQuestion)
