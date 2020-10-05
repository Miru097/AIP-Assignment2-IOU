import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {
    Card, Col, Row, Image, Button, Pagination, Popover, Dropdown,
    Modal, Form, Select, message, Typography, Space, Menu,
} from 'antd';
import { getRequests, acceptRequest, updateRequest } from '../actions/requestActions';
import { getUsers } from '../actions/userActions';
import { clearErrors } from '../actions/errorActions';
import { DownOutlined } from '@ant-design/icons';



class RequestsList extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        clearErrors: PropTypes.func.isRequired,
        acceptRequest: PropTypes.func.isRequired
    };

    state = {
        minValue: 0,
        maxValue: 12,
        numEachPage: 12,
        modalAcceptVisible: false,
        modalUpdateVisible: false,
        updateDisabled: true,
        searchKey: null
    }
    componentDidMount() {
        this.props.getRequests();
    }
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
    pageHandleChange = (e) => {
        this.setState({
            minValue: (e - 1) * this.state.numEachPage,
            maxValue: e * this.state.numEachPage
        });
    }
    showUpdateModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.setState({
            modalUpdateVisible: true,
            updateId: _id,
            updateFavor: null,
            updateDebtor: null,
            nowFavor: favor,
            nowDebtor: debtor,
        });
    }
    handleUpdateCancel = e => {
        this.setState({
            modalUpdateVisible: false,
            favor: this.state.nowFavor,
            debtor: this.state.nowDebtor
        });
    };
    updateFavor = (e) => {
        this.setState({
            updateFavor: e,
            updateDebtor: this.props.user._id
        });
    }
    handleUpdateOk = () => {
        if (this.state.updateFavor === null || this.state.updateDebtor === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.setState({
                favor: [...this.state.nowFavor, this.state.updateFavor],
                debtor: [...this.state.nowDebtor, this.state.updateDebtor],
                modalUpdateVisible: false,
            })
            setTimeout(() => {
                const { favor, debtor } = this.state;
                const updateRequest = { favor, debtor };
                this.props.updateRequest(this.state.updateId, updateRequest)
            }, 100)
            setTimeout(() => {
                window.location.reload()
            }, 300);
        }
    }

    showAcceptModal = (_id, debtor) => {
        this.props.clearErrors();
        this.setState({
            modalAcceptVisible: true,
            creditor: null,
            acceptId: _id,
            acceptDebtor: debtor
        });

    }
    handleAcceptCancel = e => {
        this.setState({
            modalAcceptVisible: false,
        });
    };
    handleAcceptOk = e => {
        for (let index = 0; index < this.state.acceptDebtor.length; index++) {
            if (this.state.acceptDebtor[index] === this.props.user._id) {
                message.error({
                    content: 'You cannot accept your request!'
                });
                return
            } else {
                this.setState({
                    modalAcceptVisible: false,
                    creditor: this.props.user._id
                });
                setTimeout(() => {
                    const { creditor } = this.state;
                    const acceptRequest = { creditor };
                    this.props.acceptRequest(this.state.acceptId, acceptRequest)
                }, 100)
                setTimeout(() => {
                    {
                        window.location.reload()
                    }
                }, 300)
            }
        }
    }
    onClick = ({ key }) => {
        if (key === "All") {
            this.setState({ searchKey: null })
        } else {
            this.setState({ searchKey: key })
        }
    };

    render() {
        const { Text, Paragraph } = Typography;
        const { Option } = Select;
        const { Meta } = Card;
        var { requests } = this.props.request;
        var { users } = this.props.users
        requests = requests.filter(requests => requests.creditor === null)
        if (requests.length !== 0) {
            if (users.length !== 0) {
                for (let i = 0; i < requests.length; i++) {
                    var value1 = []
                    var value2 = []
                    for (let j = 0; j < requests[i].favor.length; j++) {
                        users.map(({ _id, name }) => {
                            if (_id === requests[i].debtor[j]) {
                                var key1 = "debtorName"
                                value1.push(name)
                                requests[i][key1] = value1
                                var key2 = "content"
                                value2.push(this.firstUpperCase(name) + " will give you a " + requests[i].favor[j])
                                requests[i][key2] = value2
                            }
                        });
                    }
                }
            }
        }
        if (this.state.searchKey !== null) { requests = requests.filter(requests => requests.favor.includes(this.state.searchKey)) }
        const menu = (
            <Menu onClick={this.onClick}>
                <Menu.Item key="All">All</Menu.Item>
                <Menu.Item key="Coffee">Coffee</Menu.Item>
                <Menu.Item key="Chocolate">Chocolate</Menu.Item>
                <Menu.Item key="Mint">Mint</Menu.Item>
                <Menu.Item key="Pizza">Pizza</Menu.Item>
                <Menu.Item key="Cupcake">Cupcake</Menu.Item>
            </Menu >
        );

        return (
            <div className="container">
                <Space direction="vertical">
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link"
                            onClick={e => e.preventDefault()}
                        >
                            Search request by favor <DownOutlined />
                        </a>
                    </Dropdown>
                    <br />
                </Space>
                <Row gutter={[16, 16]}>
                    {
                        requests &&
                        requests.length > 0 &&
                        requests.slice(this.state.minValue, this.state.maxValue)
                            .map(({ description, favor, _id, proof, debtor, debtorName, content }) => (
                                <Col
                                    xs={{ span: 16, offset: 1 }}
                                    sm={{ span: 12, offset: 1 }}
                                    lg={{ span: 8, offset: 1 }}
                                    xl={{ span: 6, offset: 1 }}
                                    xxl={{ span: 6, offset: 1 }}
                                    key={_id}
                                >
                                    <Card
                                        hoverable
                                        bordered
                                        key={_id}
                                        style={{ width: 300 }}
                                        cover={
                                            {
                                                ...proof === null ? <Image
                                                    alt="Proof"
                                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                                /> : <Image
                                                        //placeholder
                                                        width={300}
                                                        alt="Proof"
                                                        src={proof}
                                                    />
                                            }
                                        }
                                        actions={[
                                            <Popover content="There are up to five favors for one request." placement="bottom" trigger="hover">
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    key="update"
                                                    disabled={this.props.isAuthenticated && favor.length < 5 ? false : true}
                                                    onClick={this.showUpdateModal.bind(this, _id, favor, debtor)}
                                                >
                                                    Update
                                                </Button>
                                            </Popover>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="accept"
                                                disabled={(this.props.isAuthenticated) ? false : true}
                                                onClick={this.showAcceptModal.bind(this, _id, debtor)}
                                            >
                                                Accept
                                            </Button>,
                                        ]}
                                    >
                                        <Meta
                                            title={this.firstUpperCase(description)}
                                        //description={"This is the description" + favor}
                                        />
                                        {/* {debtorName !== undefined ?
                                            (<Space direction="vertical">
                                                {favor[0] === undefined ? null : <Text type="default">{this.firstUpperCase(debtorName[0])} will give you a {favor[0]}.</Text>}
                                                {favor[1] !== undefined ? (<Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'And more...' }}>
                                                    {favor[1] === undefined ? null : <Text type="default">{this.firstUpperCase(debtorName[1])} will give you a {favor[1]}.<br /></Text>}
                                                    {favor[2] === undefined ? null : <Text type="default">{this.firstUpperCase(debtorName[2])} will give you a {favor[2]}.<br /></Text>}
                                                    {favor[3] === undefined ? null : <Text type="default">{this.firstUpperCase(debtorName[3])} will give you a {favor[3]}.<br /></Text>}
                                                    {favor[4] === undefined ? null : <Text type="default">{this.firstUpperCase(debtorName[4])} will give you a {favor[4]}.<br /></Text>}
                                                </Paragraph>) : null}
                                            </Space>) : null} */}
                                        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'And more...' }}>
                                            <Space direction="vertical">
                                                {content}
                                            </Space>
                                        </Paragraph>
                                    </Card>
                                </Col>
                            ))}
                </Row>

                <Pagination
                    defaultCurrent={1}
                    defaultPageSize={this.state.numEachPage}
                    onChange={this.pageHandleChange}
                    total={requests.length}
                    showTotal={total => `Total ${total} requests`}
                />

                <Modal
                    title="Update this request"
                    centered
                    visible={this.state.modalUpdateVisible}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back"
                            onClick={this.handleUpdateCancel}
                        >
                            Return</Button>,
                        <Button key="updateFavor" type="default"
                            onClick={this.handleUpdateOk}
                        >
                            Update</Button>,
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="updateRequest"
                    >
                        <Form.Item label="What favor do you want to add:">
                            <Select
                                placeholder="Select"
                                onChange={this.updateFavor}
                                name="favorSelect"
                            //allowClear
                            >
                                <Option value="Coffee">Coffee</Option>
                                <Option value="Chocolate">Chocolate</Option>
                                <Option value="Mint">Mint</Option>
                                <Option value="Pizza">Pizza</Option>
                                <Option value="Cupcake">Cupcake</Option>
                            </Select>
                            <Text type="secondary">There are up to five favors for one request.</Text>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Accept this request"
                    centered
                    visible={this.state.modalAcceptVisible}
                    onOk={this.handleAcceptOk}
                    onCancel={this.handleAcceptCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back" onClick={this.handleAcceptCancel}>
                            Return</Button>,
                        <Button key="acceptAgain" type="default" onClick={this.handleAcceptOk}>
                            Accept</Button>,
                    ]}
                >
                    <p>Are you sure to accept this request?</p>
                </Modal>
            </div >
        )
    }
}
const mapStateToProps = (state) => ({
    request: state.request,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
    requestContent: state.request.requests
});
export default connect(mapStateToProps, { getRequests, getUsers, clearErrors, acceptRequest, updateRequest })(RequestsList);