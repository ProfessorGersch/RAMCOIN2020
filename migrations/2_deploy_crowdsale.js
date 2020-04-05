const w3 = require("web3-utils");


const RamCoin = artifacts.require("./RamCoin.sol");
const RamSale = artifacts.require("./RamSale.sol");

//const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

const duration = {
    seconds: function (val) { return val },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

module.exports = async function(deployer, network, accounts) {
    const _name = "CSU 2020 RamCoin";
    const _symbol = "RAMCOIN2020";
    const _decimals = 18;

    await deployer.deploy(RamCoin, _name, _symbol, _decimals);
    const deployedToken = await RamCoin.deployed();

    //const latestTime = Math.ceil( (new Date()).getTime() / 1000 );  // freakin' milliseconds screws things up
    const rightNow = (new Date()).getTime();
    const latestTime = Math.round( rightNow / 1000 );
    console.log("now", latestTime);

    const _rate           = 500;
    const _initialRate    = 500;
    const _finalRate      = 250;
    const _wallet         = accounts[0]; // TODO: Replace me
    const _token          = deployedToken.address;
    const _openingTime    = latestTime + duration.minutes(2);
    console.log("open", _openingTime);
    const _closingTime    = _openingTime + duration.weeks(1);
    console.log("closing", _closingTime);
    const _cap            = w3.toWei("400");  // ether(400);
    const _goal           = w3.toWei("100");  // ether(100);
    console.log("cap and goal", _cap, _goal);
    //const _foundersFund   = accounts[0]; // TODO: Replace me
    //const _foundationFund = accounts[0]; // TODO: Replace me
    //const _partnersFund   = accounts[0]; // TODO: Replace me
    const _releaseTime    = _closingTime + duration.minutes(1);

    await deployer.deploy(RamSale,
        _rate,
        _wallet,
        _token,
        _initialRate,
        _finalRate,
        _cap,
        _openingTime,
        _closingTime

        //_goal,
        //_foundersFund,
        //_foundationFund,
        //_partnersFund,
        //_releaseTime
    );

    return true;
};



