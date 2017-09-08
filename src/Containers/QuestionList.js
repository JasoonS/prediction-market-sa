import React, { Component } from 'react'
import { loadQuestionList } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class QuestionList extends Component {
  componentWillMount() {
    if(this.context.instanceLoaded){
      this.props.dispatch(
        loadQuestionList(this.context.predMarketInstance, this.context.accounts)
      )
    }
  }

  render() {
    return (
      <h1>hello I'm a list</h1>
    )
  }
}

QuestionList.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  predMarketInstance: PropTypes.object
}

const mapStateToProps = state => {
  return {
    questionList: state.questionList
   }
}

export default connect(mapStateToProps)(QuestionList)
