import React from "react";

function AllAccounts(props) {
    const { accounts, onEditAccountInfo } = props;
    return (
        <div className="overflow-auto" style={{ height: "60vh" }}>
            <h5>Queue</h5>

            {accounts.map((account, index) => {
                return (
                    <div
                        key={index}
                        className={`card shadow-sm pointer overflow-hidden mb-2 ${
                            account.current ? "bg-secondary text-light" : ""
                        }`}
                        onClick={() => {
                            onEditAccountInfo(account.id);
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <img
                                className="rounded mr-2"
                                src={account.account_avatar}
                                alt=""
                                width="60px"
                                height="60px"
                            />
                            <div className="w-75 d-flex">
                                <div className="w-50">
                                    <div className="d-flex align-items-center">
                                        <span className="font-weight-bolder">
                                            {account.channel_name.slice(0, 12)}
                                        </span>
                                    </div>
                                    {account.queue_status ? (
                                        <div className="d-flex align-items-center">
                                            <small className="mr-2">
                                                Queued
                                            </small>
                                            <span className="font-weight-bolder text-success">
                                                YES
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center">
                                            <small className="mr-2">
                                                Queued
                                            </small>
                                            <span className="font-weight-bolder text-danger">
                                                NO
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-50">
                                    <div className="d-flex align-items-center">
                                        <small className="mr-2">
                                            Mins Left
                                        </small>
                                        <span className="font-weight-bolder">
                                            {account.video_duration_remaining}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <small className="mr-2">
                                            Vids Left
                                        </small>
                                        <span className="font-weight-bolder">
                                            {account.upload_videos_remaining}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AllAccounts;
