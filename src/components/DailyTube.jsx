import React, { Component } from "react";
import AllAccounts from "./AllAccounts";
import AccountInfo from "./AccountInfo";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import AddNewAccount from "./AddNewAccount";
import Loader from "../loader.gif";
import CurrentVideo from "./CurrentVideo";
import { YOUTUBE_KEY } from "../config/keys";
import "../bootstrap.min.css";
const Axios = require("axios");
const moment = require("moment");

export class DailyTube extends Component {
    state = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        /* 
            flowing states
        */
        running: false,
        searching: false,
        downloading: false,
        uploading: false,
        publishing: false,
        switchingAccounts: false,
        deletingAccount: false,
        creatingChannel: false,
        /* 
            static states
        */
        accounts: [],
        currentAccount: {},
        newAccountObject: null,
        videoInfo: false,
        accountInfo: false,
        accountId: null,
        filePath: "",
        publishUrl: "",
    };

    async componentDidMount() {
        const accounts = await this.fetchAllAccounts();
        console.log(
            "TCL: DailyTube -> componentDidMount -> accounts",
            accounts,
        );

        if (!accounts.length) {
            this.setState({ accounts: null, currentAccount: null });
        } else {
            const currentAccount = accounts.filter(
                account => account.current === true,
            )[0];
            this.setState({ accounts, currentAccount });
        }
    }

    componentDidUpdate() {
        const {
            running,
            searching,
            downloading,
            uploading,
            publishing,
            switchingAccounts,
            accountInfo,
            updateAccountId,
            creatingChannel,
        } = this.state;

        if (accountInfo === "loading") this.fetchAccountInfo(updateAccountId);

        if (creatingChannel) this.addingNewDailyMotionChannel();

        if (running) {
            if (switchingAccounts) this.switchAccounts();

            if (searching) this.searchForVideos();

            if (downloading) this.downloadVideo();

            if (uploading) this.uploadVideo();

            if (publishing) this.publishVideo();
        }
    }

    handleDeleteAccount = () => {
        const id = this.state.accountInfo.upload.id;
        console.log("TCL: DailyTube -> handleDeleteAccount -> id", id);
        Axios.delete(`/api/delete_account?account_id=${id}`, {
            headers: this.state.headers,
        })
            .then(response => {
                console.log("TCL: YouTube -> response", response);
                const updatedAccounts = async () => {
                    this.setState({
                        accounts: await this.fetchAllAccounts(),
                        accountInfo: false,
                    });
                };
                if (response.data.success) {
                    updatedAccounts();
                }
            })
            .catch();
    };

    addingNewDailyMotionChannel = () => {
        const { newAccountObject } = this.state;
        const body = JSON.stringify(newAccountObject);
        Axios.post("/api/create_new_account", body, {
            headers: this.state.headers,
        })
            .then(response => {
                if (response.data.success) {
                    this.handleEditAccountInfo(response.data.accountId);
                }
            })
            .catch();
    };

    handleAddNewDailyMotionChannel = newAccountObject => {
        console.log("TCL: newAccountObject", newAccountObject);
        this.setState({ newAccountObject, creatingChannel: true });
    };

    render() {
        const {
            accounts,
            accountInfo,
            deletingAccount,
            currentAccount,
            searching,
            downloading,
            uploading,
            switchingAccounts,
            publishing,
            videoInfo,
            creatingChannel,
        } = this.state;
        return (
            <div className="d-flex flex-column position-relative fullscreen">
                {deletingAccount ? (
                    <ConfirmDeleteAccount
                        account={accountInfo}
                        onCancelRequestToDeleteAccount={
                            this.handleCancelRequestToDeleteAccount
                        }
                        onDeleteAccount={this.handleDeleteAccount}
                    />
                ) : (
                    ""
                )}
                <div className="row m-0">
                    <div className="col-sm-3">
                        <div className="d-flex">
                            <button
                                className="btn btn-success py-0 px-4 m-2"
                                onClick={() =>
                                    this.setState({
                                        running: true,
                                        switchingAccounts: true,
                                    })
                                }
                            >
                                Start
                            </button>

                            <button
                                className="btn btn-warning py-0 px-4 m-2"
                                onClick={() =>
                                    this.setState({
                                        running: false,
                                    })
                                }
                            >
                                Stop
                            </button>
                        </div>
                        <div className="d-flex flex-column">
                            {accounts !== null ? (
                                <AllAccounts
                                    accounts={accounts}
                                    onEditAccountInfo={
                                        this.handleEditAccountInfo
                                    }
                                />
                            ) : (
                                <div>
                                    {accounts === null ? (
                                        <span className="text-warning">
                                            No accounts have been added yet
                                        </span>
                                    ) : (
                                        <div>
                                            <span>Loading Accounts</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-9 py-2">
                        {!!accountInfo ? (
                            <AccountInfo
                                account={accountInfo}
                                onRequestToDeleteAccount={
                                    this.handleRequestToDeleteAccount
                                }
                                onUpdateAccountSettings={
                                    this.handleUpdateAccountSettings
                                }
                                onAddNewAccount={() =>
                                    this.setState({ accountInfo: false })
                                }
                            />
                        ) : (
                            <div>
                                {creatingChannel ? (
                                    <div className="col-sm-9 d-flex h-100 w-100">
                                        <div className="mx-auto my-auto d-flex align-items-center">
                                            <h4 className="mr-3">
                                                Loading Account Details
                                            </h4>
                                            <img
                                                height="50px"
                                                src={Loader}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <AddNewAccount
                                        handle
                                        onAddNewDailyMotionChannel={
                                            this.handleAddNewDailyMotionChannel
                                        }
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-light h-100">
                    <div className="d-flex">
                        {!!currentAccount ? (
                            <React.Fragment>
                                <div className="px-2 bg-info ">
                                    {currentAccount.user_name}
                                </div>
                                <div
                                    className={`px-2 ${
                                        searching ? "bg-success" : "bg-white"
                                    }`}
                                >
                                    <span>searching</span>
                                </div>
                                <div
                                    className={`px-2 ${
                                        downloading ? "bg-success" : "bg-white"
                                    }`}
                                >
                                    <span>downloading</span>
                                </div>
                                <div
                                    className={`px-2 ${
                                        uploading ? "bg-success" : "bg-white"
                                    }`}
                                >
                                    <span>uploading</span>
                                </div>
                                <div
                                    className={`px-2 ${
                                        publishing ? "bg-success" : "bg-white"
                                    }`}
                                >
                                    <span>publishing</span>
                                </div>
                                <div
                                    className={`px-2 ${
                                        switchingAccounts
                                            ? "bg-success"
                                            : "bg-white"
                                    }`}
                                >
                                    <span>switchingAccounts</span>
                                </div>
                            </React.Fragment>
                        ) : (
                            <span>waiting for current account</span>
                        )}
                    </div>
                    <CurrentVideo videoInfo={videoInfo} />
                </div>
            </div>
        );
    }

    getUploadDate = iso => {
        return moment(iso, "YYYYMMDD").fromNow();
    };

    handleEditAccountInfo = async updateAccountId => {
        const accounts = await this.fetchAllAccounts();
        this.setState({
            accountInfo: "loading",
            updateAccountId,
            accounts,
            creatingChannel: false,
        });
    };

    handleRequestToDeleteAccount = () => {
        this.setState({ deletingAccount: true });
    };

    handleCancelRequestToDeleteAccount = () => {
        this.setState({ deletingAccount: false });
    };

    handleUpdateAccountSettings = async newAccountSettings => {
        const body = JSON.stringify(newAccountSettings);
        const id = newAccountSettings.accountId;
        Axios.put(`/api/update_account?account_id=${id}`, body, {
            headers: this.state.headers,
        })
            .then(response => {
                const updatedAccounts = async () => {
                    this.setState({
                        accounts: await this.fetchAllAccounts(),
                    });
                };
                if (response.data.success) {
                    updatedAccounts();
                }
            })
            .catch(error => console.error(error));
    };

    fetchAccountInfo = accountId => {
        Axios.get(`/api/get_account_info?account_id=${accountId}`)
            .then(response => {
                console.log("TCL: YouTube -> response", response.data);
                this.setState({ accountInfo: response.data });
            })
            .catch(error => {
                this.setState({ accountInfo: false });
            });
    };

    fetchAllAccounts = async () => {
        let accounts;
        await Axios.get("/api/gets_all_accounts")
            .then(response => {
                console.log("TCL: fetchAllAccounts -> response", response);
                accounts = response.data.sort((a, b) => b.current - a.current);
            })
            .catch();
        return accounts;
    };

    fetchVideoInfo = async url => {
        let videoInfo;
        await Axios.get(url)
            .then(response => {
                videoInfo = response.data.items[0];
            })
            .catch();
        return videoInfo;
    };

    fetchAllVideos = async () => {
        let videos;
        await Axios.get("/api/get_all_video_ids")
            .then(response => {
                videos = response.data;
            })
            .catch();
        return videos;
    };

    fetchUnUploadedAccountVideos = async accountId => {
        let videos;
        await Axios.get(
            `/api/get_un_uploaded_account_videos?account_id=${accountId}`,
        )
            .then(response => {
                videos = response.data;
            })
            .catch();
        return videos;
    };

    switchAccounts = () => {
        let nextAccountId, currentAccountIndex;
        /* 
            filter out accounts with no search terms or not in queue
        */
        const accounts = this.state.accounts
            .filter(account => !!account.search_terms === account.queue_status)
            .sort((a, b) => a.id - b.id);

        const currentAccount = accounts.filter(
            account => account.current === true,
        );
        if (currentAccount.length > 0) {
            currentAccountIndex = accounts.indexOf(currentAccount[0]);
            if (currentAccountIndex !== accounts.length - 1) {
                nextAccountId = accounts[currentAccountIndex + 1].id;
            } else {
                nextAccountId = accounts[0].id;
            }
        } else {
            // nextAccountId = accounts[0].id;
        }

        const body = JSON.stringify({
            isCurrent: true,
        });

        Axios.put(`/api/update_account?account_id=${nextAccountId}`, body, {
            headers: this.state.headers,
        })
            .then(async response => {
                if (response.data.success) {
                    const updatedAccounts = await this.fetchAllAccounts();
                    const newCurrentAccount = updatedAccounts.filter(
                        account => account.current === true,
                    )[0];
                    console.log(
                        "TCL: DailyTube -> newCurrentAccount",
                        newCurrentAccount,
                    );
                    this.setState({
                        switchingAccounts: false,
                        accounts: updatedAccounts,
                        searching: true,
                        currentAccount: newCurrentAccount,
                        videoInfo: false,
                    });
                }
            })
            .catch();
    };

    getSearchResults = async (terms, order) => {
        const allVideos = await this.fetchAllVideos();
        const allVideoIds = allVideos.map(video => video.video_id);
        const date = new Date(
            new Date().setDate(new Date().getDate() - 7),
        ).toISOString();
        const promises = terms.map(term => {
            const url = `https://www.googleapis.com/youtube/v3/search?q=${term}&maxResults=50&type=video&videoLicense=youtube&order=${order}&publishedAfter=${date}&part=snippet&key=${YOUTUBE_KEY}`;

            return Axios.get(url).then(response => {
                const infoPromises = response.data.items.map(async video => {
                    const videoId = video.id.videoId;

                    if (!allVideoIds.includes(videoId)) {
                        const infoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_KEY}&part=contentDetails,statistics`;

                        return Axios.get(infoUrl).then(response => {
                            const videoInfo = response.data.items[0];
                            try {
                                if (
                                    !!videoInfo &&
                                    !videoInfo.contentDetails.licensedContent
                                ) {
                                    return videoInfo;
                                } else {
                                    return null;
                                }
                            } catch (error) {
                                return null;
                            }
                        });
                    } else {
                        console.log("Duplicate");
                    }
                });
                return Promise.all(infoPromises);
            });
        });

        const searchResults = await Promise.all(promises);

        let cleanedResults = [];

        for (let results of searchResults) {
            for (let result of results) {
                if (!!result) cleanedResults = [...cleanedResults, result];
            }
        }

        return cleanedResults.sort(
            (a, b) => b.statistics.viewCount - a.statistics.viewCount,
        );
    };

    searchForVideos = async () => {
        const { search_terms, search_order, id } = this.state.currentAccount;

        const accountVideos = await this.fetchUnUploadedAccountVideos(id);

        /* 
            If account has un uploaded videos skip the search
        */
        if (!!accountVideos.length)
            return this.setState({ searching: false, downloading: true });

        const terms = search_terms.split(",");
        const order = search_order;

        const searchResults = await this.getSearchResults(terms, order);

        /* 
            If no search results switch accounts
        */
        if (!searchResults.length)
            return this.setState({ searching: false, switchingAccounts: true });

        // remove duplicates in search results
        let searchIds = searchResults.map(result => result.id);
        searchIds = [...new Set(searchIds)].splice(0, 10);
        console.log("TCL: searchForVideos -> searchIds", searchIds);
        const body = JSON.stringify({
            searchIds,
        });

        Axios.put(`/api/update_account?account_id=${id}`, body, {
            headers: this.state.headers,
        })
            .then(async response => {
                if (response.data.success) {
                    this.setState({ searching: false, downloading: true });
                }
            })
            .catch(error => {
                this.setState({ searching: false, switchingAccounts: true });
            });
    };

    downloadVideo = async () => {
        const { videoInfo, filePath } = this.state;

        if (!videoInfo) {
            const { id } = this.state.currentAccount;
            const accountVideos = await this.fetchUnUploadedAccountVideos(id);
            const currentVideoId = accountVideos[0].video_id;

            const url = `https://www.googleapis.com/youtube/v3/videos?id=${currentVideoId}&key=${YOUTUBE_KEY}&part=snippet,statistics`;

            const videoInfo = await this.fetchVideoInfo(url);
            console.log("TCL: downloadVideo -> videoInfo", videoInfo);
            return this.setState({ videoInfo });
        }

        const body = JSON.stringify({
            videoId: videoInfo.id,
            title: videoInfo.snippet.title,
            filePath,
        });

        Axios.post(`/api/download_video`, body, {
            headers: this.state.headers,
        })
            .then(async response => {
                console.log(
                    "TCL: downloadVideo -> response",
                    response.data.message,
                );

                if (response.data.success) {
                    this.setState({
                        downloading: false,
                        uploading: true,
                        filePath: response.data.file_path,
                    });
                } else {
                    this.setState({
                        downloading: false,
                        switchingAccounts: true,
                    });
                }
            })
            .catch(error => {
                this.setState({ downloading: false, switchingAccounts: true });
            });
    };

    uploadVideo = async () => {
        const { filePath } = this.state;
        const { id } = this.state.currentAccount;
        const accountVideos = await this.fetchUnUploadedAccountVideos(id);
        const currentVideoId = accountVideos[0].video_id;
        console.log("TCL: uploadVideo -> filePath", filePath);

        const body = JSON.stringify({
            filePath,
            videoId: currentVideoId,
        });

        Axios.post(`/api/upload_video?account_id=${id}`, body, {
            headers: this.state.headers,
        })
            .then(async response => {
                console.log(
                    "TCL: uploadVideo -> response",
                    response.data.message,
                );
                if (response.data.success) {
                    this.setState({
                        uploading: false,
                        publishing: true,
                        publishUrl: response.data.publish_url,
                    });
                } else {
                    this.setState({
                        uploading: false,
                        switchingAccounts: true,
                    });
                }
            })
            .catch(error => {
                this.setState({ uploading: false, switchingAccounts: true });
            });
    };

    publishVideo = async () => {
        const { publishUrl } = this.state;
        console.log("TCL: publishVideo -> publishUrl", publishUrl);
        const { id } = this.state.currentAccount;

        const accountVideos = await this.fetchUnUploadedAccountVideos(id);
        const currentVideoId = accountVideos[0].video_id;
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${currentVideoId}&key=${YOUTUBE_KEY}&part=snippet`;

        const videoInfo = await this.fetchVideoInfo(url);
        const thumbnails = Object.values(videoInfo.snippet.thumbnails);
        thumbnails.sort((a, b) => b.width - a.width);

        const body = JSON.stringify({
            videoId: videoInfo.id,
            publishUrl: publishUrl,
            title: videoInfo.snippet.title,
            tags: videoInfo.snippet.tags || [],
            description: videoInfo.snippet.description,
            thumbnailUrl: thumbnails[0].url,
        });

        Axios.post(`/api/publish_video?account_id=${id}`, body, {
            headers: this.state.headers,
        })
            .then(async response => {
                console.log(
                    "TCL: publishVideo -> response",
                    response.data.message,
                );
                if (response.data.success) {
                    this.setState({
                        switchingAccounts: true,
                        publishing: false,
                        publishUrl: "",
                    });
                } else {
                    this.setState({
                        publishing: false,
                        switchingAccounts: true,
                    });
                }
            })
            .catch(error => {
                this.setState({ publishing: false, switchingAccounts: true });
            });
    };
}

export default DailyTube;
