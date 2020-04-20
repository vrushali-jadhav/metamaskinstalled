import Web3 from 'web3';

if (typeof web3 !== 'undefined') 
{
    const web3 = new Web3(window.web3.currentProvider);
} 
else 
{
    const web3 = "not_installed";
}

export default web3;
