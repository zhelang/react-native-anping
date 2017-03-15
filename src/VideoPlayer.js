import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Image,TouchableWithoutFeedback} from "react-native";
import {Actions} from 'react-native-router-flux';
//Youtube API
import YouTube from 'react-native-youtube';





var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");

//Youtube API Key
const myYoutubeAPIKey = 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY';





export default class extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
			//影片播放器參數
			isReady: null,
			VideoStatus: null,
			quality: null,
			error: null,
			paused: true,
			video_id: 'A8NlljMtsIY',
			apikey: myYoutubeAPIKey,
    	};

		//JS ES6 add function to class
		this.playVideo = this.playVideo.bind(this);
	}

  componentWillMount(){
  }
  componentDidMount(){
	  this.playVideo();
  }

  
  
  //播放準備
  playVideo(){
    //console.warn('this.props.video_id = ' , this.props.video_id);
	
	//this.props.video_id,
    
    this.setState({
		video_id: 'A8NlljMtsIY',
		paused: true,
	});

  }//end playVideo
  

  
	render(){

		return(
            <View style={styles.container}>
                <YouTube
					videoId={ this.state.video_id }
					play={ this.state.paused }
					hidden={ true }
					playsInline={ true }
					controls={ 1 }
					loop={ false }
					apiKey={ myYoutubeAPIKey }
					style={ this.state.paused ? styles.video_play : styles.video_paused }
					onChangeState={ (event) => { 
					
						//播放完畢時，暫停撥放
						if(event.state == 'ended'){
							
							//返回影片清單
							Actions.pop();
						}
						
					}}
				/>
            </View>
        );
	}
}



const styles = StyleSheet.create({
  container: {
		flex:1,
		backgroundColor: '#FFFFFF',
		justifyContent: "center",
		alignItems: "center",
  },
  video_play:{
		width: deviceHeight,
		height: deviceWidth,
  },
  video_paused:{
		
  },

});
