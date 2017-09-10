import React, { Component } from 'react'
import { loadAddQuestion } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import QuestionItem from '../components/QuestionItem'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
var ethereum_address = require('ethereum-address')

class AddQuestion extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionStatement: '',
      oddsFor: null,
      oddsAgainst: null,
      initalLiquidity: null,
      timeOfBetClose: null,
      resolutionDeadlineTime: null,
      winningsClaimDeadline: null,
      trustedSource: ''
    }
  }

  // `onChange` handlers
  setQuestionStatement = (event, questionStatement) => {
    this.setState({...this.state, questionStatement})
  }
  setOddsFor = (event, oddsFor) => {
    this.setState({...this.state, oddsFor})
  }
  setOddsAgainst = (event, oddsAgainst) => {
    this.setState({...this.state, oddsAgainst})
  }
  setInitalLiquidity = (event, initalLiquidity) => {
    this.setState({...this.state, initalLiquidity})
  }
  setTimeOfBetClose = (event, timeOfBetClose) => {
    this.setState({...this.state, timeOfBetClose})
  }
  setesolutionDeadlineTime = (event, resolutionDeadlineTime) => {
    this.setState({...this.state, resolutionDeadlineTime})
  }
  setWinningsClaimDeadline = (event, winningsClaimDeadline) => {
    this.setState({...this.state, winningsClaimDeadline})
  }
  setTrustedSource = (event, trustedSource) => {
    this.setState({...this.state, trustedSource})
  }

  // input validition handlers
  // TODO: clean up these functions, they are a mess...
  emptyError = (e) => {
    return ''
  }
  isQuestionStatementValid = () => {
    return '' // TODO: Do a check to see if this question exists or not.
  }
  isGreaterThanZero = (value, elseTest) => {
    return (value == null) ? elseTest(value) : ((value > 0)? elseTest(value) : 'This value must be greater than Zero.')
  }
  isResolutionDeadlineTimeValid = () => {
    const {resolutionDeadlineTime} = this.state
    if (resolutionDeadlineTime == null) return ''
    return (resolutionDeadlineTime > this.state.timeOfBetClose)? this.isGreaterThanZero(resolutionDeadlineTime, this.emptyError) : 'The resolution deadline must be after the time of bet close.'
  }
  isWinningsClaimDeadlineValid = () => {
    const {winningsClaimDeadline, timeOfBetClose} = this.state
    console.log(winningsClaimDeadline, timeOfBetClose)
    if (winningsClaimDeadline == null) return ''
    if (winningsClaimDeadline < timeOfBetClose) return 'The winnings claim deadline must be after the resolution deadline.'
    return this.isGreaterThanZero(winningsClaimDeadline, this.emptyError)
  }
  isTrustedSourceValid = () => {
    return (this.state.trustedSource === '') ? '' : (ethereum_address.isAddress(this.state.trustedSource)? '' : 'This is not a valid ethereum address. Please be careful.')
  }

  render() {
    const {
      questionStatement,
      oddsFor,
      oddsAgainst,
      initalLiquidity,
      timeOfBetClose,
      resolutionDeadlineTime,
      winningsClaimDeadline,
      trustedSource
    } = this.state
    console.log(this.state)
    return (
      <div>
        <h1>Add Question</h1>
        <div>
          <TextField
            floatingLabelText='Question Statement'
            hintText='Enter your question statement in terms of a true/false question'
            fullWidth={true}
            onChange={this.setQuestionStatement}
            errorText={this.isQuestionStatementValid()}
          /><br />
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TextField
              hintText='Ratio for.'
              floatingLabelText='Initial Odds For'
              type='number'
              onChange={this.setOddsFor}
              errorText={this.isGreaterThanZero(oddsFor, this.emptyError)}
            />
            <TextField
              hintText='Ratio against.'
              floatingLabelText='Initial Odds Against'
              type='number'
              onChange={this.setOddsAgainst}
              errorText={this.isGreaterThanZero(oddsAgainst, this.emptyError)}
            />
            <TextField
              hintText='Initial liquidity provided.'
              floatingLabelText='Total Initial Market Value'
              type='number'
              onChange={this.setInitalLiquidity}
              errorText={this.isGreaterThanZero(initalLiquidity, this.emptyError)}
            />
          </div><br />
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TextField
              hintText='Enter a block number.'
              floatingLabelText='Time of Bet Close'
              type='number'
              onChange={this.setTimeOfBetClose}
              errorText={this.isGreaterThanZero(timeOfBetClose, this.emptyError)}
            />
            <TextField
              hintText='Enter a block number.'
              floatingLabelText='Resolution Deadline'
              type='number'
              onChange={this.setesolutionDeadlineTime}
              errorText={this.isResolutionDeadlineTimeValid()}
            />
            <TextField
              hintText='Enter a block number.'
              floatingLabelText='Winnings Claim Deadline'
              type='number'
              onChange={this.setWinningsClaimDeadline}
              errorText={this.isWinningsClaimDeadlineValid()}
            />
          </div><br />
          {/*TODO:: use `npm install ethereum-address` later to test*/}
          <TextField
            floatingLabelText='Trusted Source'
            hintText='The address of the person you entrust to resolve this bet. (leave blank if yourself)'
            fullWidth={true}
            onChange={this.setTrustedSource}
            errorText={this.isTrustedSourceValid()}
          />
          <RaisedButton label='Create Question' fullWidth={true} />
        </div>
      </div>
    )
  }
}

AddQuestion.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

const mapStateToProps = state => {
  return {
    AddQuestion: state.AddQuestion,
    questionDictionary: state.questionDictionary
  }
}

export default connect(mapStateToProps)(AddQuestion)
