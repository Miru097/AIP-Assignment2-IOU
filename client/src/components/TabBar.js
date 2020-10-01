import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    Container,
    TabContent,
    TabPane,
    Row,
    Col
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OweModal from './OweModal';
import OwesList from './OwesList';
import classnames from 'classnames';
import RequestModal from './RequestModal';
import RequestsList from './RequestsList';
import TasksLists from './TasksLists';


class TabBar extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    state = {
        activeTab: '1'
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        const authOwelink = (
            <NavItem >
                <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                >
                    OWE
                    </NavLink>
            </NavItem>
        );
        const authRequestlink = (
            <NavItem >
                <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                >
                    Task
                    </NavLink>
            </NavItem>
        );
        return (
            //<Provider store={store}>
            <div>
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
                        {isAuthenticated ? authOwelink : null}
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                Ranking
                            </NavLink>
                        </NavItem>
                        {isAuthenticated ? authRequestlink : null}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} style={{ marginTop: '2rem' }}>
                        <TabPane tabId="1">
                            <Row>
                                <RequestModal />
                                <RequestsList />
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    <OweModal />
                                    <OwesList />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                        </TabPane>
                        <TabPane tabId="4">
                            <TasksLists />
                        </TabPane>
                    </TabContent>
                </Container>
            </div>
            //</Provider >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})



export default connect(mapStateToProps, null)(TabBar);