import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {
    Card, Col, Row, Image, Button, Pagination, Popover, Dropdown,
    Modal, Form, Select, message, Typography, Space, Menu,
} from 'antd';
import { getRequests, acceptRequest, updateRequest, deleteRequest, checkRequest, clearCheckRequest } from '../actions/requestActions';
import { getUsers } from '../actions/userActions';
import { clearErrors } from '../actions/errorActions';
import { DownOutlined } from '@ant-design/icons';

class RequestsList extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        clearErrors: PropTypes.func.isRequired,
        acceptRequest: PropTypes.func.isRequired,
        updateRequest: PropTypes.func.isRequired,
        deleteRequest: PropTypes.func.isRequired,
        checkRequest: PropTypes.func.isRequired
    };

    state = {
        minValue: 0,
        maxValue: 12,
        numEachPage: 12,
        modalAcceptVisible: false,
        modalUpdateVisible: false,
        modalDeleteVisible: false,
        updateDisabled: true,
        searchKey: null,
        deleteId: null,
        msg: null
    }
    componentDidMount() {
        this.props.getRequests();
        this.props.getUsers();
    }
    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CHECK_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }

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
        this.props.clearCheckRequest();
        this.setState({
            modalUpdateVisible: true,
            updateId: _id,
            updateFavor: null,
            updateDebtor: null,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
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
            this.props.checkRequest(this.state.updateId)
            this.setState({
                modalUpdateVisible: false,
            });
            setTimeout(() => {
                if (this.state.msg !== null || this.props.checkedRequest === null) {
                    message.error({
                        content: 'This request or authentication has content changed! This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                } else {
                    if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                        && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                        && this.props.checkedRequest.creditor === null) {
                        this.setState({
                            favor: [...this.state.nowFavor, this.state.updateFavor],
                            debtor: [...this.state.nowDebtor, this.state.updateDebtor],
                        })
                        setTimeout(() => {
                            const { favor, debtor } = this.state;
                            const updateRequest = { favor, debtor };
                            this.props.updateRequest(this.state.updateId, updateRequest)
                        }, 100)
                        setTimeout(() => {
                            window.location.reload()
                        }, 300);
                    } else {
                        message.error({
                            content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                        }, 3);
                        setTimeout(() => {
                            {
                                window.location.reload()
                            }
                        }, 3000)
                    }
                }
            }, 500)
        }
    }
    showDeleteModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.props.clearCheckRequest();
        this.setState({
            modalDeleteVisible: true,
            deleteId: _id,
            deleteFavor: null,
            deleteDebtor: null,
            deleteKey: null,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
        });
    }
    handleDeleteCancel = e => {
        this.setState({
            modalDeleteVisible: false,
            deleteId: null,
            favor: this.state.nowFavor,
            debtor: this.state.nowDebtor
        });
    };
    deleteFavor = (value, key) => {
        this.setState({
            deleteFavor: value,
            deleteDebtor: this.props.user._id,
            deleteKey: key.key
        })

    }
    handleDeleteOk = () => {
        if (this.state.deleteFavor === null || this.state.deleteDebtor === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.props.checkRequest(this.state.deleteId)
            this.setState({
                modalUpdateVisible: false,
            });
            setTimeout(() => {
                if (this.state.msg !== null || this.props.checkedRequest === null) {
                    message.error({
                        content: 'This request or authentication has content changed! This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                } else {
                    if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                        && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                        && this.props.checkedRequest.creditor === null) {
                        this.state.nowFavor.splice(this.state.deleteKey, 1)
                        this.state.nowDebtor.splice(this.state.deleteKey, 1)
                        this.setState({
                            favor: this.state.nowFavor,
                            debtor: this.state.nowDebtor,
                        })
                        setTimeout(() => {
                            if (this.state.favor.length > 0) {
                                const { favor, debtor } = this.state;
                                const updateRequest = { favor, debtor };
                                this.props.updateRequest(this.state.deleteId, updateRequest)
                            } else {
                                this.props.deleteRequest(this.state.deleteId);
                            }
                        }, 100)
                        setTimeout(() => {
                            window.location.reload()
                        }, 300);
                    } else {
                        message.error({
                            content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                        }, 3);
                        setTimeout(() => {
                            {
                                window.location.reload()
                            }
                        }, 3000)
                    }
                }
            }, 500)
        }
    }
    showAcceptModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.props.clearCheckRequest();
        this.setState({
            modalAcceptVisible: true,
            creditor: null,
            acceptId: _id,
            acceptDebtor: debtor,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
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
            }
        }
        this.setState({
            modalAcceptVisible: false,
            creditor: this.props.user._id
        });
        this.props.checkRequest(this.state.acceptId)
        this.setState({
            modalUpdateVisible: false,
        });
        setTimeout(() => {
            if (this.state.msg !== null || this.props.checkedRequest === null) {
                message.error({
                    content: 'This request or authentication  has content changed! This page will refresh in 3 seconds!'
                }, 3);
                setTimeout(() => {
                    {
                        window.location.reload()
                    }
                }, 3000)
            } else {
                if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                    && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                    && this.props.checkedRequest.creditor === null) {
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
                } else {
                    message.error({
                        content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                }
            }
        }, 500)
    }
    onClick = ({ key }) => {
        if (key === "All") {
            this.setState({ searchKey: null })
        } else {
            this.setState({ searchKey: key })
        }
    }
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
                        })
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
                                                    placeholder
                                                    alt="Proof"
                                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAAB0CAIAAABYEHoOAAABS2lDQ1BERUxMIFU
                                                    yNzE3RAAAKJGVjr9LAnEchp9vGtoPyOESajqoJdDQa5C2TCMCB5GiU2g4z1+h2ZfzoNoaGvoLammLCqqhKdeG9oagpLmhXXA
                                                    puQYrlYboXT4PDy98XhhQDCkrbmCralup5UVVT2dUzyteFMbx4TLMmowmkwmA79uf1hMC4DFoSFkpP8Qugwvhq7ON6+hxWT34
                                                    3e/LcC5fM4EPoGBKywaRA6Z2bGmDOAQUS09nQJwASrHDN4CS7fA9oFirqRiIBuAzS0YOxBsQyPb4Yg9//QUYjS8lEuqaFglH
                                                    4n/M/X/s/K4NENuWe9ZmsWSrUSkreXWlas4GVC2khUBPZ9ROu9lAAMLv7Trph/k4uE67LjsJdRMmhrpu+gLGdLjdl4Zl/Aw
                                                    QLXetMKd1eKQOg0eO01wHzwy0nx3nve447XNwvcBd6xPrkl1A9iU1iwAAAAlwSFlzAAALEwAACxMBAJqcGAAABm1pVFh0WE1
                                                    MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+
                                                    IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5L
                                                    jE2NDM1MiwgMjAyMC8wMS8zMC0xNTo1MDozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9y
                                                    Zy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJod
                                                    HRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtb
                                                    G5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG
                                                    9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2V
                                                    FdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyM
                                                    C0xMC0yMFQxNDowNzozMCsxMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTAtMjBUMTQ6MTc6MDIrMTE6MDAiIHhtcDpNZXRhZGF
                                                    0YURhdGU9IjIwMjAtMTAtMjBUMTQ6MTc6MDIrMTE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlP
                                                    SIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iREVMTCBVMjcxN0QiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzlhNDMxN2UtOTUx
                                                    Zi02MTRjLWIxYWItYmE1OWEzNGRiNTM4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZTYwNWI4OGEtZTh
                                                    kZi01MjRjLTg3YmEtZWJjYmFiZjMxYzE2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGFiMzVlZGItYjU3MC1iMz
                                                    RiLThjNjUtMWMzMDE2ZDJhMDAwIj4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5Z
                                                    XJOYW1lPSJJT1UiIHBob3Rvc2hvcDpMYXllclRleHQ9IklPVSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDx4
                                                    bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5
                                                    paWQ6ZGFiMzVlZGItYjU3MC1iMzRiLThjNjUtMWMzMDE2ZDJhMDAwIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTIwVDE0OjA3OjMwKzExOjA
                                                    wIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb24
                                                    9InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc5YTQzMTdlLTk1MWYtNjE0Yy1iMWFiLWJhNTlhMzRkYjUzOCIgc3RFdnQ
                                                    6d2hlbj0iMjAyMC0xMC0yMFQxNDoxNzowMisxMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdp
                                                    bmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZG
                                                    Y6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpFjVI8AAAdiSURBVHic7Z3Pa9NuHMfz/fI9Tod4qYpChKAIIlRG0IMV
                                                    KSJZ2cWDNHEwPLgNJuxUhB11UHpyWOjiwYvNyg4ylNqDiBAPSpFFRPASsbIxDV7ENX/A91AYY3ueZ23y2dY8e7+Oz5N88kBfTZ5f+eSfdrut
                                                    ABCPf/e7AUAGoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBA
                                                    qARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQL+2+8G7BH1en19ff3du3eO4zAPsG1bUZSRkZGBgYG9b
                                                    ZoM/NM/KUQPHTrELI/TwiAIlpaWCoVC96cYhjE6OprL5aJdcWJigmmq67rpdDpazGKxODs7u6WwVqtFbiQ5Mj/UisWipmk9OaQoSqPRyOf
                                                    z2WzW87xdaph8yKmR7/vZbHb7P7h7ms1mJpOpVCqErZIYCTXyPC+dTjebzfihCoXCxMRE/DjSI5tGnudlMhnCgI7jwKQdkUoj3/fHxsbEx1i
                                                    WZdu27/vtdrvdbtdqtc4YTYDjOMVikayVMiKPRmEYTk5Otlot3gGGYXieNz8/b5pmKpXqFOZyOdM02+22WKbZ2dmFhQXiFkuEPBo9e/ZM0
                                                    B8qlUqLi4uapvEOME3T8zxd13kHFIvFIAjitlJSJNHI8zzBwN627cnJyR2DaJpWrVZ5JrVarbm5uehNlBpJNHry5AmvampqyjTNLuOkUqlqt
                                                    aqqKrO2XC5jMomJDBp5nsdb4tB1fWZmpqdoqVTq8ePHvFqBrwcZGTQS/LTT09MR1sgymYxlWcwqx3F83+81oPQkXqMgCHi3IsMwIq863
                                                    b17l1f15s2baDElJvEavX37llc1OjoaOWw6nebdkLBCsp3Ea/TixQtmuaqqMRfAeae3Wi0817aQbI3CMGw0Gsyq7kdnPK5evcqr+vjxY8zgkpFs
                                                    jZaXl3lVly5dihl8YGDAMAxm1ZcvX2IGl4xka7S2tsarunjxYvz4vBvSq1ev4geXiWRrtLKywizXdZ1kL+zJkyeZ5a1WKwzD+PGlIdka/
                                                    fjxg1k+NDREEv/48eO8ql+/fpFcQg6SrdG3b9+Y5adOnSKJL9Cof/aw9wPJ1uj379/M8sHBQZL4G/tJtvPz50+SS8hBsjXi7S46fPjwHrfkgJN
                                                    sjfYA3mo/2IycGgn6NGA3kFMjwv6vYFcu2AAaAQLk1Gh9fZ0kjmDzNe9V8YNJsjXi7Zv++/cvSXzBqB7dr80kW6OjR48yy3mLJL0i0OjYsWMkl5
                                                    CDZGt0+vRpZvn3799J4q+urjLLVVVF/prNJFuj8+fPM8sbjQbJ0unnz5+Z5ZcvX44fXCaSrdGJEyd4VYKtSF0ShuH79++ZVRcuXIgZXDKSrZFgU
                                                    9HXr19jBl9eXuZNGp07d67XaHHmIJgjhr4aKiZbI8EGxfgb7z98+MAsV1VVoO+RI0eY5XE0+vPnz/ZCaEQJb4Niq9Wq1+uRw4ZhyMv9MDw8LOhf8
                                                    zYXxJnKYj5boREl2WyWVxVHo5cvX/KeaDdu3BCcyNvqFHkOwvd9Zkv6asYh8RppmsZ7rjmOE82kMAx5CY10XRen4eLtUfn06VOEliict1D6bcYh8
                                                    RopwtcaHz16FGHkXy6XebeiO3fuiM89c+YMs7zRaETLa8N8EW94eDhCqN1DBo1yuRxvVaTZbPaaSNR1Xd4puq6PjIyIT9c0jbdFaWlpqaeWdBrDf
                                                    BGPN2G2X8igkaIo09PTvKpyudx9ojTf9+/duye4SjePEt6tolAo9JTXJgiCBw8eMKuo3lmgQhKNcrkc75V7RVHGx8e7Gf97nnfz5k3e48yyrC7f5h
                                                    b0wcfGxro0KQiC27dvM/PHWZYlSBu3L8iTpT8IguvXr4tzPz58+JD3A1QqFXEidt/3BTv8t5DNZgUZBGdmZqampgQ3toWFhfHxcV5tnIT/u4Q8Gim
                                                    K4rrujjcMy7KuXLly7dq1jhP1en11dXXHTP69flmhXq/n8/luWjI0NLRhdufhKxCoc9b8/Hz3LdkbpNJI2el/HA3btiMklrh16xYvTUVkdF2vVqvd3
                                                    xT3DEn6RhuYprljnuueKJVK0ZKTzM3NCfLaRkBV1Uql0ocOKfJppCiKaZpx5q8302UKWyadbKS8qdFeMQzj9evX/daz3kBCjRRFyWQynucJxm470snF
                                                    HjNJUiqVWlxc7DWH6XY6Sb378z7UQba+0RZc163VarzkkEwsy8rn87QfHvF9//nz5xG+qGTbdiK+FNhHGu0qnUHQ06dPmeNwVVXv37+v7P7XHV3XXV
                                                    tbW1lZEShVKpUGBwfPnj3bb6N6AQdFI7CryNk3AnsMNAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBEAjQ
                                                    AA0AgRAI0AANAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBPwP58aEurcQt2wAAAAASUVORK5CYII="
                                                    src="error"
                                                /> : <Image
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
                                                    Add
                                                </Button>
                                            </Popover>,
                                            <Popover content="You can only delete favors you added." placement="bottom" trigger="hover">
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    key="delete"
                                                    disabled={this.props.isAuthenticated && debtor.includes(this.props.user._id) ? false : true}
                                                    onClick={this.showDeleteModal.bind(this, _id, favor, debtor)}
                                                >
                                                    Delete
                                            </Button>
                                            </Popover>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="accept"
                                                disabled={(this.props.isAuthenticated) ? false : true}
                                                onClick={this.showAcceptModal.bind(this, _id, favor, debtor)}
                                            >
                                                Accept
                                            </Button>,
                                        ]}
                                    >
                                        <Meta
                                            title={this.firstUpperCase(description)}
                                        />
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
                            Add</Button>,
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
                    title="Update this request"
                    centered
                    visible={this.state.modalDeleteVisible}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleDeleteCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back"
                            onClick={this.handleDeleteCancel}
                        >
                            Return</Button>,
                        <Button key="deleteFavor" type="default"
                            onClick={this.handleDeleteOk}
                        >
                            Delete</Button>
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="deleteRequest"
                    >

                        <Form.Item label="Which favor do you want to delete:">
                            {requests.filter(requests => requests._id == this.state.deleteId)
                                .map(({ favor, _id, debtor }) => (
                                    <Select
                                        placeholder="Select"
                                        onChange={this.deleteFavor}
                                        name="favorSelect"
                                        key={_id}
                                    //allowClear
                                    >
                                        {debtor[0] === this.props.user._id && favor[0] ? <Option value={favor[0]} key="0">{favor[0]}</Option> : null}
                                        {debtor[1] === this.props.user._id && favor[1] ? <Option value={favor[1]} key="1">{favor[1]}</Option> : null}
                                        {debtor[2] === this.props.user._id && favor[2] ? <Option value={favor[2]} key="2">{favor[2]}</Option> : null}
                                        {debtor[3] === this.props.user._id && favor[3] ? <Option value={favor[3]} key="3">{favor[3]}</Option> : null}
                                        {debtor[4] === this.props.user._id && favor[4] ? <Option value={favor[4]} key="4">{favor[4]}</Option> : null}
                                    </Select>
                                ))}
                            <Text type="secondary">You can only delete the favors you added, if there is no favor in the request, request will be deleted automatically</Text>
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
    error: state.error,
    requestContent: state.request.requests,
    checkedRequest: state.request.checkRequest
});
export default connect(mapStateToProps,
    {
        getRequests, getUsers, clearErrors, acceptRequest,
        updateRequest, deleteRequest, checkRequest, clearCheckRequest
    })(RequestsList);