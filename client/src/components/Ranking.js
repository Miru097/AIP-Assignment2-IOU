import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers } from '../actions/userActions';
import { getRequests } from '../actions/requestActions';
import { Table, Statistic, Row, Col, Divider } from 'antd';

class PartyDetection extends Component {
    static propTypes = {
        getUsers: PropTypes.func.isRequired,
        getRequests: PropTypes.func.isRequired,
    }
    render() {
        var { requests } = this.props.request;
        var { users } = this.props.users
        var favorStatistic = []
        var userStatistic = []
        var favorNum = 0
        var value1 = []
        var value2 = []
        var favorData = new Array()
        var value3 = []
        var value4 = []
        var userData = new Array()
        if (requests.length !== 0) {
            if (users.length !== 0) {
                for (let i = 0; i < requests.length; i++) {
                    for (let j = 0; j < requests[i].favor.length; j++) {
                        favorStatistic.push(requests[i].favor[j])
                        userStatistic.push(requests[i].debtor[j])
                    }
                }
                //do favor stat
                //https://www.cnblogs.com/mengfangui/p/8033722.html
                var newFavorArr = [];
                for (var i = 0; i < favorStatistic.length; i++) {
                    if (newFavorArr.indexOf(favorStatistic[i]) == -1) {
                        newFavorArr.push(favorStatistic[i])
                    }
                }
                var newFavorArr2 = new Array(newFavorArr.length);
                var favorStatisticArray = []
                for (var t = 0; t < newFavorArr2.length; t++) {
                    newFavorArr2[t] = 0;
                }
                for (var p = 0; p < newFavorArr.length; p++) {
                    for (var j = 0; j < favorStatistic.length; j++) {
                        if (newFavorArr[p] == favorStatistic[j]) {
                            newFavorArr2[p]++;
                        }
                    }
                    favorStatisticArray[newFavorArr[p]] = newFavorArr2[p]
                    favorNum += newFavorArr2[p]
                }
                favorStatisticArray.sort(function (a, b) {
                    return b[1] - a[1]
                })
                //https://blog.csdn.net/qq_42720683/article/details/82216942
                for (var key in favorStatisticArray) {
                    value1.push(key)
                }
                for (var value in favorStatisticArray) {
                    value2.push(favorStatisticArray[value])
                }
                for (var i = 0; i < value1.length; i++) {
                    favorData[i] =
                    {
                        "key": i,
                        "favor": value1[i],
                        "number": value2[i]
                    }
                }
                //do user stat
                var newUserArr = [];
                for (var i = 0; i < userStatistic.length; i++) {
                    if (newUserArr.indexOf(userStatistic[i]) == -1) {
                        newUserArr.push(userStatistic[i])
                    }
                }
                var newUserArr2 = new Array(newUserArr.length);
                var userStatisticArray = []
                for (var t = 0; t < newUserArr2.length; t++) {
                    newUserArr2[t] = 0;
                }
                for (var p = 0; p < newUserArr.length; p++) {
                    for (var j = 0; j < userStatistic.length; j++) {
                        if (newUserArr[p] == userStatistic[j]) {
                            newUserArr2[p]++;
                        }
                    }
                    users.map(({ _id, name }) => {
                        if (_id === newUserArr[p]) {
                            newUserArr[p] = name
                        }
                    })
                    userStatisticArray[newUserArr[p]] = newUserArr2[p]
                }
                userStatisticArray.sort(function (a, b) {
                    return b[1] - a[1]
                })
                for (var key in userStatisticArray) {
                    value3.push(key)
                }
                for (var value in userStatisticArray) {
                    value4.push(userStatisticArray[value])
                }
                for (var i = 0; i < value3.length; i++) {
                    userData[i] =
                    {
                        "key": i,
                        "user": value3[i],
                        "number": value4[i]
                    }
                }
            }
        }
        const favorColumns = [
            {
                title: 'Favor',
                dataIndex: 'favor',
            },
            {
                title: 'Number',
                dataIndex: 'number',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.number - b.number,
            },
        ];
        const userColumns = [
            {
                title: 'User',
                dataIndex: 'user',
            },
            {
                title: 'Number of favors provided in requests',
                dataIndex: 'number',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.number - b.number,
            },
        ];

        return (
            <div className="container">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Total Number of Users" value={this.props.users.users.length} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="All Favor in Requests" value={favorNum} />
                    </Col>
                </Row>
                <Divider orientation="left">The favor people most want to give...</Divider>
                <Table columns={favorColumns} dataSource={favorData} tableLayout="fixed" />
                <Divider orientation="left">The most generous person...</Divider>
                <Table columns={userColumns} dataSource={userData} tableLayout="fixed" />
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
    request: state.request,
});

export default connect(
    mapStateToProps,
    { getRequests, getUsers }
)(PartyDetection);