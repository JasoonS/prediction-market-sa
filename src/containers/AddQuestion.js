import React, { Component } from 'react'
import { addQuestion } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import BlockFutureTimeTool from '../components/BlockFutureTimeTool'
import moment from 'moment'
var ethereum_address = require('ethereum-address')

class AddQuestion extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionStatement: '',
      oddsFor: null,
      oddsAgainst: null,
      initialLiquidity: null,
      timeOfBetClose: undefined,
      resolutionDeadlineTime: undefined,
      winningsClaimDeadline: undefined,
      trustedSource: '',

      // for block time calculations
      latestBlockNumber: 0,
      timeCheckedBlockNumber: moment(),
      blockTime: 24 // use an api to check this in future (ie https://etherchain.org/documentation/api/)
    }
  }

  componentDidMount() {
    this.getCurrentBlockNumber()
  }

  // TODO:: Put this into a utility folder, used by a few different components.
  getCurrentBlockNumber = () => {
    // it optimistically gets the 'pending' block number infact
    this.context.web3.eth.getBlock('pending', (error, result) => {
      if (error === null) {
        this.setState({
          ...this.state,
          latestBlockNumber: result.number,
          timeCheckedBlockNumber: moment()
        })
      }
    })
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
  setInitialLiquidity = (event, initialLiquidity) => {
    this.setState({...this.state, initialLiquidity: parseInt(initialLiquidity)})
  }
  setTimeOfBetClose = (event, timeOfBetClose) => {
    console.log(timeOfBetClose)
    console.log(parseInt(timeOfBetClose))
    this.setState({...this.state, timeOfBetClose: parseInt(timeOfBetClose)})
  }
  setResolutionDeadlineTime = (event, resolutionDeadlineTime) => {
    this.setState({...this.state, resolutionDeadlineTime: parseInt(resolutionDeadlineTime)})
  }
  setWinningsClaimDeadline = (event, winningsClaimDeadline) => {
    this.setState({...this.state, winningsClaimDeadline: parseInt(winningsClaimDeadline)})
  }
  setTrustedSource = (event, trustedSource) => {
    this.setState({...this.state, trustedSource})
  }

  // convert from block numbers to time:
  // TODO: This could be a really useful tool, npm library in the future? - encapsulate it nicely.
  fromBlockToTime = blockNumber => {
    const {
      latestBlockNumber,
      timeCheckedBlockNumber,
      blockTime
    } = this.state
    if (timeCheckedBlockNumber == undefined) return moment()

    let newMoment = timeCheckedBlockNumber.clone()

    return newMoment.add(blockTime*(blockNumber-latestBlockNumber)).clone()
  }

  fromTimeToBlock = time => {
    const {
      latestBlockNumber,
      timeCheckedBlockNumber,
      blockTime
    } = this.state

    var duration = moment.duration(time.diff(timeCheckedBlockNumber))
    return (duration.days()*(24*60*60)+duration.hours()*(60*60)+(duration.minutes()*60)+duration.seconds())/blockTime // TODO:: Test this maths thorougly, I think it might have errors.
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
    const {winningsClaimDeadline, resolutionDeadlineTime} = this.state
    if (winningsClaimDeadline == null) return ''
    if (winningsClaimDeadline <= resolutionDeadlineTime) return 'The winnings claim deadline must be after the resolution deadline.'
    return this.isGreaterThanZero(winningsClaimDeadline, this.emptyError)
  }
  isTrustedSourceValid = () => {
    return (this.state.trustedSource === '') ? '' : (ethereum_address.isAddress(this.state.trustedSource)? '' : 'This is not a valid ethereum address. Please be careful.')
  }

  submitCreateQuestionRequest = allError => {
    if (allError !== '') return // TODO:: Write a nice error message, make this more user friendly.
    // TODO:: Prevent an empty submit, and if submit show all errors (even if empty)

    const totalInRatio = this.state.oddsAgainst + this.state.oddsFor
    const amountFor = Math.round(this.state.initialLiquidity*(this.state.oddsFor/totalInRatio))
    const amountAgainst = Math.round(this.state.initialLiquidity*(this.state.oddsAgainst/totalInRatio))
    // NOTE/TODO:: there are edge cases that this doesn't cater for at the moment. Lets say it is 50/50 odds, and 5 initialLiquidity, then this algoritm will take 6 wei. But at least 1 wei is not so important/significant. Most cases it will work 'good enough'.

    // if trusted source is empty use the admin account.
    const trustedSource = ( this.state.trustedSource === '') ? this.context.accounts[0] : this.state.trustedSource

    this.props.dispatch(
      addQuestion(
        this.context.predMarketInstance,
        this.context.accounts,
        this.state.questionStatement,
        amountFor,
        amountAgainst,
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
      initialLiquidity,
      timeOfBetClose,
      resolutionDeadlineTime,
      winningsClaimDeadline,
      trustedSource,
      latestBlockNumber
    } = this.state

    const questionStatementError = this.isQuestionStatementValid()
    const oddsForError = this.isGreaterThanZero(oddsFor, this.emptyError)
    const oddsAgainstError = this.isGreaterThanZero(oddsAgainst, this.emptyError)
    const initialLiquidityError = this.isGreaterThanZero(initialLiquidity, this.emptyError)
    const timeOfBetCloseError = this.isGreaterThanZero(timeOfBetClose, this.emptyError)
    const resolutionDeadlineTimeError = this.isResolutionDeadlineTimeValid()
    const winningsClaimDeadlineError = this.isWinningsClaimDeadlineValid()
    const trustedSourceError = this.isTrustedSourceValid()
    const allError = questionStatementError + oddsForError + oddsAgainstError + initialLiquidityError + timeOfBetCloseError + resolutionDeadlineTimeError + winningsClaimDeadlineError + trustedSourceError

    // const info = () => (
    //   <div>
    //
    //   </div>
    // )

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
              hintText='Initial liquidity provided (in Wei).'
              floatingLabelText='Total Initial Market Value'
              type='number'
              onChange={this.setInitialLiquidity}
              errorText={initialLiquidityError}
            />
          </div><br />
          <p>Use these data/time pickers to help you select which block numbers you want to use for your application. Give yourself comfortable leway since these are only approximations, blocktimes vary.</p>
          <p>The current block on load is: {latestBlockNumber}</p>
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <span>
              <TextField
                hintText='Enter a block number.'
                floatingLabelText='Time of Bet Close'
                type='number'
                onChange={this.setTimeOfBetClose}
                value={timeOfBetClose}
                errorText={timeOfBetCloseError}
              />
              <BlockFutureTimeTool btnLabel='Set Using Clock' time={this.fromBlockToTime(timeOfBetClose)} returnTime={time => this.setTimeOfBetClose(null, this.fromTimeToBlock(time))}/>
            </span>
            <span>
              <TextField
                hintText='Enter a block number.'
                floatingLabelText='Resolution Deadline'
                type='number'
                onChange={this.setResolutionDeadlineTime}
                value={resolutionDeadlineTime}
                errorText={resolutionDeadlineTimeError}
              />
              <BlockFutureTimeTool btnLabel='Set Using Clock' time={this.fromBlockToTime(resolutionDeadlineTime)} returnTime={time => this.setResolutionDeadlineTime(null, this.fromTimeToBlock(time))}/>
            </span>
            <span>
              <TextField
                hintText='Enter a block number.'
                floatingLabelText='Winnings Claim Deadline'
                type='number'
                onChange={this.setWinningsClaimDeadline}
                value={winningsClaimDeadline}
                errorText={winningsClaimDeadlineError}
              />
              <BlockFutureTimeTool btnLabel='Set Using Clock' time={this.fromBlockToTime(winningsClaimDeadline)} returnTime={time => this.setWinningsClaimDeadline(null, this.fromTimeToBlock(time))}/>
            </span>
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
    questionDictionary: state.questionDictionary
  }
}

export default connect(mapStateToProps)(AddQuestion)
