import React, { Component } from 'react';
import { Container, Button, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { getOwes, deleteOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';
import { getUsers } from '../actions/userActions';
import { Image, Modal, List, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { clearErrors } from '../actions/errorActions';


class PartyDetection extends Component {
    static propTypes = {
        getOwes: PropTypes.func.isRequired,
        owe: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
    }
    state = {
        allPartyArray: [],
        detectionPartyArray: [],
        favorList: []
    }
    partyDetection = () => {
        this.state.favorList = ["Coffee", "Chocolate", "Mint", "Pizza", "Cupcake"]
        let k = 0
        for (let l = 0; l < this.state.favorList.length; l++) {
            if (this.props.owe.owes.length > 0) {
                let j = 0
                for (let i = 0; i < this.props.owe.owes.length; i++) {
                    if (this.props.owe.owes[i].debtor == this.props.user._id &&
                        this.props.owe.owes[i].favor == this.state.favorList[l]) {
                        this.state.allPartyArray[j] = [this.state.favorList[l], this.props.user._id, this.props.owe.owes[i].creditor]
                        j++
                    }
                }
            }
            this.state.allPartyArray = this.unique(this.state.allPartyArray)

            do {
                for (let j = 0; j < this.props.owe.owes.length; j++) {
                    if (this.props.owe.owes[j].debtor == this.state.allPartyArray[0][this.state.allPartyArray[0].length - 1] &&
                        this.props.owe.owes[j].favor == this.state.favorList[l]) {
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


        setTimeout(() => {
            console.log(this.state.allPartyArray)
            console.log(this.state.detectionPartyArray)
            console.log(this.state.favorList)
        }, 300);

    }
    unique = (array) => {
        let obj = {}
        return array.filter((item, index) => {
            let newItem = item + JSON.stringify(item)
            return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
        })
    }

    render() {
        var { owes } = this.props.owe;
        return (
            <div className="container">
                {
                    this.props.isAuthenticated ? (<Button
                        type="default"
                        shape="round"
                        key="partydetection"
                        onClick={this.partyDetection}
                    >
                        Complete
                    </Button>) : null
                }
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
    { getOwes, getUsers, clearErrors }
)(PartyDetection);