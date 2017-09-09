const PredictionMarket = artifacts.require('./PredictionMarket.sol')
const helpers = require('./helpers')

const addQuestion = helpers.addQuestion
const handleError = helpers.handleError
const createDefaultQuestionParam = helpers.createDefaultQuestionParam
const acc = helpers.accounts()

contract('PredicationMarket', account => {
  var instance
  var defaultQuestion

  beforeEach(async function () {
    instance = await PredictionMarket.new({from: acc.admin})
    defaultQuestion = createDefaultQuestionParam(instance)
  })

  describe('Add Question', () => {
    it('should allow an administrator to create a question', async function () {
      await addQuestion(defaultQuestion)

      questionHash = web3.sha3(defaultQuestion.question)
      let q = await instance.questions(questionHash)

      assert.equal(q[0], question, 'Question was not added.')
    })

    describe('should throw if', () => {
      it('question exists', async function () {
        await addQuestion(defaultQuestion)

        return await await addQuestion(defaultQuestion)
        .catch(e => handleError(e))
      })

      // transaction sent from nonadmin
      it('non-administrator to create a question', async function () {
        question = defaultQuestion
        question.from = acc.nonadmin
        return await addQuestion(question)
        .catch(e => handleError(e))
      })

      // resolutionDeadlineTime is set to current time i.e. before timeOfBetClose
      it('time of bet close is after resolution deadline', async function () {
        question = defaultQuestion
        question.resolutionDeadlineTime = question.timeOfBetClose - 1
        return await addQuestion(question)
        .catch(e => handleError(e))
      })
    })
  })
})
