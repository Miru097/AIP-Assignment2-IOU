import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    Container,
    TabContent,
    TabPane,
    Row,
    Col,
    Card,
    CardTitle,
    Button,
    CardText
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OweModal from './OweModal';
import OwesList from './OwesList';
import classnames from 'classnames';

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
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} style={{ marginTop: '2rem' }}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="6">
                                    <Card body>
                                        <CardTitle><h4>Title</h4></CardTitle>
                                        <CardText>This is request description{this.props.isAuthenticated}..</CardText>
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
            //</Provider >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})



export default connect(mapStateToProps, null)(TabBar);