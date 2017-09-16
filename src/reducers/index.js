import {
  actions
} from '../actions'

const initialState = {
  questionArray: [],
  questionDictionary: {},
  user: {
    loaded: false,
    isAdmin: false,
    userAddress: null
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SAVE_QUESTION_ARRAY:
      const questionDictionary = action.questionList.reduce(
        (obj, item) => {
          obj[item] = {}
          return obj
        }, {}
      )
      return {
        ...state,
        questionArray: action.questionList,
        questionDictionary: questionDictionary
      }
    case actions.SAVE_ADMIN:
      const user = {
        loaded: true,
        isAdmin: (action.adminAddress === action.userAddress),
        userAddress: action.userAddress
      }
      return {
        ...state,
        user: user
      }
    case actions.SAVE_QUESTION_DETAILS:
      return {
        ...state,
        questionDictionary : {
          ...state.questionDictionary,
          [action.questionId] : action.questionDetails
        }
      }
    case actions.SAVE_USERS_POSITION:
      // TODO:: Check that the question is already in `questionArray`, shouldn't ever happen, so not too important.
      const questionWithUserPosition = {
        ...state.questionDictionary[action.questionId],
        userInFavour: action.userInFavour,
        userAgainst: action.userAgainst
      }
      return {
        ...state,
        questionDictionary : {
          ...state.questionDictionary,
          [action.questionId] : questionWithUserPosition
        }
      }
    case actions.NEW_QUESTION_ADDED:
      const questionArray = [...state.questionArray, action.questionObject.questionId]

      const newQuestionDetails = {
        statement: action.questionObject.questionStatement,
        questionId: action.questionObject.questionId,
        inFavour: action.questionObject.inFavour,
        against: action.questionObject.against,
        timeOfBetClose: action.questionObject.timeOfBetClose,
        resolutionDeadlineTime: action.questionObject.resolutionDeadlineTime,
        winningsClaimDeadline: action.questionObject.winningsClaimDeadline,
        trustedSource: action.questionObject.trustedSource,
        moneyInPot: action.questionObject.inFavour + action.questionObject.against,
        // userInFavour: (state.user.isAdmin? action.questionObject.inFavour : 0),
        // userAgainst: (state.user.isAdmin? action.questionObject.against : 0),
        result: false,
        resolved: false
      }

      // prevent duplicate items in your state
      return (state.questionArray.indexOf(action.questionObject.questionId) >= 0)?
        state :
        {
          ...state,
          questionArray,
          questionDictionary : {
            ...state.questionDictionary,
            [action.questionObject.questionId] : newQuestionDetails
          }
        }
    case actions.UPDATE_POSITIONS:
      // TODO:: Check that the question is already in `questionArray`, shouldn't ever happen, so not too important.
      const questionDetails = {
        ...state.questionDictionary[action.positionObject.questionId],
        inFavour: action.positionObject.totalInFavour,
        against: action.positionObject.totalAgainst,
        userInFavour: action.positionObject.positionInFavour,
        userAgainst: action.positionObject.positionAgainst,
      }

      return {
        ...state,
        questionDictionary : {
          ...state.questionDictionary,
          [action.positionObject.questionId] : questionDetails
        }
      }
    default:
      return state
  }
}

export default reducer
