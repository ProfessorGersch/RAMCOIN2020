import React, { Component } from "react";
import { Menu, Header, Container } from "semantic-ui-react";

// This renders the topbar on the webpage as well as the lines listing address and zombie count.

class TopBar extends Component {
  render() {
    return (
      <div>
        <Menu style={{ marginTop: "10px" }}>
          <Menu.Item position="right">
            <img src="images/CSU_RAM.jpg" width="100px" alt="CSU Ram" />
          </Menu.Item>

          <Menu.Item position="left">
            <Header size="large">CSU RamCoin 2020 </Header>
          </Menu.Item>
        </Menu>
        <div className="center">
          <Container style={{ backgroundColor: "LightGrey" }}>
            <div style={{ textAlign: "center" }}>
              <h1>Awesome Opportunity!</h1>
              <h3>
                This is your chance to invest in RAMCOIN 2020!
                <br />
                This useless blockchain token is highly coveted! It can be used
                for almost nothing! You know you want some!
                <br />
                <br />
                Our class goal is to raise 100 Rinkeby ETHER through your
                student purchases. <br />
                <p>
                  Each metamask account may purchase an initial stake of 1 ether. <br />
                  You may then make incremental purchases of any amount
                  until you reach a maximum investment of 3 ether.
                </p>
                Act quickly! This is a limited time offer!
                <br />
              </h3>
            </div>
          </Container>
        </div>

        <hr />
      </div>
    );
  }
}

export default TopBar;
