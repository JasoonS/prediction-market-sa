import getTransactionReceiptMined from '../../utils/getTransactionReceiptMined'

export const actions = {
  SAVE_QUESTION_ARRAY: 'SAVE_QUESTION_ARRAY',
  SAVE_QUESTION_DETAILS: 'SAVE_QUESTION_DETAILS',
  ADD_QUESTION_PENDING: 'ADD_QUESTION_PENDING', // TODO:: unimplemented in reducer, add later for better UX.
  ADD_QUESTION_COMPLETE: 'ADD_QUESTION_COMPLETE', // TODO:: unimplemented in reducer, add later for better UX.
  SAVE_ADMIN: 'SAVE_ADMIN',
}

//TODO:: Add a function that easily curries all of these actions to include `(predictionMarketInstance, accounts)`.

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

export const addQuestion = (predictionMarketInstance, accounts) => {
  return dispatch => {
    predictionMarketInstance.addQuestion(
      '1235', [1,2], accounts[0], 1, 2, 3,
      {from: accounts[0], value: 3, gas: 3000000}
    ).then((tx) => {
      dispatch({ type: actions.ADD_QUESTION_PENDING })
      return getTransactionReceiptMined(tx.tx);
    }).then(receipt => {
      dispatch({ type: actions.ADD_QUESTION_COMPLETE })
      // update the question list after a new question is added.
      dispatch(loadQuestionArray)
    })
  }
}
