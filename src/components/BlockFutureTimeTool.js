import React, { Component } from 'react'
import { createPosition } from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'
import IconButton from 'material-ui/IconButton'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

// TODO:: Put this into it's own component.
// hacked this https://github.com/dmtrKovalenko/material-ui-datetimepicker because the npm package was broken.
export default class BlockFutureTimeTool extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dateTime: this.props.time
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dateTime: this.props.time
    })
  }

  openDatePicker = () => {
    this.refs.datePicker.openDialog()
  }

  selectDate = (err, date) => {
    this.setState({ dateTime: moment(date) })

    // show timepicker
    this.refs.timePicker.openDialog()
  }

  selectTime = (err, date) => {
    const { dateTime } = this.state;

    // TODO:: Fix this thing is broken, it doesn't get the days properly... :/
    dateTime.hours(date.getHours())
    dateTime.minutes(date.getMinutes())

    // var duration = moment.duration(moment().diff(date));
    // dateTime.add(duration.seconds(), 'seconds')

    this.setState({ dateTime }, () => {
      this.props.returnTime(dateTime)
    })
  }

  render() {
    return (
      <span>
        <RaisedButton
          name='name' // to supress error warnings.
          label={this.props.btnLabel}
          onClick={this.openDatePicker}
          style={{width: '200px'}}
        />

        <DatePicker
          name='name' // to supress error warnings.
          onChange={this.selectDate}
          textFieldStyle={{ display: 'none' }}
          autoOk={true}
          ref="datePicker"
        />

        <TimePicker
          name='name' // to supress error warnings.
          onChange={this.selectTime}
          textFieldStyle={{ display: 'none' }}
          ref="timePicker"
        />
      </span>
    )
  }
}
