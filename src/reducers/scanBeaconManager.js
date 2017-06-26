// reducers/scanBeaconManager.js

import * as types from '../actions/actionTypes';

const initState={
    flagSignalBeacons: false,
    flagConnectBeacon: false,
    flagScanBeacons: true,
}

export default function scanBeaconManager(state=initState, action={}){
    switch(action.type){
        case types.SIGNAL_BEACONS:
            return{
                ...state,
                flagSignalBeacons: true,
            };
        case types.NOT_SIGNAL_BEACONS:
            return{
                ...state,
                flagSignalBeacons: false,
            };
        case types.CONNECT_BEACON:
            return{
                ...state,
                flagConnectBeacon: true,
            };
        case types.DISCONNECT_BEACON:
            return{
                ...state,
                flagConnectBeacon: false,
            };
        case types.SCAN_BEACONS:
            return{
                ...state,
                flagScanBeacons: true,
            };
        case types.STOP_SCAN_BEACONS:
            return{
                ...state,
                flagScanBeacons: false,
            };
        default:
            return state;
    }
}