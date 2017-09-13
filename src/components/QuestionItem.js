import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'

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
    const messageSubtitle = "For " + 1 + " against " + 2 + "."
    const message = JSON.stringify(this.props.questionData, null, 2)
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        {/*TODO:: put the question ID info here.*/}
        <CardHeader
          title={this.props.questionData.statement}
          subtitle={messageSubtitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <pre>{message}</pre>
        </CardText>
      </Card>
    )
  }
}
