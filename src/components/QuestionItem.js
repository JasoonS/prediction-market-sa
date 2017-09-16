import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import AddPosition from './AddPosition'
import QuestionResult from './QuestionResult'
import ResolveQuestion from './ResolveQuestion'
import Withdraw from './Withdraw'
import Archived from './Archived'

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
    const {
      questionId,
      statement,
      trustedSource,
      result,
      resolutionDeadlineTime,
      winningsClaimDeadline
    } = this.props.questionData
    const messageSubtitle = "For " + 1 + " against " + 2 + "."
    const message = JSON.stringify(this.props.questionData, null, 2)

    const openOnly = component => ('open' === this.props.questionState) ? component : null
    const unresolvedOnly = component => ('unresolved' === this.props.questionState) ? component : null
    const resolvedOnly = component => ('resolved' === this.props.questionState) ? component : null
    const withdrawlOnly = component => ('withdrawl' === this.props.questionState) ? component : null
    const archivedOnly = component => ('archived' === this.props.questionState) ? component : null

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        {/*TODO:: put the question ID info here.*/}
        <CardHeader
          title={statement}
          subtitle={messageSubtitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {openOnly(<AddPosition questionId={questionId} />)}
          {unresolvedOnly(<ResolveQuestion questionId={questionId} trustedSource={trustedSource}/>)}
          {resolvedOnly(<QuestionResult result={result} resolutionDeadlineTime={resolutionDeadlineTime}/>)}
          {withdrawlOnly(<Withdraw result={result} winningsClaimDeadline={winningsClaimDeadline}/>)}
          {archivedOnly(<Archived result={result} winningsClaimDeadline={winningsClaimDeadline}/>)}
          <pre>{message}</pre>
        </CardText>
      </Card>
    )
  }
}
