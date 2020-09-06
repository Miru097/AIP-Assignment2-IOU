import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import OwesList from './components/OwesList';
import OweModal from './components/OweModal';

import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';



class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  state = {
    activeTab: '1'
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  /*
  static propTypes = {
    isAuthenticated: PropTypes.bool
  }
  */


  render() {
    //const { auth } = this.props.auth;
    return (
      <Provider store={store}>
        <div className='App'>
          <AppNavbar />
          <Container>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Request
                  </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  OWE
                  </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                  Ranking
                  </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab} style={{ marginTop: '2rem' }}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="6">
                    <Card body>
                      <CardTitle><h4>Title</h4></CardTitle>
                      <CardText>This is request description</CardText>
                      {this.props.isAuthenticated}
                      <Button className="mb-2 ml-3" color="secondary">Accept</Button>
                      <Button className="mb-2 ml-3" color="secondary">Update</Button>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <h4 className="mb-3 ml-4">Your Owe List</h4>
                    <OweModal />
                    <OwesList />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
              </TabPane>
            </TabContent>
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;