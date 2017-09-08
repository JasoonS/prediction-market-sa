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
    default:
      return state
  }
}

export default reducer
