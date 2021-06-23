import React, {Component} from "react";
import "./emi_setup.css";
import EMISuccess from "./emi_success";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

export default class SetUpEMIDueDate extends Component {
    #success = 0;

    constructor(props) {
        super(props);
        this.state = {redirect: false}
        this.validateForm = this.validateForm.bind(this);
        this.checkNotEmpty = this.checkNotEmpty.bind(this);
        this.setError = this.setError.bind(this);
        this.removeError = this.removeError.bind(this);
        this.checkNumeric = this.checkNumeric.bind(this);
        this.checkRange = this.checkRange.bind(this);
        this.clearText = this.clearText.bind(this);
    }

    validateForm(event) {
        event.preventDefault();
        const emi_name = document.getElementById("emi_name");
        const emi_name_str = emi_name.value
        if (this.checkNotEmpty(emi_name_str) === false) {
            this.setError(emi_name, "EMI name is a mandatory field")
        } else {
            this.removeError(emi_name);
        }
        // check alphanuremic

        const emi_amount = document.getElementById("emi_amount");
        const emi_amount_str = emi_amount.value
        if (this.checkNotEmpty(emi_amount_str) === false) {
            this.setError(emi_amount, "EMI amount is a mandatory field")
            return;
        } else if (this.checkNumeric(emi_amount_str) === false) {
            this.setError(emi_amount, "EMI Amount must be numeric and integer");
            return;
        } else {
            this.removeError(emi_amount);
        }
        const emi_due_date = document.getElementById("emi_due_date");
        const emi_due_date_str = emi_due_date.value
        if (this.checkNotEmpty(emi_due_date_str) === false) {
            this.setError(emi_due_date, "EMI Due date is a mandatory field");
        } else if (this.checkNumeric(emi_due_date_str) === false) {
            this.setError(emi_due_date, "EMI due date must be numeric");
        } else if (this.checkRange(emi_due_date_str, 1, 31) === false) {
            this.setError(emi_due_date, "EMI due date must be between 1 to 31");
        } else {
            this.removeError(emi_due_date);
        }
        if (this.#success === 1) {
            this.setState(
                {
                    redirect: true,
                    emi_name: emi_name_str,
                    emi_amount: emi_amount_str,
                    emi_due_date: emi_due_date_str
                }
            );
        }
    }

    setError(input, message) {
        const e = input.parentElement;
        e.className = 'emi-input error'
        const errMsg = e.querySelector('small');
        errMsg.innerText = message
        this.setState({redirect: false});
        this.#success = 0;
    }

    removeError(input) {
        const e = input.parentElement;
        e.className = 'emi-input success'
        this.setState({redirect: true});
        this.#success = 1;
    }

    checkNumeric(val) {
        const numericRegex = /^[0-9]+$/;
        return numericRegex.test(String(val).toLowerCase());
    }

    checkRange(val, min, max) {
        const v = parseInt(val)
        if (v < min || v > max) {
            return false;
        }
        return true;
    }

    checkNotEmpty(value) {
        if (value.trim() === "") {
            return false;
        }

        return true;
    }

    clearText() {
        document.getElementById("emi-form").reset();
        let emi_name = document.getElementById('emi_name');
        let emi_amount = document.getElementById('emi_amount');
        let emi_due_date = document.getElementById('emi_due_date');
        const e = emi_name.parentElement;
        e.className = 'emi-input success';
        emi_amount.parentElement.className = 'emi-input success';
    }

    render() {
        return <>
            <div>
                <Header title="EMISetup"/>
                <Sidebar/>
                {!this.state.redirect ? (

                    <div>
                        <div className="setup-emi">
                            <h4>Set up EMI due date, so that we will remind you about the EMI due dates</h4>
                            <h5>Please enter following details:</h5>
                            <form id="emi-form" onSubmit={this.validateForm}>
                                <div className={"emi-input"}>
                                    <label>Give EMI a name: </label>
                                    <input type="text" id="emi_name" placeholder="Give emi a name"/>
                                    <small>dummy_error_message</small>
                                </div>
                                <div className={"emi-input"}>
                                    <label>Enter monthly EMI amount: </label>
                                    <input type="text" id="emi_amount" placeholder="Monthly EMI amount"/>
                                    <small>dummy_error_message</small>
                                </div>
                                <div className={"emi-input"}>
                                    <div className={"due-date"}>
                                        <label>EMI due date every of month(Between 1-31): </label>
                                        <input type="text" id="emi_due_date" placeholder="Due date of every month"/>
                                        <small>dummy_error_message</small>
                                    </div>
                                </div>
                                <div className={"submit-button"}>
                                    <input type={"submit"} value={"Submit"}/>
                                    <button type={"button"} onClick={this.clearText}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (<EMISuccess emi_name={this.state.emi_name} emi_amount={this.state.emi_amount}
                                 emi_due_date={this.state.emi_due_date}/>)}
            </div>
        </>
    }
}