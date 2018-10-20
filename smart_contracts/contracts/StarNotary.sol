pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string star_story;
        string ra;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => uint256) internal coordinateToTokenId;
    uint256 public counter;

    function createStar(string _name, string _star_story, string _ra, string _dec, string _mag) public {
        bytes32 coordinateHash = _hash(_ra, _dec, _mag);
        require(coordinateToTokenId[coordinateHash] == 0, "Sorry, star with this coordinates already exists");

        uint256 tokenId = ++counter;
        Star memory newStar = Star(_name, _star_story, _concat("ra_", _ra), _concat("dec_", _dec), _concat("mag_", _mag));
        tokenIdToStarInfo[tokenId] = newStar;
        coordinateToTokenId[coordinateHash] = tokenId;

        mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId));

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns (bool){
        bytes32 coordinateHash = _hash(_ra, _dec, _mag);
        return coordinateToTokenId[coordinateHash] != 0;
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function _concat(string a, string b) private pure returns (string) {
        return string(abi.encodePacked(a, b));
    }

    function _hash(string _ra, string _dec, string _mag) private pure returns (bytes32){
        return keccak256(abi.encodePacked(_ra, _dec, _mag));
    }
}