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
    return{
        type: types.LEVEL_PHONE,
    };
}
export function verticalPhone(){
    return{
        type: types.VERTICAL_PHONE,
    };
}

export function signalBeacons(){
    return{
        type: types.SIGNAL_BEACONS,
    };
}
export function notSignalBeacons(){
    return{
        type: types.NOT_SIGNAL_BEACONS,
    };
}

export function connectBeacon(){
    return{
        type: types.CONNECT_BEACON,
    };
}
export function disconnectBeacon(){
    return{
        type: types.DISCONNECT_BEACON,
    };
}

export function scanBeacons(){
    return{
        type: types.SCAN_BEACONS,
    };
}
export function stopScanBeacons(){
    return{
        type: types.STOP_SCAN_BEACONS,
    };
}