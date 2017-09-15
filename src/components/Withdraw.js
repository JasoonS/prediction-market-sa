import React, { Component } from 'react'
import { createPosition } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export default class QuestionResult extends Component {
  render() {
    return (
      <div>
        <h3>The outcome is {this.props.result? 'YES/TRUE' : 'NO/FALSE'}.</h3>
        <p>This question has been archived (since block {this.props.winningsClaimDeadline.toString()}) and cannot be interacted with by the public; only the owner may withdraw unclaimed funds.</p>
      </div>
    )
  }
}
