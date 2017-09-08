import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'

export default class QuestionItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded})
  }

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle})
  }

  handleExpand = () => {
    this.setState({expanded: true})
  }

  handleReduce = () => {
    this.setState({expanded: false})
  }

  render() {
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={this.props.questionStatement}
          subtitle="TODO:: put info about question status."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          Put more details and controlls in here...
        </CardText>
      </Card>
    )
  }
}
