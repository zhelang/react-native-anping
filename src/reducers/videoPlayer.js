// reducers/videoPlayer.js

import * as types from '../actions/actionTypes';

const initState ={
    flagPlay: false,
    videoID: '',
};

export default function videoPlayer(state=initState,action={}){
    switch(action.type){
        case types.PLAY_VIDEO:
            return{
                ...state,
                flagPlay: true,
                videoID: action.videoID,
            };
        case types.PAUSED_VIDEO:
            return{
                ...state,
                flagPlay: false,
            };
        case types.STOP_VIDEO:
            return{
                ...state,
                flagPlay: false,
                videoID: '',
            };
        default:
            return state;
    }//end switch
}//end videoPlayer