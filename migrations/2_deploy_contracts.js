var ConvertLib = artifacts.require("./ConvertLib.sol");
var PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, PredictionMarket);
  deployer.deploy(PredictionMarket);
};
