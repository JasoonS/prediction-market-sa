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
    case actions.NEW_QUESTION_ADDED:
      console.log('from event', action.questionObject)
      // prevent duplicate items in your array.
      const questionArray = (state.questionArray.indexOf(action.questionObject.questionId) > 0)?
        state.questionArray : [...state.questionArray, action.questionObject.questionId]

      const questienDetails = {
        statement: action.questionObject.questionStatement,
        questionId: action.questionObject.questionId,
        inFavour: action.questionObject.inFavour,
        against: action.questionObject.against,
        timeOfBetClose: action.questionObject.timeOfBetClose,
        resolutionDeadlineTime: action.questionObject.resolutionDeadlineTime,
        winningsClaimDeadline: action.questionObject.winningsClaimDeadline,
        trustedSource: action.questionObject.trustedSource,
        resolved: false
      }
      return {
        ...state,
        questionArray,
        questionDictionary : {
          ...state.questionDictionary,
          [action.questionObject.questionId] : questienDetails
        }
      }
    default:
      return state
  }
}

export default reducer
