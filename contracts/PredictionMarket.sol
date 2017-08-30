pragma solidity ^0.4.16;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) questions;

    struct Question {
        string questionStatement;
        mapping (address => Position) positions;
        uint inFavour;
        uint against;
        uint timeOfBetClose;
        uint resolutionDeadlineTime;
        address trustedSource;
    }
    
    struct Position {
        uint isFavour;
        uint against;
    }

    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    // modifier isAdmin() {
    //     require(msg.sender == admin);
    //     _;
    // }

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
        isAdmin
    {   
        // todo - make sure question doesn't exist
        // make sure close date before resolution date
        // make sure msg.value >= initialPositions
        bytes32 questionId = sha3(questionStatement);
        
        questions[questionId].questionStatement = questionStatement;
        questions[questionId].inFavour = initialPosition[0];
        questions[questionId].against = initialPosition[1];
        questions[questionId].timeOfBetClose = timeOfBetClose;
        questions[questionId].resolutionDeadlineTime = resolutionDeadlineTime;
        questions[questionId].trustedSource = trusteSsorce;
    }
}
