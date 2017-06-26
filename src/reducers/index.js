import { combineReducers } from 'redux';
import routes from './routes';
import network from './network';
import videoPlayer from './videoPlayer';
import levelPhone from './levelPhone';
import scanBeaconManager from './scanBeaconManager';

export default combineReducers({
	routes,
	network,
	videoPlayer,
	levelPhone,
	scanBeaconManager,
});