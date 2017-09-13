import React, { Component } from 'react'
import { loadQuestionArray } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import QuestionItem from '../components/QuestionItem'

class QuestionArray extends Component {
  componentWillMount() {
    if(this.context.instanceLoaded){
      this.props.dispatch(
        loadQuestionArray(this.context.predMarketInstance, this.context.accounts)
      )
    }
  }

  render() {
    const {
      questionArray,
      questionDictionary
    } = this.props
    const listItems = questionArray.map(
      (item, index) =>
        <QuestionItem key={index} questionStatement={questionDictionary[item].statement}/>
    )

    return (
      <div>
        <h1>Question List</h1>
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