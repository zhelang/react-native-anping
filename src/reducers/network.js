// reducers/network.js

import * as types from '../actions/actionTypes';

export default function network(state={flagNetwork: false}, action={}){
    switch(action.type){
        case types.CONNECT_NETWORK:
            return{
                ...state,
                flagNetwork: true,
            };
        case types.DISCONNECT_NETWORK:
            return{
                ...state,
                flagNetwork: false,
            };
        default:
            return state;
    }//end switch
}//end network