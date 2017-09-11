import React, { Component } from 'react'
import { addQuestion } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
    this.setState({...this.state, oddsFor: parseInt(oddsFor)})
  }
  setOddsAgainst = (event, oddsAgainst) => {
    this.setState({...this.state, oddsAgainst: parseInt(oddsAgainst)})
  }
  setInitalLiquidity = (event, initalLiquidity) => {
    this.setState({...this.state, initalLiquidity: parseInt(initalLiquidity)})
  }
  setTimeOfBetClose = (event, timeOfBetClose) => {
    this.setState({...this.state, timeOfBetClose: parseInt(timeOfBetClose)})
  }
  setesolutionDeadlineTime = (event, resolutionDeadlineTime) => {
    this.setState({...this.state, resolutionDeadlineTime: parseInt(resolutionDeadlineTime)})
  }
  setWinningsClaimDeadline = (event, winningsClaimDeadline) => {
    this.setState({...this.state, winningsClaimDeadline: parseInt(winningsClaimDeadline)})
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
    if (winningsClaimDeadline == null) return ''
    if (winningsClaimDeadline < timeOfBetClose) return 'The winnings claim deadline must be after the resolution deadline.'
    return this.isGreaterThanZero(winningsClaimDeadline, this.emptyError)
  }
  isTrustedSourceValid = () => {
    return (this.state.trustedSource === '') ? '' : (ethereum_address.isAddress(this.state.trustedSource)? '' : 'This is not a valid ethereum address. Please be careful.')
  }

  submitCreateQuestionRequest = allError => {
    if (allError !== '') return // TODO:: Write a nice error message, make this more user friendly.
    // TODO:: Prevent an empty submit, and if submit show all errors (even if empty)

    // if trusted source is empty use the admin account.
    const trustedSource = ( this.state.trustedSource === '') ? this.context.accounts[0] : this.state.trustedSource

    this.props.dispatch(
      addQuestion(
        this.context.predMarketInstance,
        this.context.accounts,
        this.state.questionStatement,
        this.state.oddsFor,
        this.state.oddsAgainst,
        this.state.initalLiquidity,
        this.state.timeOfBetClose,
        this.state.resolutionDeadlineTime,
        this.state.winningsClaimDeadline,
        trustedSource
      )
    )
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

    const questionStatementError = this.isQuestionStatementValid()
    const oddsForError = this.isGreaterThanZero(oddsFor, this.emptyError)
    const oddsAgainstError = this.isGreaterThanZero(oddsAgainst, this.emptyError)
    const initalLiquidityError = this.isGreaterThanZero(initalLiquidity, this.emptyError)
    const timeOfBetCloseError = this.isGreaterThanZero(timeOfBetClose, this.emptyError)
    const resolutionDeadlineTimeError = this.isResolutionDeadlineTimeValid()
    const winningsClaimDeadlineError = this.isWinningsClaimDeadlineValid()
    const trustedSourceError = this.isTrustedSourceValid()
    const allError = questionStatementError + oddsForError + oddsAgainstError + initalLiquidityError + timeOfBetCloseError + resolutionDeadlineTimeError + winningsClaimDeadlineError + trustedSourceError
    return (
      <div>
        <h1>Add Question</h1>
        <div>
          <TextField
            floatingLabelText='Question Statement'
            hintText='Enter your question statement in terms of a true/false question'
            fullWidth={true}
            onChange={this.setQuestionStatement}
            errorText={questionStatementError}
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
              errorText={oddsForError}
            />
            <TextField
              hintText='Ratio against.'
              floatingLabelText='Initial Odds Against'
              type='number'
              onChange={this.setOddsAgainst}
              errorText={oddsAgainstError}
            />
            <TextField
              hintText='Initial liquidity provided.'
              floatingLabelText='Total Initial Market Value'
              type='number'
              onChange={this.setInitalLiquidity}
              errorText={initalLiquidityError}
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
              errorText={timeOfBetCloseError}
            />
            <TextField
              hintText='Enter a block number.'
              floatingLabelText='Resolution Deadline'
              type='number'
              onChange={this.setesolutionDeadlineTime}
              errorText={resolutionDeadlineTimeError}
            />
            <TextField
              hintText='Enter a block number.'
              floatingLabelText='Winnings Claim Deadline'
              type='number'
              onChange={this.setWinningsClaimDeadline}
              errorText={winningsClaimDeadlineError}
            />
          </div><br />
          {/*TODO:: use `npm install ethereum-address` later to test*/}
          <TextField
            floatingLabelText='Trusted Source'
            hintText='The address of the person you entrust to resolve this bet. (leave blank if yourself)'
            fullWidth={true}
            onChange={this.setTrustedSource}
            errorText={trustedSourceError}
          />
          <RaisedButton label='Create Question' fullWidth={true} onClick={() => this.submitCreateQuestionRequest(allError)}/>
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
