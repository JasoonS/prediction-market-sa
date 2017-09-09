const PredictionMarket = artifacts.require('./PredictionMarket.sol')
const helpers = require('./helpers')

const addQuestion = helpers.addQuestion
const handleError = helpers.handleError

contract('PredicationMarket', account => {
  const acc = web3.eth.accounts
  const admin = acc[1]
  const trusted = acc[2]
  const nonadmin = acc[3]

  var instance

  beforeEach(async function () {
    instance = await PredictionMarket.new({from: admin})
  })

  describe('Add Question', () => {
    question = 'What?'
    questionHash = web3.sha3(question)
    now = Date.now()
    timeOfBetClose = now + 10 * 60 * 1000
    resolutionDeadlineTime = now + 20 * 60 * 1000
    winningsClaimDeadline = now + 30 * 60 * 1000

    it('should allow an administrator to create a question', async function () {
      await addQuestion(instance, admin, question, [1, 2], acc[1], timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline)

      let q = await instance.questions(questionHash)

      assert.equal(q[0], question, 'Question was not added.')
    })

    describe('should throw if', () => {
      it('question exists', async function () {
        await addQuestion(instance, admin, question, [1, 2], acc[1], timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline)

        return await addQuestion(instance, admin, question, [1, 2], acc[1], timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline)
        .catch(e => handleError(e))
      })

      // transaction sent from nonadmin
      it('non-administrator to create a question', async function () {
        return await addQuestion(instance, nonadmin, question, [1, 2], acc[1], timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline)
        .catch(e => handleError(e))
      })

      // resolutionDeadlineTime is set to current time i.e. before timeOfBetClose
      it('time of bet close is after resolution deadline', async function () {
        return await addQuestion(instance, nonadmin, question, [1, 2], acc[1], timeOfBetClose, now, winningsClaimDeadline)
        .catch(e => handleError(e))
      })
    })
  })
})
