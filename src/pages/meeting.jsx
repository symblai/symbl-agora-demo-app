import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useGlobalState, useGlobalMutation } from "../utils/container";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import useRouter from "../utils/use-router";
import useStream from "../utils/use-stream";
import RTCClient from "../rtc-client";
import StreamPlayer from "./meeting/stream-player";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Symbl } from "symbl-chime-adapter";
import symblFont from '../assets/symbl-font/css/symbl.css';
require("dotenv").config();


var symbl;

const useStyles = makeStyles({
    menu: {
        height: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10"
    },
    customBtn: {
        width: "50px",
        height: "50px",
        borderRadius: "26px",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backgroundSize: "50px",
        cursor: "pointer"
    },
    leftAlign: {
        display: "flex",
        flex: "1",
        justifyContent: "space-evenly"
    },
    rightAlign: {
        display: "flex",
        flex: "1",
        justifyContent: "center"
    },
    menuContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
    },
    transcriptContainer: {
        width: "300px",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        backgroundColor: "rgb(71 71 71)",
    },
});

const calcGridArea = index => {
    let c = 1;
    let r = 1;
    if (index != 0) {
        if (index < 6) {
            r = (index % 3) + 1;
            if (index > 2 && index < 6) {
                c = 2;
            }
        } else {
            c = index < 11 ? 3 : 4;
            r = index < 11 ? (index % 6) + 1 : index % 10;
        }
    }
    const gridArea = `${c} / ${r}`;
    return gridArea;
};

const MeetingPage = () => {
    const classes = useStyles();

    const routerCtx = useRouter();
    const stateCtx = useGlobalState();

    const mutationCtx = useGlobalMutation();

    const localClient = useMemo(() => {
        const client = new RTCClient();
        if (!client._created) {
            client.createClient({ codec: stateCtx.codec, mode: stateCtx.mode });
            client._created = true;
        }
        return client;
    }, [stateCtx.codec, stateCtx.mode]);

    const [localStream, currentStream] = useStream(localClient);

    const { name: channelName, role } = useParams();

    const config = useMemo(() => {
        return {
            token: process.env.REACT_APP_AGORA_TOKEN,
            channel: channelName,
            userName: stateCtx.config.userName,
            microphoneId: stateCtx.config.microphoneId,
            cameraId: stateCtx.config.cameraId,
            resolution: stateCtx.config.resolution,
            muteVideo: stateCtx.muteVideo,
            muteAudio: stateCtx.muteAudio,
            uid: 0,
            host: role === "host"
        };
    }, [stateCtx]);

    const history = routerCtx.history;

    useEffect(() => {
        if (!config.channel) {
            history.push("/");
        }
    }, [config.channel, history]);

    useEffect(() => {
        return () => {
            localClient &&
                localClient.leave().then(() => mutationCtx.clearAllStream());
        };
    }, [localClient]);

    useEffect(() => {
        if (
            channelName &&
            localClient._created &&
            localClient._joined === false
        ) {
            mutationCtx.startLoading();
            localClient
                .join(config)
                .then(() => {
                    if (config.host) {
                        localClient.setClientRole("host").then(
                            () => {
                                localClient.publish();
                                mutationCtx.stopLoading();
                            },
                            err => {
                                mutationCtx.toastError(
                                    `setClientRole Failure: ${err.info}`
                                );
                            }
                        );
                    } else {
                        localClient.setClientRole("audience").then(
                            () => {
                                mutationCtx.stopLoading();
                            },
                            err => {
                                mutationCtx.toastError(
                                    `setClientRole Failure: ${err.info}`
                                );
                            }
                        );
                    }
                })
                .catch(err => {
                    mutationCtx.toastError(`Media ${err.info}`);
                    routerCtx.history.push("/");
                });
        }
    }, [localClient, mutationCtx, config, channelName, routerCtx]);

    useEffect(() => {
        (async () => {
            const res = await fetch("http://localhost:8081/symbl-token");
            const data = await res.json();
            const config = {
                attendeeId: btoa(stateCtx.config.userName),
                meetingId: btoa(channelName),
                userName: stateCtx.config.userName,
                meeting: channelName
            };
            console.log("Got symbl token", data, config);
            Symbl.ACCESS_TOKEN = data.accessToken;

            symbl = new Symbl(config);
            const insightHandler = {
                onInsightCreated: (insight) => {
                    console.log('Insight created', insight, insight.type);
                    // insight.createElement();
                    const div = document.createElement("div");
                    div.innerHTML = `
                    <div style="background-color: rgba(0,0,0,.5); margin: 15px; padding: 8px; color: rgb(255,255,255);">
                        <div style="font-weight: bold; text-align: center; margin-bottom: 5px;"> ${insight.type} </div>
                        <div style="font-weight: bold; border-bottom: 1px solid white; margin-left: -5px; margin-right: -5px;"> </div>
                        <div style="font-size: 15px; font-weight: bold; margin-top: 5px;"> Assignee: ${insight.data.assignee.name} </div>
                        <div style="padding: 10px; "> ${insight.text} </div>
                        <div style="text-align: right; font-weight: 400; font-size: 12px; margin-left: 15px;"> ${new Date().toLocaleString()} </span>
                    </div>
                        `;
                    insight.element = div;
                    const container = document.getElementById("transcriptContainer");
                    insight.add(container);
                }
            };
            symbl.subscribeToInsightEvents(insightHandler);
            const transcriptHandler = {
                onTranscriptCreated: transcript => {
                    console.log('On transcript created', transcript);
                    const div = document.createElement("div");
                    div.innerHTML = `<div style="background-color: rgba(0,0,0,.5); margin: 15px; padding: 5px; color: rgb(255,255,255);">
                        <div style="font-weight: bold;"> ${transcript.userName}</div>
                        <div style="padding: 10px;"> ${transcript.message} </div>
                        <div style="text-align: right; font-weight: 400; font-size: 12px; margin-left: 15px;"> ${new Date(transcript.timeStamp).toLocaleString()} </div>
                        </div>`;
                    const container = document.getElementById(
                        "transcriptContainer"
                    );
                    container.appendChild(div);
                }
            };
            symbl.subscribeToTranscriptEvents(transcriptHandler);
            var _caption = '';
            const captioningHandler = {
                onCaptioningToggled: ccEnabled => {
                    // Implement
                },
                onCaptionCreated: (caption) => {
                    console.warn("Caption created", caption);
                    // Retrieve the video element that you wish to add the subtitle tracks to.
                    // var activeVideoElement = document.querySelector("video");
                    var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                    if (videoElementContainer) {
                        const activeVideoElement = videoElementContainer.querySelector('video');
                        caption.setVideoElement(activeVideoElement);
                    }
                },
                onCaptionUpdated: (caption) => {
                    // Check if the video element is set correctly

                    var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                    if (videoElementContainer) {
                        const activeVideoElement = videoElementContainer.querySelector('video');
                        caption.setVideoElement(activeVideoElement);
                    }
                }
            };
            symbl.subscribeToCaptioningEvents(captioningHandler);
            symbl.start();
        })();
    }, [localClient]);

    const handleClick = name => {
        return evt => {
            evt.stopPropagation();
            switch (name) {
                case "video": {
                    stateCtx.muteVideo
                        ? localStream.muteVideo()
                        : localStream.unmuteVideo();
                    mutationCtx.setVideo(!stateCtx.muteVideo);
                    break;
                }
                case "audio": {
                    stateCtx.muteAudio
                        ? localStream.muteAudio()
                        : localStream.unmuteAudio();
                    mutationCtx.setAudio(!stateCtx.muteAudio);
                    break;
                }
                default:
                    throw new Error(`Unknown click handler, name: ${name}`);
            }
        };
    };

    const handleDoubleClick = stream => {
        mutationCtx.setCurrentStream(stream);
    };

    const [otherStreams, placeholders] = useMemo(() => {
        const _otherStreams = stateCtx.streams.filter(
            it => it.getId() !== currentStream.getId()
        );
        const _placeholders = Array.from(new Array(16), () => null);
        return [_otherStreams, _placeholders];
    }, [currentStream, stateCtx]);

    return !stateCtx.loading ? (
        <div className="meeting">
            <div className="current-view">
                <div className="nav">

                    <div> </div>
                    <div
                        className="quit"
                        onClick={() => {
                            localClient.leave().then(() => {
                                mutationCtx.clearAllStream();
                                routerCtx.history.push("/");
                            });
                        }}
                    >
                        {" "}
                    </div>
                </div>
                {currentStream ? (
                    <div className={classes.menuContainer}>
                        {config.host && (
                            <div className={classes.menu}>
                                <Tooltip
                                    title={
                                        stateCtx.muteVideo
                                            ? "mute-video"
                                            : "unmute-video"
                                    }
                                >
                                    <i
                                        onClick={handleClick("video")}
                                        className={clsx(
                                            classes.customBtn,
                                            "margin-right-19",
                                            stateCtx.muteVideo
                                                ? "mute-video"
                                                : "unmute-video"
                                        )}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title={
                                        stateCtx.muteAudio
                                            ? "mute-audio"
                                            : "unmute-audio"
                                    }
                                >
                                    <i
                                        onClick={handleClick("audio")}
                                        className={clsx(
                                            classes.customBtn,
                                            "margin-right-19",
                                            stateCtx.muteAudio
                                                ? "mute-audio"
                                                : "unmute-audio"
                                        )}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title={
                                        'Get meeting summary'
                                    }
                                >
                                    <i
                                        onClick={async () => {
                                            const summaryUrl = await symbl.getSummaryUrl();
                                            const div = document.createElement('input');
                                            div.innerHTML = summaryUrl;
                                            navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
                                                if (result.state == "granted" || result.state == "prompt") {
                                                    /* write to the clipboard now */
                                                    navigator.clipboard.writeText(summaryUrl).then(function() {
                                                        /* clipboard successfully set */
                                                        console.log('Copied summary URL to clipboard');
                                                    }, function() {
                                                        /* clipboard write failed */
                                                        console.error('Error copying summary url to clipboard');
                                                    });
                                                }
                                            });
                                        }}
                                        className={clsx(
                                            classes.customBtn,
                                            "margin-right-19",
                                            'si-logo'
                                        )}
                                    />
                                </Tooltip>
                                <Tooltip title={"share audience link"}>
                                    <CopyToClipboard
                                        className={clsx(
                                            classes.customBtn,
                                            "share-link"
                                        )}
                                        onCopy={() => {
                                            mutationCtx.toastSuccess(
                                                "Copy Success"
                                            );
                                        }}
                                        text={window.location
                                            .toString()
                                            .replace(/\w+$/, "audience")}
                                    >
                                        <span></span>
                                    </CopyToClipboard>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                ) : null}
                <div className="flex-container">
                    <div className="grid-layout position-related">
                        {placeholders.map((_, index) => (
                            <StreamPlayer
                                style={{ gridArea: calcGridArea(index) }}
                                className={"stream-profile"}
                                showProfile={stateCtx.profile}
                                local={false}
                                key={index}
                                stream={null}
                                uid={null}
                                showUid={false}
                            >
                                {" "}
                            </StreamPlayer>
                        ))}
                    </div>
                    <div className="grid-layout z-index-5">
                        {stateCtx.currentStream ? (
                            <StreamPlayer
                                key={stateCtx.currentStream.getId()}
                                main={true}
                                showProfile={stateCtx.profile}
                                local={
                                    config.host && stateCtx.currentStream
                                        ? stateCtx.currentStream.getId() ===
                                        localStream.getId()
                                        : false
                                }
                                stream={stateCtx.currentStream}
                                onDoubleClick={handleDoubleClick}
                                uid={stateCtx.currentStream.getId()}
                                showUid={true}
                                domId={`stream-player-${stateCtx.currentStream.getId()}`}
                            >
                                {" "}
                            </StreamPlayer>
                        ) : (
                                <StreamPlayer
                                    main={true}
                                    showProfile={stateCtx.profile}
                                    local={false}
                                    stream={null}
                                    onDoubleClick={handleDoubleClick}
                                    uid={0}
                                    showUid={true}
                                    domId={"default"}
                                >
                                    {" "}
                                </StreamPlayer>
                            )}
                        {otherStreams.map((stream, index) => (
                            <StreamPlayer
                                style={{ gridArea: calcGridArea(index) }}
                                className={"stream-profile"}
                                showProfile={stateCtx.profile}
                                local={
                                    config.host
                                        ? stream.getId() === localStream.getId()
                                        : false
                                }
                                key={index + "" + stream.getId()}
                                stream={stream}
                                uid={stream.getId()}
                                domId={`stream-player-${stream.getId()}`}
                                onDoubleClick={handleDoubleClick}
                                showUid={true}
                            >
                                {" "}
                            </StreamPlayer>
                        ))}
                    </div>
                </div>
            </div>
            <div id="transcriptContainer" className={classes.transcriptContainer}></div>
        </div>
    ) : null;
};

export default MeetingPage;
