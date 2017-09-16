import React, { Component } from 'react'
import { createPosition } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class AddPosition extends Component {
  constructor(props) {
    super(props)

    this.state = {
      oddsFor: null,
      oddsAgainst: null,
      amountToStake: null
    }
  }

  setOddsFor = (event, oddsFor) => {
    this.setState({...this.state, oddsFor: parseInt(oddsFor)})
  }
  setOddsAgainst = (event, oddsAgainst) => {
    this.setState({...this.state, oddsAgainst: parseInt(oddsAgainst)})
  }
  setTotalStakedValue = (event, amountToStake) => {
    this.setState({...this.state, amountToStake: parseInt(amountToStake)})
  }

  // TODO:: Add input checking to make sure odds are not negative

  submitCreateQuestionRequest = allError => {
    // TODO:: do some imput validation.

    const totalInRatio = this.state.oddsAgainst + this.state.oddsFor
    const amountFor = Math.round(this.state.amountToStake*(this.state.oddsFor/totalInRatio))
    const amountAgainst = Math.round(this.state.amountToStake*(this.state.oddsAgainst/totalInRatio))
    // NOTE/TODO:: there are edge cases that this doesn't cater for at the moment. Lets say it is 50/50 odds, and 5 amountToStake, then this algoritm will take 6 wei. But at least 1 wei is not so important/significant. Most cases it will work 'good enough'.

    console.log('incomponent', this.context.predMarketInstance,
    this.context.accounts,
    amountFor,
    amountAgainst)
    this.props.dispatch(
      createPosition(
        this.context.predMarketInstance,
        this.context.accounts,
        this.props.questionId,
        amountFor,
        amountAgainst
      )
    )
  }

  render() {
    return (
      <div>
        <h3>Create Position</h3>
        <div style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <TextField
            hintText='Ratio for.'
            floatingLabelText='Enter your Odds For'
            type='number'
            onChange={this.setOddsFor}
          />
          <TextField
            hintText='Ratio against.'
            floatingLabelText='Enter your Odds Against'
            type='number'
            onChange={this.setOddsAgainst}
          />
          <TextField
            hintText='Total staked value (in Wei).'
            floatingLabelText='Total value you are willing to stake'
            type='number'
            onChange={this.setTotalStakedValue}
          />
          <RaisedButton label='Create Position' onClick={this.submitCreateQuestionRequest}/>
        </div><br />
      </div>
    )
  }
}

AddPosition.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

export default connect()(AddPosition)
