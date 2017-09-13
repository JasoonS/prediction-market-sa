import getTransactionReceiptMined from '../../utils/getTransactionReceiptMined'

export const actions = {
  SAVE_QUESTION_ARRAY: 'SAVE_QUESTION_ARRAY',
  SAVE_QUESTION_DETAILS: 'SAVE_QUESTION_DETAILS',
  ADD_QUESTION_PENDING: 'ADD_QUESTION_PENDING', // TODO:: unimplemented in reducer, add later for better UX.
  ADD_QUESTION_COMPLETE: 'ADD_QUESTION_COMPLETE', // TODO:: unimplemented in reducer, add later for better UX.
  SAVE_ADMIN: 'SAVE_ADMIN',
  NEW_QUESTION_ADDED: 'NEW_QUESTION_ADDED'
}

//TODO:: Add a function that easily curries all of these actions to include `(predictionMarketInstance, accounts)`.

export const loadQuestionInfoById = (predictionMarketInstance, questionId) => {
  return dispatch => {
    predictionMarketInstance.questions(questionId).then((questionDetailsArray) => {
      const questionDetails = {
        statement: questionDetailsArray[0]
        // TODO:: add more relevant question details.
      }
      dispatch({
        type: actions.SAVE_QUESTION_DETAILS,
        questionId,
        questionDetails
      })
    })
  }
}

export const loadQuestionArray = (predictionMarketInstance) => {
  return dispatch => {
    predictionMarketInstance.getQuestionList().then((questionList) => {
      dispatch({
        type: actions.SAVE_QUESTION_ARRAY,
        questionList
      })
      questionList.map(questionId => dispatch(loadQuestionInfoById(predictionMarketInstance, questionId)))
    })
  }
}

// this is currently very simple, since only admin exists, could have more complexity when different user roles emerge
export const loadUsers = (predictionMarketInstance, accounts) => {
  return dispatch => {
    predictionMarketInstance.admin().then((result) => {
        dispatch({
          type: actions.SAVE_ADMIN,
          adminAddress: result,
          userAddress: accounts[0]
        })
    })
  }
}

export const addQuestion = (
  predictionMarketInstance,
  accounts,
  questionStatement,
  amountFor,
  amountAgainst,
  timeOfBetClose,
  resolutionDeadlineTime,
  winningsClaimDeadline,
  trustedSource
) => {
  predictionMarketInstance.getTransactionReceiptMined = getTransactionReceiptMined // TODO:: Do this more efficiently (ie only once) at startup.

  const initialLiquidity = amountFor + amountAgainst
  return dispatch => {
    predictionMarketInstance.addQuestion(
      questionStatement,
      [amountFor, amountAgainst],
      trustedSource,
      timeOfBetClose,
      resolutionDeadlineTime,
      winningsClaimDeadline,
      {from: accounts[0], value: initialLiquidity, gas: 3000000}
    )
    .then((tx) => {
      // dispatch({ type: actions.ADD_QUESTION_COMPLETE })
      // dispatch({ type: actions.ADD_QUESTION_PENDING }) // TODO:: Do some research, do truffle contract instances return from promises only when they have been mined?
    })
    .catch(function(e) {
      // TODO:: Handle this error.
    })
    // TODO:: listen to events to log when ADD_QUESTION_COMPLETE
  }
}

// this is currently very simple, since only admin exists, could have more complexity when different user roles emerge
export const newQuestionAdded = (predictionMarketInstance, questionObject) => {
  console.log('new Question, added', questionObject)

  return {
    type: actions.NEW_QUESTION_ADDED,
    questionObject
  }
}
