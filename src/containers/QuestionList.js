import React, { Component } from 'react'
import { loadQuestionArray } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import QuestionItem from '../components/QuestionItem'
import Checkbox from 'material-ui/Checkbox'

class QuestionArray extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openToBet: true,
      closedButUnresolved: true,
      resolved: true,
      openToWidrawl: true,
      archived: true,
      latestBlockNumber: 0 // could do much more UX friendly stuff with this.
    }
  }

  componentDidMount() {
    this.getCurrentBlockNumber()
  }

  getCurrentBlockNumber = () => {
    // it optimistically gets the 'pending' block number infact
    this.context.web3.eth.getBlock('pending', (error, result) => {
      if (error === null) {
        this.setState({
          ...this.state,
          latestBlockNumber: result.number
        })
      }
    })
  }

  componentWillMount() {
    if(this.context.instanceLoaded){
      this.props.dispatch(
        loadQuestionArray(this.context.predMarketInstance, this.context.accounts)
      )
    }
  }

  setOpenToBet = (event, openToBet) => {
    this.setState({...this.state, openToBet})
  }
  setClosedButUnresolved = (event, closedButUnresolved) => {
    this.setState({...this.state, closedButUnresolved})
  }
  setResolved = (event, resolved) => {
    this.setState({...this.state, resolved})
  }
  setOpenToWidrawl = (event, openToWidrawl) => {
    this.setState({...this.state, openToWidrawl})
  }
  setArchived = (event, archived) => {
    this.setState({...this.state, archived})
  }

  render() {
    const {
      questionArray,
      questionDictionary
    } = this.props

    const listItems = questionArray.map(
      (item, index) =>
        <QuestionItem key={index} questionData={questionDictionary[item]}/>
    )

    return (
      <div>
        <h1>Question List</h1>
        <div style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Checkbox
            label="Question is open."
            checked={this.state.openToBet}
            onCheck={this.setOpenToBet.bind(this)}
          />
          <Checkbox
            label="Closed but un-resolved."
            checked={this.state.closedButUnresolved}
            onCheck={this.setClosedButUnresolved.bind(this)}
          />
          <Checkbox
            label="Closed but resolved."
            checked={this.state.resolved}
            onCheck={this.setResolved.bind(this)}
          />
          <Checkbox
            label="In withdrawl period."
            checked={this.state.openToWidrawl}
            onCheck={this.setOpenToWidrawl.bind(this)}
          />
          <Checkbox
            label="Archived."
            checked={this.state.archived}
            onCheck={this.setArchived.bind(this)}
          />
        </div>
        {listItems}
      </div>
    )
  }
}

QuestionArray.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

const mapStateToProps = state => {
  return {
    questionArray: state.questionArray,
    questionDictionary: state.questionDictionary
  }
}

export default connect(mapStateToProps)(QuestionArray)
