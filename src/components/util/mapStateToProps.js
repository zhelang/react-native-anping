//Map State To props
//reducers's function name is a object.
export function mapStateToProps(state){
  return{
    network: state.network,
    videoPlayer: state.videoPlayer,
    levelPhone: state.levelPhone,
    scanBeaconManager: state.scanBeaconManager,
  };
}