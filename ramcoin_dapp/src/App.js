import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import initBlockchain from "./utils/initBlockchain";
import TopBar from "./components/TopBar";
import {
  Container,
  Grid,
  Form,
  Message,
  Button,
  Icon,
  Progress
} from "semantic-ui-react";

//import TopBar from "./components/TopBar";

//
//  This is the main application page; routing is handled to render other pages in the application

class App extends Component {
  state = {
    web3: null,
    RC: null,
    RS: null,
    RSDeployedAddress: "",
    userAddress: "",
    currentRate: 0,
    totalSupply: 0,
    userSupply: 0,
    userContributions: 0,
    weiRaised: 0,
    closeTime: "",
    hasClosed: false
  };

  // define a state variable for important connectivity data to the blockchain
  // this will then be put into the REDUX store for retrieval by other pages

  // **************************************************************************
  //
  // React will call this routine only once when App page loads; do initialization here
  //
  // **************************************************************************

  componentDidMount = async () => {
    try {
      // Connect to blockchain
      const web3 = await getWeb3(); // from utils directory;  connect to metamask
      const data = await initBlockchain(web3); // get contract instance and user address
      this.setState({
        web3: web3,
        RC: data.RC,
        RS: data.RS,
        RSDeployedAddress: data.RSDeployedAddress,
        userAddress: data.userAddress
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
    console.log("state", this.state);

    // one-time operation to transfer ownership of RAMCOIN to RAMSALE from the original creator
    // This only works for original creator (and owner) of the RAMCOIN contract

    let RCOwner = await this.state.RC.methods.owner().call();
    if (RCOwner != this.state.RSDeployedAddress) {
      console.log("transferring ownership to RS contract");
      await this.state.RC.methods
        .transferOwnership(this.state.RSDeployedAddress)
        .send({ from: this.state.userAddress });
    } else {
      console.log("RS already owns RC contract");
    }

    //await RC.transferOwnership(RS.address);

    // get opening and closing times

    let blockTime = await this.state.RS.methods.getNow().call();
    console.log("block time", blockTime);
    let closingTime = await this.state.RS.methods.closingTime().call();
    console.log("closing time:", closingTime);
    let openingTime = await this.state.RS.methods.openingTime().call();
    console.log("opening time:", openingTime);
    let closeTime = new Date(closingTime * 1000).toString();
    console.log("closing time", closeTime);
    let hasClosed = await this.state.RS.methods.hasClosed().call();

    // get coin counts, contributions from all purchasers, and current rate per ether
    let totalSupply = await this.state.RC.methods.totalSupply().call();
    console.log("total supply", totalSupply);
    let userSupply = await this.state.RC.methods
      .balanceOf(this.state.userAddress)
      .call();
    let userContributions = await this.state.RS.methods
      .contributions(this.state.userAddress)
      .call();
    console.log("spent", userContributions);
    console.log("user supply", userSupply);
    let currentRate = await this.state.RS.methods.getCurrentRate().call();
    console.log("Current rate", currentRate);
    let weiRaised = await this.state.RS.methods.weiRaised().call();
    this.setState({
      totalSupply,
      userSupply,
      weiRaised,
      currentRate,
      userContributions,
      closeTime,
      hasClosed
    });
    console.log("more state", this.state);
  };

  // **************************************************************************
  //
  // handle the submit button in the form
  //
  // **************************************************************************

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      console.log(
        "sending",
        this.state.web3.utils.toWei(this.state.value.toString(), "ether")
      );
      await this.state.RS.methods.buyTokens(this.state.userAddress).send({
        value: +this.state.web3.utils.toWei(
          this.state.value.toString(),
          "ether"
        ),
        from: this.state.userAddress,
        gas: 10000000
      });
      this.setState({
        loading: false,
        message: "Purchase Completed"
      });
      document.location.reload(true); // show user new balance
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "User rejected transaction"
      });
    }
  };

  // **************************************************************************
  //
  // main render routine for App component;
  //
  // **************************************************************************

  render() {
    return (
      <Container>
        <TopBar state={this.state} />
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column>
            <div>
              <h2> Your Account Info</h2>
              <p>
                RAMCOIN price is {this.state.currentRate} tokens per ether.
                <br />
                You currently have {this.state.userSupply / 1e18}{" "}
                &nbsp;RAMCOINs and invested {this.state.userContributions / 1e18} ether.
              </p>
              <hr />
              Account: {this.state.userAddress}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div>
              <h2>ICO Details</h2>
              <p>The crowd sale ends at {this.state.closeTime}</p>
              <p>
                The price per token will steadily climb until the sale closes.
                The original rate is 500 RamCoins per ether. The final rate is
                250 RamCoins per ether.
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <br /> <hr /> <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>
              Enter ether value to invest (minimum first purcase is 1.0 ether)
            </label>
            <input
              placeholder="Ether Amount"
              onChange={event =>
                this.setState({
                  value: event.target.value
                })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            disabled={this.state.hasClosed}
            color={this.state.hasClosed ? "red" : "green"}
            type="submit"
            loading={this.state.loading}
          >
            <Icon name="check" />
            {this.state.hasClosed ? "Sale Closed" : "Buy RamCoins"}
          </Button>
          <hr />
          <h2>{this.state.message}</h2>
        </Form>
        <Progress
          progress="value"
          total={500}
          value={this.state.weiRaised / 1e18}
        >
          Progress towards 100 ether goal{" "}
        </Progress>
      </Container>
    );
  }
}

export default App;
