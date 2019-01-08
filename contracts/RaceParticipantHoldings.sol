pragma solidity ^0.4.24;
import "./OwnableContract.sol";

contract Meta is Ownable {
    string public name = "";
    string public description = "";
    
    function setName (string _name) onlyOwner {
        name = _name;
    }
    
    function setDescription (string _description) onlyOwner {
        description = _description;
    }
}

contract RaceParticipantHoldings is Meta {
    struct Participant {
        address sender;
        uint cleared;
    }
    
    event raceStarted();
    event raceEnded();
    event addedCheckpoint(uint checkpointId);
    event addedParticipant(uint participantId);
    event checkpointCleared(uint checkpointId, uint participantId);
    
    mapping(address => uint) addressToParticipant;
    Participant[] public participants;
    string[] public checkpoints;
    address public winner;
    
    string public estimated_start_time;
    bool public is_started = false;
    bool public is_ended = false;
    uint public radius = 100;
    uint public ante = 100;

    function addCheckpoint (string _loc) onlyOwner {
        uint id = checkpoints.push(_loc);
        addedCheckpoint(id);
    }
    
    function startRace () onlyOwner {
        is_started = true;
        raceStarted();
    }
    
    modifier costs (uint _ante) {
        require(msg.value >= _ante);
        _;
    }
    
    modifier isStarted () {
        require(is_started);
        _;
    }
    
    modifier isNotStarted () {
        require(!is_started);
        _;
    }
    
    modifier isNotEnded () {
        require(!is_ended);
        _;
    }
    
    function isNear (string _loc1, string _loc2) internal returns (bool) {
        // XY ORACLE
        return true;    
    }
    
    function setEstimatedStartTime (string _start_time) isNotStarted onlyOwner {
        estimated_start_time = _start_time;
    }
    
    function setRadius (uint _radius) isNotStarted onlyOwner {
        radius = _radius;
    }
    
    function setAnte (uint _ante) isNotStarted onlyOwner {
        ante = _ante;
    }
    
    function joinRace () public payable isNotStarted isNotEnded costs(ante)  {
        address sender = msg.sender;
        uint id = participants.push(Participant(sender, 0));
        addressToParticipant[sender] = id;
        addedParticipant(id);
    }
    
    function checkpoint_count () constant returns (uint) {
        return checkpoints.length;
    }
    
    function participant_count () constant returns (uint) {
        return participants.length;
    }
    
    function passCheckpoint (string _loc) isStarted isNotEnded {
        uint id = addressToParticipant[msg.sender];
        Participant participant = participants[id - 1];
        uint next = participant.cleared;
        string checkpoint = checkpoints[next];
        participant.cleared++;
        require(isNear(checkpoint, _loc));
        checkpointCleared(next, id);
        if (participant.cleared == checkpoints.length) {
            is_ended = true;
            winner = msg.sender;
            raceEnded();
        }
    }
}