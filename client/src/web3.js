import Web3 from "web3";

export function createWeb3 (endpoint=process.env.REACT_APP_WEB3_ENDPOINT) {
    const web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(endpoint));
    return web3;
}

export function contractInterface(web3, address, abi) {
    return new web3.eth.Contract(abi, address);
}