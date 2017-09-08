import React, { Component } from 'react'
import { loadAddQuestion } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import QuestionItem from '../components/QuestionItem'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class AddQuestion extends Component {
  render() {
    return (
      <div>
        <h1>Add Question</h1>
        <div>
          <TextField
            floatingLabelText="Question Statement"
            hintText="Enter your question statement in terms of a true/false question"
            fullWidth={true}
          /><br />
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TextField
              hintText="Ratio for."
              floatingLabelText="Initial Odds For"
              type="number"
            />
            <TextField
              hintText="Ratio against."
              floatingLabelText="Initial Odds Against"
              type="number"
            />
            <TextField
              hintText="Initial liquidity provided."
              floatingLabelText="Total Initial Market Value"
              type="number"
            />
          </div><br />
          <div style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TextField
              hintText="Enter a block number."
              floatingLabelText="Time of Bet Close"
              type="number"
            />
            <TextField
              hintText="Enter a block number."
              floatingLabelText="Resolution Deadline"
              type="number"
            />
            <TextField
              hintText="Enter a block number."
              floatingLabelText="Winnings Claim Deadline"
              type="number"
            />
          </div><br />
          {/*TODO:: use `npm install ethereum-address` later to test*/}
          <TextField
            floatingLabelText="Trusted Source"
            hintText="The address of the person you entrust to resolve this bet. (leave blank if yourself)"
            fullWidth={true}
          />
          <RaisedButton label="Create Question" fullWidth={true} />
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
