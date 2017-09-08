import {
  actions
} from '../actions'

const initialState = {
  questionList: [],
  user: {
    loaded: false,
    isAdmin: false,
    userAddress: null
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SAVE_QUESTION_LIST:
      return {
        ...state,
        questionList: action.questionList
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
    default:
      return state
  }
}

export default reducer
