const PredictionMarket = artifacts.require('./PredictionMarket.sol')
const helpers = require('./helpers')
const sha3 = require('js-sha3')
const keccak = sha3.keccak256

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

      // Expected question attributes
      questionHash = "0x"+keccak(defaultQuestionParams.question)
      resolutionDeadlineTime = defaultQuestionParams.timeOfBetClose + resolvePeriod
      winningsClaimDeadline = resolutionDeadlineTime + claimPeriod

      args = tx.logs[0].args
      assert.equal(args.questionStatement,                 defaultQuestionParams.question,               "Event log did not match")
      assert.equal(args.questionId,                        questionHash,                                 "Parameter did not match")
      assert.equal(args.inFavour.toString(),               defaultQuestionParams.initialPosition[0],     "Event log did not match")
      assert.equal(args.against.toString(),                defaultQuestionParams.initialPosition[1],     "Event log did not match")
      assert.equal(args.timeOfBetClose.toString(),         defaultQuestionParams.timeOfBetClose,         "Event log did not match")
      assert.equal(args.resolutionDeadlineTime.toString(), resolutionDeadlineTime,                       "Event log did not match")
      assert.equal(args.winningsClaimDeadline.toString(),  winningsClaimDeadline,                        "Event log did not match")
      assert.equal(args.trustedSource,                     defaultQuestionParams.trustedSource,          "Event log did not match")

      let q = await instance.questions(questionHash)

      assert.equal(q[0], defaultQuestionParams.question,               "Event log did not match")
      assert.equal(q[1], defaultQuestionParams.initialPosition[0],     "Event log did not match")
      assert.equal(q[2], defaultQuestionParams.initialPosition[1],     "Event log did not match")
      assert.equal(q[3], defaultQuestionParams.timeOfBetClose,         "Event log did not match")
      assert.equal(q[4], resolutionDeadlineTime,                       "Event log did not match")
      assert.equal(q[5], winningsClaimDeadline,                        "Event did did not match")
      assert.equal(q[6], defaultQuestionParams.trustedSource,          "Event did did not match")
      assert.equal(q[7], true,                                         "Event did did not match")
      assert.equal(q[9], false,                                        "Event did did not match")
      assert.equal(q[8], 0,                                            "Event did did not match")
      assert.equal(q[9], false,                                        "Event did did not match")
    })

    // transaction sent from nonadmin
    it('should not allow a non-administrator to create a question', async function () {
      question = defaultQuestionParams
      question.from = acc.nonadmin

      helpers.assertThrow(() => addQuestion(question))
    })
  })

  describe('What questions can be added', () => {
    it('should not be possible to add a question that exists', async function () {
      await addQuestion(defaultQuestionParams)

      helpers.assertThrow(() => addQuestion(defaultQuestionParams))

      // return await addQuestion(defaultQuestionParams)
      // .then(() => {
      //   assert(false, "Expected contract call to fail") 
      // })
      // .catch(e => {})
    })
      
    // resolutionDeadlineTime is set to current time i.e. before timeOfBetClose
    it('should not be posible for the time of bet close to be after resolution deadline', async function () {
      question = defaultQuestionParams
      question.resolvePeriod = - 1

      helpers.assertThrow(() => addQuestion(question))

      // return await addQuestion(question)
      // .then(() => {
      //   assert(false, "Expected contract call to fail") 
      // })
      // .catch(e => {})
    })
  })
})
