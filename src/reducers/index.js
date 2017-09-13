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
      console.log(action.questionId)
      return {
        ...state,
        questionDictionary : {
           ...state.questionDictionary,
           [action.questionId] : action.questionDetails
       }
      }
    case actions.NEW_QUESTION_ADDED:
      // prevent duplicate items in your array.
      const questionArray = (state.questionArray.indexOf(action.questionObject.questionId) > 0)?
        state.questionArray : [...state.questionArray, action.questionObject.questionId]

      const questienDetails = {
        statement: action.questionObject.questionStatement
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
