import React from "react";

function CurrentVideo(props) {
    const videoInfo = props.videoInfo;
    return (
        <React.Fragment>
            {!!videoInfo ? (
                <div className="pt-2 d-flex">
                    <div className="">
                        <img
                            height="140px"
                            src={
                                Object.values(
                                    videoInfo.snippet.thumbnails,
                                ).sort((a, b) => b.width - a.width)[0].url
                            }
                            alt=""
                        />
                    </div>
                    <div className="h-100 px-2">
                        <h5 className="">{videoInfo.snippet.title}</h5>
                        <div>
                            <span>{videoInfo.snippet.channelTitle}</span>
                            <span className="px-2">·</span>
                            <span className="mr-1">
                                {videoInfo.statistics.viewCount}
                            </span>
                            <span>views</span>
                            <span className="px-2">·</span>
                            <span className="mr-1">
                                {videoInfo.statistics.likeCount}
                            </span>
                            <span>likes</span>
                            <span className="px-2">·</span>
                            <span className="mr-1">
                                {videoInfo.statistics.dislikeCount}
                            </span>
                            <span>dislikes</span>
                            <span className="px-2">·</span>
                            <span>
                                {this.getUploadDate(
                                    videoInfo.snippet.publishedAt,
                                )}
                            </span>
                        </div>
                        <div>
                            <small>
                                {videoInfo.snippet.description.slice(0, 250)}
                                ....
                            </small>
                        </div>
                        <div>
                            {videoInfo.snippet.tags
                                .slice(0, 15)
                                .map((tag, index) => {
                                    return (
                                        <small
                                            key={index}
                                            className="py-0 px-2 m-1 bg-secondary text-white rounded font-weight-lighter"
                                        >
                                            {tag}
                                        </small>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="d-flex align-items-center">
                    <h5>
                        Videos being downloaded and uploaded will be displayed
                        here
                    </h5>
                </div>
            )}
        </React.Fragment>
    );
}

export default CurrentVideo;
