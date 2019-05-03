import React, { Component } from "react";
import Loader from "../loader.gif";

export class AccountInfo extends Component {
    state = {
        searchTerms: [],
        isCurrent: false,
        isQueued: false,
        searchOrder: null,
        accountId: null,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.account !== false &&
            nextProps.account !== "loading" &&
            prevState.accountId !== nextProps.account.upload.id
        ) {
            const oldSearchTerms = nextProps.account.upload.search_terms.split(
                ",",
            );

            return {
                isCurrent: nextProps.account.upload.current,
                isQueued: nextProps.account.upload.queue_status,
                searchTerms: oldSearchTerms,
                searchOrder: nextProps.account.upload.search_order,
                accountId: nextProps.account.upload.id,
            };
        }
        return null;
    }

    handleSearchTermInput = e => {
        e.persist();
        if (e.keyCode === 13) {
            this.setState({
                searchTerms: [...this.state.searchTerms, e.target.value],
            });
            document.getElementById("searchTermsInput").value = "";
        }
    };

    handleClearSearchTerm = searchTermToRemove => {
        this.setState({
            searchTerms: this.state.searchTerms.filter(
                searchTerm => searchTerm !== searchTermToRemove,
            ),
        });
    };

    handleCurrentStateChange = () => {
        this.setState({ isCurrent: !this.state.isCurrent });
    };

    handleQueueStateChange = () => {
        this.setState({ isQueued: !this.state.isQueued });
    };

    handleSearchOrderSelect = e => {
        this.setState({ searchOrder: e.target.value });
    };

    render() {
        const {
            account,
            onRequestToDeleteAccount,
            onUpdateAccountSettings,
            onAddNewAccount,
        } = this.props;
        if (account === false) {
            return null;
        } else if (account === "loading") {
            return (
                <div className="col-sm-9 d-flex h-100 w-100">
                    <div className="mx-auto my-auto d-flex align-items-center">
                        <h4 className="mr-3">Loading Account Details</h4>
                        <img height="50px" src={Loader} alt="" />
                    </div>
                </div>
            );
        } else {
            return (
                <React.Fragment>
                    <div>
                        <button
                            className="btn btn-secondary py-0 mb-2 mr-5 d-inline-flex align-items-center"
                            onClick={() => onAddNewAccount()}
                        >
                            add new account
                            <i className="material-icons md-18">add</i>
                        </button>
                        <button
                            className="btn btn-danger text-dark py-0 mb-2 d-inline-flex align-items-center"
                            onClick={() => onRequestToDeleteAccount()}
                        >
                            delete this account
                            <i className="material-icons md-18">clear</i>
                        </button>
                    </div>
                    <div
                        className="mx-0 row my-2 overflow-auto"
                        style={{ height: "60vh" }}
                    >
                        <div className="col-sm-6 px-1 mx-0">
                            <div className="card shadow-sm py-2">
                                <div className="d-flex justify-content-between">
                                    <div className="text-center flex-fill">
                                        <img
                                            className="img-fluid rounded w-50"
                                            src={account.info.avatar_60_url}
                                            alt=""
                                        />
                                        <h6 className="px-1 pt-1 font-weight-bolder m-0">
                                            {account.info.screenname}
                                        </h6>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.info.followers_total}
                                        </span>
                                        <small className="mb-2">
                                            followers
                                        </small>
                                    </div>

                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.info.following_total}
                                        </span>
                                        <small className="mb-2">
                                            following
                                        </small>
                                    </div>

                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.info.videos_total}
                                        </span>
                                        <small className="mb-2">Videos</small>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.info.views_total}
                                        </span>
                                        <small className="mb-2">Views</small>
                                    </div>
                                </div>
                            </div>
                            <br />

                            <div className="card shadow-sm p-2">
                                <div className="d-flex justify-content-between">
                                    <div className="border-right border-info w-25 d-flex align-items-center justify-content-center">
                                        <h6 className="font-weight-bolder m-0">
                                            Revenue
                                        </h6>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            <span className="pr-1">€</span>
                                            {Math.round(
                                                account.info
                                                    .revenues_video_total * 100,
                                            ) / 100}
                                        </span>
                                        <small className="">Total</small>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            <span className="pr-1">€</span>
                                            {Math.round(
                                                account.info
                                                    .revenues_video_last_month *
                                                    100,
                                            ) / 100}
                                        </span>
                                        <small className="">Last Month</small>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            <span className="pr-1">€</span>
                                            {Math.round(
                                                account.info
                                                    .revenues_video_last_day *
                                                    100,
                                            ) / 100}
                                        </span>
                                        <small className="">Yesterday</small>
                                    </div>
                                </div>
                            </div>
                            <br />

                            <div className="card shadow-sm p-2">
                                <div className="d-flex justify-content-between">
                                    <div className="border-right border-info w-25 d-flex align-items-center">
                                        <h6 className="font-weight-bolder d-flex flex-fill flex-column text-center">
                                            <span className="px-1 mx-auto">
                                                Upload
                                            </span>
                                            <span className="px-1 mx-auto">
                                                Limits
                                            </span>
                                        </h6>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.upload.minutes_remaining}
                                        </span>
                                        <small className="">
                                            Upload minutes Remaining
                                        </small>
                                    </div>
                                    <div className="d-flex flex-column flex-fill text-center justify-content-center">
                                        <span className="font-weight-bolder">
                                            {account.upload.videos_remaining}
                                        </span>
                                        <small className="">
                                            {" "}
                                            Upload videos remaining
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <br />
                        </div>
                        <div className="col-sm-6">
                            <div className="card shadow-sm p-2">
                                <div className="d-flex pt-3 pb-2">
                                    <h6 className="font-weight-bolder ">
                                        Edit Channel Settings
                                    </h6>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <span className="w-50">Current</span>
                                    <div className="custom-control custom-switch font-weight-lighter text-success">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="set-channel-to-current"
                                            defaultChecked={
                                                account.upload.current
                                            }
                                            onChange={
                                                this.handleCurrentStateChange
                                            }
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="set-channel-to-current"
                                        >
                                            {this.state.isCurrent ? (
                                                <span className="text-success">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    No
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <span className="w-50">In queue</span>
                                    <div className="custom-control custom-switch font-weight-lighter text-success">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="add-channel-to-queue"
                                            defaultChecked={
                                                account.upload.queue_status
                                            }
                                            onChange={
                                                this.handleQueueStateChange
                                            }
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="add-channel-to-queue"
                                        >
                                            {this.state.isQueued ? (
                                                <span className="text-success">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    No
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="w-50 m-0">Search By</span>
                                    <select
                                        className="custom-select w-50 font-weight-lighter py-0"
                                        id="inputGroupSelect01"
                                        onChange={this.handleSearchOrderSelect}
                                    >
                                        <option defaultValue>
                                            {this.state.searchOrder}
                                        </option>
                                        <option value="date">Date</option>
                                        <option value="rating">Rating</option>
                                        <option value="relevance">
                                            Relevance
                                        </option>
                                        <option value="title">Title</option>
                                        <option value="viewCount">
                                            View count
                                        </option>
                                    </select>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="w-50 m-0">
                                        Search Terms
                                    </span>
                                    <input
                                        type="text"
                                        id="searchTermsInput"
                                        className="form-control w-50"
                                        placeholder="#"
                                        onKeyUp={this.handleSearchTermInput}
                                    />
                                </div>
                                <div className="d-flex flex-wrap flex-reverse my-2">
                                    {this.state.searchTerms.map(
                                        (searchTerm, index) => {
                                            return (
                                                <button
                                                    key={index}
                                                    className="btn btn-outline-secondary py-0 mb-2 rounded px-2 mr-1 d-flex align-items-center"
                                                    onClick={() =>
                                                        this.handleClearSearchTerm(
                                                            searchTerm,
                                                        )
                                                    }
                                                >
                                                    <span className="mr-2">
                                                        {searchTerm}
                                                    </span>
                                                    <i className="material-icons md-18">
                                                        clear
                                                    </i>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                                <div className="d-flex px-4">
                                    <button
                                        className="ml-auto btn btn-success py-1 px-2"
                                        onClick={() =>
                                            onUpdateAccountSettings(this.state)
                                        }
                                    >
                                        save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default AccountInfo;
