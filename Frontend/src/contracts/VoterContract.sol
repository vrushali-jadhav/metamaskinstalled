pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;


contract VoterContract   {
    struct Voter {
        address voterAddress;
        uint user_id;
        string hash;
        bool hasvoted;
    }
    
    mapping(uint  => Voter) public voters;

    // Store Voters Count
    uint public count;
    
    function register(uint id,string  memory _hash) public {
        Voter memory voter = Voter(msg.sender,id,_hash,false);
        voters[count] = voter;
        count++;
    }
    
    function userVoted(uint _user_id) public {

        Voter storage voter = voters[_user_id];
        voter.hasvoted = true;
    }
    
    function getVoterInformation(uint _user_id) public view returns (Voter memory) {
        return voters[_user_id];
    }
    
    function getVoterCount() public view returns (uint){
        return count;
    }
    
    function  getVoterList () public view returns (Voter[] memory){
        Voter[] memory list = new Voter[](count);
        for(uint i =0 ; i < count; i++){
            list[i] = voters[i];
        }
        return list;
    }
}