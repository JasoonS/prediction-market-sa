pragma solidity ^0.4.16;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) questions;
    
    //Todo - use safemath

    struct Question {
        string questionStatement;
        mapping (address => Position) positions;
        uint inFavour;
        uint against;
        uint timeOfBetClose;
        uint resolutionDeadlineTime;
        address trustedSource;
        bool exists;
    }
    
    struct Position {
        uint inFavour;
        uint against;
    }

    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    modifier betStillOpen(bytes32 questionId) {
        require(block.timestamp < questions[questionId].timeOfBetClose);
        _;
    }

    function PredictionMarket() {
      admin = msg.sender;
    }
    
    function addQuestion (
        string questionStatement,
        uint[2] initialPosition,
        address trusteSsorce,
        uint timeOfBetClose,
        uint resolutionDeadlineTime
    )
        external
        payable
        isAdmin
    {   
        require(timeOfBetClose < resolutionDeadlineTime);
        
        bytes32 questionId = sha3(questionStatement);

        require(!questions[questionId].exists);
        
        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }
        questions[questionId].questionStatement = questionStatement;
        questions[questionId].inFavour = initialPosition[0];
        questions[questionId].against = initialPosition[1];
        questions[questionId].timeOfBetClose = timeOfBetClose;
        questions[questionId].resolutionDeadlineTime = resolutionDeadlineTime;
        questions[questionId].trustedSource = trusteSsorce;
    }
    
    function createPosition (bytes32 questionId, uint[2] initialPosition)
        payable
        betStillOpen(questionId)
        returns (bool)
    {
        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }
        
        questions[questionId].inFavour += initialPosition[0];
        questions[questionId].against += initialPosition[1];
        
        questions[questionId].positions[msg.sender].inFavour += initialPosition[0];
        questions[questionId].positions[msg.sender].against += initialPosition[1];
    }
    
    // Other option is to make `Position` type into uint[2] type and then no need for this getter
    function getPosition (bytes32 questionId)
        public
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].positions[msg.sender].inFavour;
        against = questions[questionId].positions[msg.sender].against;
    }
    
    function getBetOdds (bytes32 questionId)
        public
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].inFavour;
        against = questions[questionId].against;
    }
}
