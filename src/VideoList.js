import React, { Component } from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, ListView,TouchableOpacity , ScrollView, Image, BackAndroid, NetInfo} from "react-native";
import {Actions} from 'react-native-router-flux';
import RNFS from 'react-native-fs';
import YouTube from 'react-native-youtube';

var {
  height: deviceWidth,
  width: deviceHeight,
} = Dimensions.get("window");

//引用圖片
import IC_LOCK from '../drawable/ic_lock.png';
import IC_PLAY from '../drawable/btn_play.png';
import IC_BACK from '../drawable/btn_back.png';
import BackGround_Image from '../drawable/bg_list.png';

//抓取記事本
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';
//Youtube API Key
const myYoutubeAPIKey = 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY';





export default class extends React.Component {
  constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
      this.state = {
        dataSource:ds.cloneWithRows([]),
        comingSoonTop:deviceHeight,
        showing:false,
		flagNetwork:false,
		
		//影片播放器參數
		paused: false,
		video_id: '',
      };

	  //ES6 class add functions
      this.fetchData = this.fetchData.bind(this);
	  this.deleteVideoData = this.deleteVideoData.bind(this);
	  this.backButtonFunction = this.backButtonFunction.bind(this);

  }//end constructor

  
  
	componentWillMount() {
	
	}
  
	componentDidMount(){
		//抓取資料
		this.fetchData();
		//檢查是否有網路
		NetInfo.isConnected.fetch().then(isConnected => {
			this.setState({flagNetwork: isConnected});
			//console.warn("flagNetwork="+isConnected);
		});
	}//end componentDidMount

  
  
  
  //抓取資料
  fetchData(){
	  
		//抓取記事本內容(JSON格式)
        RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			//with vid_list
            var vid_info = JSON.parse(content);
			this.setState({
                dataSource:this.state.dataSource.cloneWithRows(vid_info)
            });
			//console.warn("抓到資料囉");
                                                      
        }).catch((err)=>{
			console.log("FETCH ERROR:"+err);
			
        }).done();
		
  }//end fetch Data
  
  
	//返回鍵
	backButtonFunction(){
		Actions.pop();
	}
  
  
  
	//清除資料
	deleteVideoData(){
		
		RNFS.unlink(VIDEO_LIST_FILE).then(()=>{
			//console.warn("清除成功");
			Actions.pop({popNum:2});
			BackAndroid.exitApp();
			//Actions.welcome({refresh: {}});
			
		})
		.catch((err)=>{
			console.log("清除失敗："+err.message)
		})
		
		//console.log('清除資料了');
	}//end deleteVideoData

  
  
  
	//顯示使用
  _renderRow(rowData, sectionID, rowID, highlightRow) {

    //console.warn('rowData' , rowData);
    var maxLen = 105;

	//大於顯示值，則????
    if(rowData.body.length > maxLen){
      rowData.body = rowData.body.slice(0,maxLen) + '...';
    }
	
    return(

          <View style={styles.cellContainer}>
            <View style={styles.cell}>
			
              <View style={styles.cellsTitleContainer}>
                <Text style={styles.cellsTitle}>{rowData.title}</Text>
              </View>
			  
              <TouchableOpacity onPress={()=>{ if(rowData.unlocked&&this.state.flagNetwork){this.setState({paused: true, video_id: rowData.video_id})} }}>
			  
                <View style={ styles.thumbnailContainer }>
					<Image style={ rowData.unlocked ? styles.thumbnail : styles.thumbnail_lock } source={{uri:'https://img.youtube.com/vi/'+rowData.video_id+'/sddefault.jpg'}}/>
					<Image style={ styles.lock }source={ (!rowData.unlocked&&this.state.flagNetwork) ? IC_LOCK : IC_PLAY }/>
					<Text style={ !this.state.flagNetwork ? styles.opennetwork_show : styles.opennetwork_hide }>請開啟網路{'\n'}Please open network.</Text>
                </View>
				
              </TouchableOpacity>
			  
              <View style={styles.cellsBodyContainer}>
                <Text style={styles.cellsBody}>{rowData.body}</Text>
              </View>
			  
            </View>
          </View>

      );
  }//end _renderRow

  render(){
    return(
		<View style={ !this.state.paused ? {flex:1, backgroundColor:'#ffffff'} : styles.video_paused } >
		
			<Image source={BackGround_Image} style={{position: "absolute", left:0, bottom:0, width: deviceWidth, height: deviceWidth/4, resizeMode: Image.resizeMode.contain,  borderWidth:1,}}/>
		
			<View style={ styles.container }>
				<View style={styles.title}>
					<TouchableOpacity style={  styles.backbuttonContainer } onPress={()=>{ this.backButtonFunction(); }}>
						<Image style={{width: 30,resizeMode: Image.resizeMode.contain}} source={IC_BACK}/>
					</TouchableOpacity>
				</View>
				<View style={ styles.videoListContainer }>
					<ScrollView horizontal={true}>
						<ListView
						  horizontal={true}
						  contentInset={{top:100}}
						  dataSource={this.state.dataSource}
						  renderRow={(rowData , sectionID , rowID , highlightRow) => this._renderRow(rowData , sectionID , rowID , highlightRow) }
						  style={{marginLeft:20,marginRight:20}}
						  enableEmptySections={true}
						 />
					</ScrollView>
				</View>
			</View>
		
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
						this.setState({paused: false, video_id: ''});
					}	
				}}
			/>
				
		</View>

    );
  }//end render
  
}

const styles = StyleSheet.create({
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
  backbuttonContainer:{
	position: "absolute",
	top: 0,
	left: 15,
	width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor:'green',
    //borderWidth:1,
  },
  videoListContainer:{
	flex: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor:'red',
    //borderWidth:2,
	//marginTop:10,
    //marginBottom:10,
  },
  cellContainer:{
    width:deviceWidth / 3.5 + 10,
    height:deviceHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //borderColor:'blue',
    //borderWidth:2,
  },
  cell:{
    width:deviceWidth / 3.5,
    height:deviceHeight/1.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10,
    backgroundColor:'#ffffff',
    borderColor:'#C7C7C7',
    borderWidth:1,
  },
  cellsTitleContainer:{
    height:30,
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor:'yellow',
    //borderWidth:2,
  },
  cellsTitle:{
    fontWeight:"400",
    fontSize: 20,
	color: "#585858",
  },
  thumbnailContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail:{
    height:deviceHeight / 2.5,
    width:deviceWidth / 3.5 - 10,
    resizeMode:'contain',
  },
  thumbnail_lock:{
	height:deviceHeight / 2.5,
    width:deviceWidth / 3.5 - 10,
    resizeMode:'contain',
	opacity: 0.25,/*影片縮圖被鎖時的透明度*/
  },
  lock:{
	position:'absolute',
    top: (deviceHeight / 2)*0.5 - 64/2 ,
    left: (deviceWidth / 3.5 - 10)/2 - (64/2),
	height: 32, 
	resizeMode: Image.resizeMode.contain,
  },
  lock_hide:{
	width:0,
	height:0,
  },
  opennetwork_show:{
	color: '#6b6b6b',
	fontSize: 12,
  },
  opennetwork_hide:{
	fontSize: 0,
  },
  cellsBodyContainer:{
    width:deviceWidth / 3.5 - 10,
    //borderColor:'green',
    //borderWidth:2,
  },
  cellsBody:{
    fontWeight:"200",
    fontSize: 15,
	color: "#585858",
  },
  video_play:{
		width: deviceWidth,
		height: deviceHeight,
  },
  video_paused:{
		
  },

});
