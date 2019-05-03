import React, { Component } from "react";

export class AddNewAccount extends Component {
    state = {
        error: "",
        searchTerms: [],
        apiKey: "",
        apiSecret: "",
        channelUsername: "",
        channelPassword: "",
        searchOrder: "",
    };

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

    handleApiKeyInput = e => {
        this.setState({ apiKey: e.target.value });
    };

    handleApiSecretInput = e => {
        this.setState({ apiSecret: e.target.value });
    };

    handleChannelUsernameInput = e => {
        this.setState({ channelUsername: e.target.value });
    };

    handleChannelPasswordInput = e => {
        this.setState({ channelPassword: e.target.value });
    };

    handleSearchOrderSelect = e => {
        this.setState({ searchOrder: e.target.value });
    };

    verifyDataAndCreateChannel = () => {
        const {
            apiKey,
            apiSecret,
            channelPassword,
            channelUsername,
            searchTerms,
            searchOrder,
        } = this.state;

        if (
            !!apiKey &&
            !!apiSecret &&
            !!channelPassword &&
            !!channelUsername &&
            !!searchOrder &&
            searchTerms.length > 0
        ) {
            this.setState({ error: "" });
            this.props.onAddNewDailyMotionChannel(this.state);
        } else {
            this.setState({ error: "please fill out all fields" });
        }
    };

    render() {
        return (
            <div>
                <h5 className="px-2 mt-4 mb-3">Add new DailyMotion channel</h5>
                <div style={{ height: "60vh" }} className="overflow-auto">
                    {!!this.state.error ? (
                        <div className="alert alert-warning d-flex align-items-center">
                            <span>{this.state.error}</span>
                            <i
                                class="material-icons ml-auto px-3 pointer"
                                onClick={() => this.setState({ error: "" })}
                            >
                                highlight_off
                            </i>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="d-flex">
                        <div className="card shadow-sm w-50 p-3 mr-4">
                            <div className="mb-2">
                                <label
                                    className=" form-control-sm"
                                    htmlFor="apiKey"
                                >
                                    Api Key
                                </label>
                                <input
                                    type="text"
                                    className=" form-control"
                                    id="apiKey"
                                    onChange={this.handleApiKeyInput}
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    className=" form-control-sm"
                                    htmlFor="apiSecret"
                                >
                                    Api Secret
                                </label>
                                <input
                                    type="text"
                                    className=" form-control"
                                    id="apiSecret"
                                    onChange={this.handleApiSecretInput}
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    className=" form-control-sm"
                                    htmlFor="userName"
                                >
                                    Channel Username
                                </label>
                                <input
                                    type="text"
                                    className=" form-control"
                                    id="userName"
                                    onChange={this.handleChannelUsernameInput}
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    className=" form-control-sm"
                                    htmlFor="password"
                                >
                                    Channel Password
                                </label>
                                <input
                                    type="text"
                                    className=" form-control"
                                    id="password"
                                    onChange={this.handleChannelPasswordInput}
                                />
                            </div>
                        </div>

                        <div className="card shadow-sm w-50 p-3">
                            <h5 className="px-2 mb-3">Videos Settings</h5>
                            <div className="mb-2">
                                <label className=" form-control-sm">
                                    Search order
                                </label>
                                <select
                                    className="custom-select "
                                    id="inputGroupSelect01"
                                    onChange={this.handleSearchOrderSelect}
                                >
                                    <option defaultValue>Choose...</option>
                                    <option value="date">Date</option>
                                    <option value="rating">Rating</option>
                                    <option value="relevance">Relevance</option>
                                    <option value="title">Title</option>
                                    <option value="viewCount">
                                        View count
                                    </option>
                                </select>
                            </div>
                            <div className="form-group row mx-0">
                                <label
                                    htmlFor="searchTermsInput"
                                    className=" form-control-sm"
                                >
                                    Search Terms
                                </label>
                                <input
                                    type="text"
                                    id="searchTermsInput"
                                    className="form-control "
                                    placeholder="# Add search terms ..."
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
                            <div className="d-flex ">
                                <button
                                    className="ml-auto btn btn-success py-1 px-2"
                                    onClick={this.verifyDataAndCreateChannel}
                                >
                                    Add Channel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddNewAccount;
