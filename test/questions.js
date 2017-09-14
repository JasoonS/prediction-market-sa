const PredictionMarket = artifacts.require('./PredictionMarket.sol')
const helpers = require('./helpers')

const addQuestion = helpers.addQuestion
const handleError = helpers.handleError
const createDefaultQuestionParams = helpers.createDefaultQuestionParams
const acc = helpers.accounts()

contract('PredicationMarket', account => {
  var instance
  var defaultQuestion

  beforeEach(async function () {
    instance = await PredictionMarket.new({from: acc.admin})
    defaultQuestionParams = createDefaultQuestionParams(instance)
  })

  describe('Who can add question?', () => {
    it('should allow an administrator to create a question', async function () {
      const tx = await addQuestion(defaultQuestionParams)

      questionHash = web3.sha3(defaultQuestionParams.question)

      args = tx.logs[0].args
      assert.equal(args.questionStatement,                 defaultQuestionParams.question,               "Parameter did not match")
      assert.equal(args.questionId,                        questionHash,                                 "Parameter did not match")
      assert.equal(args.inFavour.toString(),               defaultQuestionParams.initialPosition[0],     "Parameter did not match")
      assert.equal(args.against.toString(),                defaultQuestionParams.initialPosition[1],     "Parameter did not match")
      assert.equal(args.timeOfBetClose.toString(),         defaultQuestionParams.timeOfBetClose,         "Parameter did not match")
      assert.equal(args.resolutionDeadlineTime.toString(), defaultQuestionParams.resolutionDeadlineTime, "Parameter did not match")
      assert.equal(args.winningsClaimDeadline.toString(),  defaultQuestionParams.winningsClaimDeadline,  "Parameter did not match")
      assert.equal(args.trustedSource,                     defaultQuestionParams.trustedSource,          "Parameter did not match")

      questionHash = web3.sha3(defaultQuestionParams.question)
      let q = await instance.questions(questionHash)

      assert.equal(q[0], defaultQuestionParams.question,               "Parameter did not match")
      assert.equal(q[1], defaultQuestionParams.initialPosition[0],     "Parameter did not match")
      assert.equal(q[2], defaultQuestionParams.initialPosition[1],     "Parameter did not match")
      assert.equal(q[3], defaultQuestionParams.timeOfBetClose,         "Parameter did not match")
      assert.equal(q[4], defaultQuestionParams.resolutionDeadlineTime, "Parameter did not match")
      assert.equal(q[5], defaultQuestionParams.winningsClaimDeadline,  "Parameter did not match")
      assert.equal(q[6], defaultQuestionParams.trustedSource,          "Parameter did not match")
      assert.equal(q[7], true,                                         "Parameter did not match")
      assert.equal(q[9], false,                                        "Parameter did not match")
      assert.equal(q[8], 0,                                            "Parameter did not match")
      assert.equal(q[9], false,                                        "Parameter did not match")
    })

    // transaction sent from nonadmin
    it('non-administrator to create a question', async function () {
      question = defaultQuestionParams
      question.from = acc.nonadmin
      return await addQuestion(question)
      .catch(e => handleError(e))
    })
  })

  describe('What questions can be added', () => {
    it('should not possible to added a question that exists', async function () {
      await addQuestion(defaultQuestionParams)

      return await addQuestion(defaultQuestionParams)
      .catch(e => handleError(e))
    })

    // resolutionDeadlineTime is set to current time i.e. before timeOfBetClose
    it('should not be posible for the time of bet close to be after resolution deadline', async function () {
      question = defaultQuestionParams
      question.resolutionDeadlineTime = question.timeOfBetClose - 1
      return await addQuestion(question)
      .catch(e => handleError(e))
    })
  })
})
