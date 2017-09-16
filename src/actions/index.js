import getTransactionReceiptMined from '../../utils/getTransactionReceiptMined'

export const actions = {
  SAVE_QUESTION_ARRAY: 'SAVE_QUESTION_ARRAY',
  SAVE_QUESTION_DETAILS: 'SAVE_QUESTION_DETAILS',
  SAVE_USERS_POSITION: 'SAVE_USERS_POSITION',
  ADD_QUESTION_PENDING: 'ADD_QUESTION_PENDING', // TODO:: unimplemented in reducer, add later for better UX.
  ADD_QUESTION_COMPLETE: 'ADD_QUESTION_COMPLETE', // TODO:: unimplemented in reducer, add later for better UX.
  SAVE_ADMIN: 'SAVE_ADMIN',
  NEW_QUESTION_ADDED: 'NEW_QUESTION_ADDED',
  UPDATE_POSITIONS: 'UPDATE_POSITIONS',
  RESOLVE_QUESTION: 'RESOLVE_QUESTION'
}

//TODO:: Set better gas limits on these functions so I don't wait peoples money in failing transactions.

//TODO:: Add a function that easily curries all of these actions to include `(predictionMarketInstance, accounts)`.

export const loadQuestionInfoById = (predictionMarketInstance, questionId, userAddress) => {
  return dispatch => {
    predictionMarketInstance.questions(questionId).then((questionDetailsArray) => {
      const questionDetails = {
        statement: questionDetailsArray[0],
        questionId,
        inFavour: questionDetailsArray[1],
        against: questionDetailsArray[2],
        timeOfBetClose: questionDetailsArray[3],
        resolutionDeadlineTime: questionDetailsArray[4],
        winningsClaimDeadline: questionDetailsArray[5],
        trustedSource: questionDetailsArray[6],
        resolved: questionDetailsArray[8],
        moneyInPot: questionDetailsArray[9],
        result: questionDetailsArray[10],
        userInFavour: 0,
        userAgainst: 0
        // TODO:: add more relevant question details.
      }

      dispatch(loadUserQuestionPosition(predictionMarketInstance, questionId, userAddress))

      dispatch({
        type: actions.SAVE_QUESTION_DETAILS,
        questionId,
        questionDetails
      })
    })
  }
}

export const loadQuestionArray = (predictionMarketInstance, accounts) => {
  return dispatch => {
    predictionMarketInstance.getQuestionList().then((questionList) => {
      dispatch({
        type: actions.SAVE_QUESTION_ARRAY,
        questionList
      })
      questionList.map(questionId => dispatch(loadQuestionInfoById(predictionMarketInstance, questionId, accounts[0])))
    })
  }
}

export const loadUserQuestionPosition = (predictionMarketInstance, questionId, user) => {
  return dispatch => {
    predictionMarketInstance.getPosition(questionId, user).then((result) => {
      dispatch({
        type: actions.SAVE_USERS_POSITION,
        questionId,
        userInFavour: result[0],
        userAgainst: result[1]
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
      // dispatch({ type: actions.ADD_QUESTION_COMPLETE }) // opting to use event logs instead.
    })
    .catch(function(e) {
      // TODO:: Handle this error.
    })
  }
}

// this is currently very simple, since only admin exists, could have more complexity when different user roles emerge
export const newQuestionAdded = questionObject => ({
  type: actions.NEW_QUESTION_ADDED,
  questionObject
})

export const createPosition = (predictionMarketInstance, accounts, questionId, amountFor, amountAgainst) => {
  const totalStake = amountFor + amountAgainst

  return dispatch => {
    predictionMarketInstance.createPosition(
      questionId,
      [amountFor, amountAgainst],
      {from: accounts[0], value: totalStake, gas: 3000000}
    )
    .then((tx) => {
      // dispatch({ type: actions.SOMETHING_IN_THE_FUTURE_MAYBE?? }) // opting to use event logs instead.
    })
    .catch(function(e) {
      // TODO:: Handle this error.
    })
  }
}

export const updateQuestionPossitions = positionObject => ({
  type: actions.UPDATE_POSITIONS,
  positionObject
})

export const closeBet = (predictionMarketInstance, accounts, questionId, result) => {
  return dispatch => {
    predictionMarketInstance.closeBet(
      questionId,
      result,
      {from: accounts[0],gas: 3000000}
    )
    .then((tx) => {
      // dispatch({ type: actions.SOMETHING_IN_THE_FUTURE_MAYBE?? }) // opting to use event logs instead.
    })
    .catch(function(e) {
      // TODO:: Handle this error.
    })
  }
}

export const resolveQuestion = questionObject => ({
  type: actions.RESOLVE_QUESTION,
  questionObject
})
