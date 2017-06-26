// reducers/levelPhone.js

import * as types from '../actions/actionTypes';

const initState={
    flagLevel: false,
};

export default function levelPhone(state=initState, action={}){
    switch(action.type){
        case types.LEVEL_PHONE:
            return{
                ...state,
                flagLevel: true,
            };
        case types.VERTICAL_PHONE:
            return{
                ...state,
                flagLevel: false,
            };
        default:
            return state;
    }//end switch
}