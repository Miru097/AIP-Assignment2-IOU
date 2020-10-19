import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getOwes } from '../actions/oweActions';
import PropTypes from 'prop-types';
import { getUsers } from '../actions/userActions';
import { List, Typography, Button } from 'antd';


class PartyDetection extends Component {
    static propTypes = {
        getOwes: PropTypes.func.isRequired,
        owe: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
    }
    state = {
        allPartyArray: [],
        detectionPartyArray: [],
        favorList: [],
        content: []
    }
    partyDetection = () => {
        this.state.allPartyArray = []
        this.state.detectionPartyArray = []
        this.state.content = []
        this.state.favorList = ["Coffee", "Chocolate", "Mint", "Pizza", "Cupcake"]
        let k = 0
        for (let l = 0; l < this.state.favorList.length; l++) {
            if (this.props.owe.owes.length > 0) {
                let j = 0
                for (let i = 0; i < this.props.owe.owes.length; i++) {
                    if (this.props.owe.owes[i].debtor === this.props.user._id &&
                        this.props.owe.owes[i].favor === this.state.favorList[l]) {
                        this.state.allPartyArray[j] = [this.state.favorList[l], this.props.user._id, this.props.owe.owes[i].creditor]
                        j++
                    }
                }
                this.state.allPartyArray = this.unique(this.state.allPartyArray)
                if (this.state.allPartyArray.length > 0) {
                    do {
                        for (let j = 0; j < this.props.owe.owes.length; j++) {
                            if (this.props.owe.owes[j].debtor === this.state.allPartyArray[0][this.state.allPartyArray[0].length - 1] &&
                                this.props.owe.owes[j].favor === this.state.favorList[l]) {
                                if (this.props.owe.owes[j].creditor == this.props.user._id) {
                                    this.state.detectionPartyArray[k] = this.state.allPartyArray[0]
                                    k++
                                } else if (!this.state.allPartyArray[0].includes(this.props.owe.owes[j].creditor))// Cannot exist in other parts of the array
                                {
                                    //Put a new extended array at the end
                                    this.state.allPartyArray.push([...this.state.allPartyArray[0], this.props.owe.owes[j].creditor])
                                }
                            }
                        }
                        //delete this.state.allPartyArray[0]
                        this.state.allPartyArray.shift()
                    }
                    while (this.state.allPartyArray.length > 0)
                }
                this.state.detectionPartyArray = this.unique(this.state.detectionPartyArray)
            }
        }
        if (this.state.detectionPartyArray.length > 0) {
            for (let l = 0; l < this.state.detectionPartyArray.length; l++) {
                this.state.content[l] = "You can host a " + this.state.detectionPartyArray[l][0] + " party with "
                for (let i = 2; i < this.state.detectionPartyArray[l].length; i++) {
                    this.props.users.users.map(({ _id, name }) => {
                        if (_id === this.state.detectionPartyArray[l][i]) {
                            this.state.detectionPartyArray[l][i] = name
                            this.state.content[l] += name + ", "
                        }
                    })
                }
                this.state.content[l] = this.state.content[l].substr(0, this.state.content[l].length - 2)
                this.state.content[l] += "."
            }
            this.setState({
                content: this.state.content
            })
        } else {
            this.state.content[0] = "There is no party to hold, click the button to recheck."
            this.setState({
                content: this.state.content
            })
        }
    }
    unique = (array) => {
        let obj = {}
        return array.filter((item, index) => {
            let newItem = item + JSON.stringify(item)
            return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
        })
    }
    render() {
        const { Text } = Typography
        return (
            <div className="container">
                <List
                    header={
                        this.props.isAuthenticated ? (<Button
                            type="default"
                            key="partydetection"
                            onClick={this.partyDetection}
                        >
                            Party Detection
                        </Button>) : null
                    }
                    bordered
                    dataSource={this.state.content}
                    renderItem={item => (
                        <List.Item>
                            <Typography.Text>{item}</Typography.Text>
                        </List.Item>
                    )}
                />
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
});

export default connect(
    mapStateToProps,
    { getOwes, getUsers }
)(PartyDetection);