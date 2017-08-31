const PredictionMarket = artifacts.require("./PredictionMarket.sol")

contract("PredicationMarket", account => {
  const acc     = web3.eth.accounts;
  const admin   = acc[1];
  const trusted = acc[2];

  var instance;

  console.log("admin", web3.eth.getBalance(admin).toString());
  console.log("trusted", web3.eth.getBalance(trusted).toString());
  
  beforeEach(() => {
    return PredictionMarket.new({from: admin}).then(_instance => {instance = _instance})
  }); 

  it("should allow an administrator to create a question", function() {

    question = "What?"
    questionHash = web3.sha3(question)
    now = new Date();
    msToBetClose = 10 * 60 * 1000;
    msToResolution = 20 * 60 * 1000;

    return instance.addQuestion(
      question,
      [1,2],
      acc[1],
      1,
      2,
      {from: admin, value: 3, gas: 3000000}
      )
    .then(tx => {
      console.log(instance.QuestionAddedEvent().formatter(tx.receipt.logs[0]))
      return instance.questions(questionHash);
    })
    .then(console.log)
  });

});
