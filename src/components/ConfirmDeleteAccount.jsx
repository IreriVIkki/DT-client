import React, { Component } from "react";

export class ConfirmDeleteAccount extends Component {
    state = {
        disabledDelete: true,
    };

    render() {
        const {
            account,
            onDeleteAccount,
            onCancelRequestToDeleteAccount,
        } = this.props;
        console.log("TCL: ConfirmDeleteAccount -> account", account);
        if (!!!account) return null;
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
        }

        const handleVerifyDeleteCode = () => {
            if (document.getElementById("deleteCode").value === result) {
                this.setState({ disabledDelete: false });
            }
        };

        return (
            <div className="d-flex justify-content-center align-items-center absolute-cover">
                <div
                    className="after-grey"
                    onClick={() => onCancelRequestToDeleteAccount()}
                />
                <div className="text-center card z-index-3">
                    <div className="card-header">
                        <h5 className="mb-0 px-4 py-3">
                            Are you sure you want to delete account
                            <span className="mx-2 text-info">
                                {account.info.screenname}
                            </span>
                            permanently!
                        </h5>
                    </div>
                    <div className="py-5">
                        <h5>
                            Type
                            <span className="mx-2 text-warning">{result}</span>
                            below to proceed
                        </h5>
                        <input
                            type="text"
                            id="deleteCode"
                            onChange={() => handleVerifyDeleteCode()}
                        />
                    </div>
                    <div className="d-flex justify-content-center card-footer">
                        <button
                            className="btn mx-2 btn-secondary py-0"
                            onClick={() => onCancelRequestToDeleteAccount()}
                        >
                            cancel
                        </button>
                        <button
                            className="btn mx-2 btn-danger py-0"
                            id="deleteButton"
                            disabled={this.state.disabledDelete}
                            onClick={() => onDeleteAccount()}
                        >
                            delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmDeleteAccount;
