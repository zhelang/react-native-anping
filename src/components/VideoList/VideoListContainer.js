import React, { Component } from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, ListView,TouchableOpacity, Image, BackAndroid} from "react-native";
import {Actions} from 'react-native-router-flux';
import RNFS from 'react-native-fs';
import YouTube from 'react-native-youtube';

import VideoListDisplay from './VideoListDisplay';
import BackButton from './BackButton';

import backGround_Image from '../../images/bg_list.png';
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';
const {height: deviceHeight, width: deviceWidth} = Dimensions.get("window");
const myYoutubeAPIKey = 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY';



export default class VideoListContainer extends Component {
  constructor(props) {
      super(props);
	  
      const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
	  
      this.state = {
        dataSource:ds.cloneWithRows([]),
        comingSoonTop:deviceHeight,
        showing:false,
		play: false,//影片播放器參數
		video_id: '',
      };

	  	//ES6 class add functions
      	this.fetchData = this.fetchData.bind(this);
		this.deleteVideoData = this.deleteVideoData.bind(this);

  }//end constructor

  
  
	componentWillMount() {
	
	}
  
  
  
	componentDidMount(){
		
		//抓取資料
		this.fetchData();
		
		//backbutton listener(android)
		BackAndroid.addEventListener('hardwareBackPress', () => {
			
			//if youtube player is playying, stop it
			 if (this.props.videoPlayer.flagPlay) {
			   this.props.actions.pausedVideo();
			   return true;
			 }
			return false;
		});
	}//end componentDidMount
	
	
	
	componentWillUnmount(){
		//remove backbutton listener
		BackAndroid.removeEventListener('hardwareBackPress', () => {});
	}//end componentWillUnmount

  
  
  
	//抓取資料
	fetchData(){
	  
		//抓取記事本內容(JSON格式)
		RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			let vid_info = JSON.parse(content);
			this.setState({ dataSource: this.state.dataSource.cloneWithRows(vid_info)});                                       
		}).catch((err)=>{
			console.log("FETCH ERROR:"+err);
		}).done();
		
	}//end fetch Data
  
  
  
	//清除資料
	deleteVideoData(){
		
		RNFS.unlink(VIDEO_LIST_FILE).then(()=>{
			//console.warn("清除成功");
			Actions.pop({popNum:2});
			BackAndroid.exitApp();
			//Actions.welcome({refresh: {}});
		}).catch((err)=>{
			console.log("清除失敗："+err.message)
		})

	}//end deleteVideoData



  render(){
    return(
		<View style={ !this.state.play ? {flex:1, backgroundColor:'#ffffff'} : styles.video_paused } >
		
			<Image source={backGround_Image} style={styles.backGround}/>
		
			<View style={ styles.container }>
				<View style={styles.title}>
					<BackButton/>
				</View>

				<VideoListDisplay dataSource={this.state.dataSource} flagNetwork={this.props.network.flagNetwork} playVideo={this.props.actions.playVideo} stopVideo={this.props.actions.stopVideo}/>
				
			</View>
		
			<YouTube
				videoId={ this.props.videoPlayer.videoID }
				play={ this.props.videoPlayer.flagPlay }
				hidden
				playsInline
				controls={ 1 }
				loop={ false }
				apiKey={ myYoutubeAPIKey }
				style={ this.props.videoPlayer.flagPlay ? styles.video_play : styles.video_paused }
				onChangeState={ (event) => { 
					//播放完畢時，暫停撥放
					if(event.state == 'ended'){
						this.props.actions.pausedVideo();
					}	
				}}
			/>
		</View>
    );
  }//end render
  
}

const styles = StyleSheet.create({
	backGround:{
		position: 'absolute',
		left:0,
		bottom:0,
		width: deviceWidth,
		height: deviceWidth/4,
		resizeMode: Image.resizeMode.contain,
		borderWidth:1,
	},
	container:{
		//flexDirection: "column",
		flex:1,
	},
  title:{
	  flex:0.15,
	  //backgroundColor:"#e6684b",
	  //justifyContent: "center",
	  //alignItems: "center",
	  flexDirection: 'row',
	  //borderColor:'yellow',
	  //borderWidth:1,
   },
  
  video_play:{
		width: deviceWidth,
		height: deviceHeight,
  },
  video_paused:{
		width: 0,
		height: 0,
  },

});
