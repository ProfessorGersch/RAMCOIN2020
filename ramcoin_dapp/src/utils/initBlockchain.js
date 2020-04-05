import RamCoin from "../contract_ABI/RamCoin.json";
import RamSale from "../contract_ABI/RamSale.json";

//
//  set up the blockchain shadow contract, user address, and user zombie count.  Put into redux store.
//

async function initBlockchain(web3) {
  // Use web3 to get the user's accounts.
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  // Get ramcoin contract instance
  const networkId = await web3.eth.net.getId();
  const RCdeployedNetwork = RamCoin.networks[networkId];
  const RC = new web3.eth.Contract(
    RamCoin.abi,
    RCdeployedNetwork && RCdeployedNetwork.address
  );
  const RSdeployedNetwork = RamSale.networks[networkId];
  const RS = new web3.eth.Contract(
    RamSale.abi,
    RSdeployedNetwork && RSdeployedNetwork.address
  );
  // put state data into the REDUX store for easy access from other pages and components

  let data = {
    RS,
    RC,
    RSDeployedAddress: RSdeployedNetwork.address,
    userAddress // shorthand
  };

  return data;
}

export default initBlockchain;
