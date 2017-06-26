import { ActionConst } from 'react-native-router-flux';

export default function routes(state ={}, action={}){
	switch(action.type){
		case ActionConst.FOCUS:
			return{
				...state,
				scene: action.scene,
			}
		default:
			return state;
	}//end switch
}//end reducer