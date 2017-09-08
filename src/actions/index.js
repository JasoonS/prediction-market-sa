import PredictionMarketContract from '../../build/contracts/PredictionMarket.json'
import Config from '../../truffle.js'
import Web3 from 'web3'

export const actions = {
  SAVE_QUESTION_LIST: 'SAVE_QUESTION_LIST'
}

export const loadQuestionList = (predictionMarketInstance, accounts) => {
  return dispatch => {
    predictionMarketInstance.getQuestionList().then((result) => {
        dispatch({
          type: actions.SAVE_QUESTION_LIST,
          questionList: result
        })
    })
  }
}
