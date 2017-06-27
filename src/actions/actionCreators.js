import * as types from './actionTypes';

export function connectNetwork(){
    console.log("Connect Network");
    return{
        type:types.CONNECT_NETWORK,
    };
}
export function disconnectNetwork(){
    console.log("Disconnect Network");
    return{
        type: types.DISCONNECT_NETWORK,
    };
}

export function playVideo(_videoID){
    console.log("playVideo("+_videoID+")");
    return{
        type: types.PLAY_VIDEO,
        videoID: _videoID,
    };
}
export function pausedVideo(){
    console.log("pausedVideo action");
    return{
        type: types.PAUSED_VIDEO,
    }
}
export function stopVideo(){
    return{
        type: types.STOP_VIDEO,
    };
}

export function levelPhone(){
    console.log("levelPhone action");
    return{
        type: types.LEVEL_PHONE,
    };
}
export function verticalPhone(){
    console.log("verticalPhone action");
    return{
        type: types.VERTICAL_PHONE,
    };
}

export function signalBeacons(){
    console.log("signalBeacons action");
    return{
        type: types.SIGNAL_BEACONS,
    };
}
export function notSignalBeacons(){
    console.log("notSignalbeacons action");
    return{
        type: types.NOT_SIGNAL_BEACONS,
    };
}

export function connectBeacon(){
    console.log("connectBeacon action");
    return{
        type: types.CONNECT_BEACON,
    };
}
export function disconnectBeacon(){
    console.log("disconnectBeacon action");
    return{
        type: types.DISCONNECT_BEACON,
    };
}

export function scanBeacons(){
    console.log("scanBeacons action");
    return{
        type: types.SCAN_BEACONS,
    };
}
export function stopScanBeacons(){
    console.log("stopScanBeacons action");
    return{
        type: types.STOP_SCAN_BEACONS,
    };
}