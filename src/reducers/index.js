import {
  actions
} from '../actions'

const initialState = {
  questionList: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SAVE_QUESTION_LIST:
      return {
        ...state,
        questionList: action.questionList
      }
    default:
      return state
  }
}

export default reducer
