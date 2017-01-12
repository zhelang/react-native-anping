//主要功能：
//1.iBeacon偵測距離
//2.震動 提醒指定距離到了
//3.陀螺儀 偵測 水平
//4.水平時且距離近，則顯示影片





import React, {Component}  from 'react';
import {StyleSheet,Text,View,DeviceEventEmitter,Vibration,BackAndroid,TouchableOpacity,Image,Dimensions} from 'react-native';
//ibeacons API引用
import Beacons from 'react-native-beacons-android';
//藍芽串流 API引用
import BluetoothSerial from 'react-native-bluetooth-serial';
//SensorManager API
var mSensorManager = require('NativeModules').SensorManager;
//Youtube API
import YouTube from 'react-native-youtube';







//近的距離(dbm)
const nearRangRSSI = -100;
//藍芽偵測頻率(s)
const bluetoothScanFrequency = 1.5;
//加速器偵測頻率(ms)
const acceleratorDetectionFrequency = 2000;
//水平角度誤差(越大越遲鈍)
const angleAccuracy = 5;
//重力加速度
const gravityAcceleration = 9;
//斷線誤差(s)
const disconnectValue = 1;
//掃描間隔(ms)
const FPS = 1000;
//偵測次數重設間隔(s)
const LITI_RESET_COUNT = 5;
//震動間隔(s)
const LITI_VIBRATE = 1;





//雷達圖片
import Radar from '../drawable/radar.gif';

//Youtube API Key
const myYoutubeAPIKey = 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY';

//Ibeacons的基本資訊 Array
//Index_0=Major,Index_1=minor,Index_2=VideoUri,Index_3=偵測次數
const iBInfo = [
	[17815,2484,'-z9dZDDbCSQ',0],
	[61577,38355,'_mkiGMtbrPM',0],
	[41778,42019,'xwg2Hpf4ta8',0]
];





export default class MainFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		  //IBeacon 資料儲放陣列
		  beacons:[],
		  
		  //最近的IBeaon資訊
		  closeMajor:null,
		  closeMinor:null,
		  //closeRssi:nearRangRSSI,
		  
		  //是否手機水平
		  levelFlag:false,
		  
		  //確定附近有IBeacons訊號
		  haveIB:false,
		  
		  //連線中Falg
		  flagConnect:false,
		  
		  //目前狀態
		  STATUS:false,
		  
		  //斷線誤差計數器，一開始要為0
		  counterDisconnect:0,
		  
		  //重設偵測次數計數器
		  resetDectCountCount:0,
		  
		  //影片播放器參數
		  isReady: null,
		  VideoStatus: null,
		  quality: null,
		  error: null,
		  paused: false,
		  VideoId: null,
		  apikey: myYoutubeAPIKey
		};

		//FPS(ms)觸發一次，mainFlowControl()
		this.Timer = setInterval(() => { 
				//進入流程控制
				this.mainFlowControl(); 
		}, FPS);
		
		//JavaScript SE6 添加function到此class
		this.onAccelerometerUpdate = this.onAccelerometerUpdate.bind(this);
		this.coutDectIBeacons = this.coutDectIBeacons.bind(this);
		this.pickVideoId = this.pickVideoId.bind(this);
		this.judgePlayVideo = this.judgePlayVideo.bind(this);
		this.judgeDisconnect = this.judgeDisconnect.bind(this);
		this.mainFlowControl = this.mainFlowControl.bind(this);
		this.MaxCountIBeacons = this.MaxCountIBeacons.bind(this);
		this.ResetBeaconCount = this.ResetBeaconCount.bind(this);
		
		//
		BackAndroid.addEventListener('hardwareBackPress', function() {
			
			//關閉藍芽
			/*BluetoothSerial.disable()
				.then((res) => 
					console.log("藍芽關閉成功"))
				.catch((err) => 
					console.log("藍芽關閉失敗 ${err}")
			);*/
			
			//關閉Randging(測距)，需要過約5秒才會關閉
			/*Beacons.stopRangingBeaconsInRegion('REGION1')
				.then(() => 
					console.log('Beacons ranging stoped succesfully'))
				.catch(error => 
					console.log(`Beacons ranging not stoped, error: ${error}`)
			);*/
			
			//離開程式
			BackAndroid.exitApp();
		});
	}//end constructor

	
	
	
	
	//Use this as an opportunity to perform preparation before an update occurs. 
	componentWillMount() {
		//
		// ONLY non component state aware here in componentWillMount
		//
		
	}

	
	
	
	
	//Use this as an opportunity to operate on the DOM when the component has been updated. 
	componentDidMount() {
		
		//開始加速器偵測(ms)
		mSensorManager.startAccelerometer(acceleratorDetectionFrequency);
		
		//加速器偵測事件
		DeviceEventEmitter.addListener('Accelerometer', (data) => 
			this.onAccelerometerUpdate(data)
		);
		
		//強制開啟藍芽
		BluetoothSerial.enable()
			.then((res) => 
				console.log("強制開啟藍芽成功"))
			.catch((err) => 
				console.log("強制開啟藍芽失敗 ${err}")
		);
		
		//開始偵測iBeacon
		Beacons.detectIBeacons();
		
		//iBeacons的掃描的間隔時間(s)
		Beacons.setBackgroundBetweenScanPeriod( bluetoothScanFrequency );
		
		//開啟iBecons Ranging(測距)
		Beacons.startRangingBeaconsInRegion('REGION1')
		.then(() => 
			console.log('Beacons ranging started succesfully')
		)
		.catch(error => 
			console.log(`Beacons ranging not started, error: ${error}`)
		);
		
		//iBecons Ranging的事件
		this.beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange',(data) => {
				//console.warn("偵測到IBeacons");
					
				//儲存資料(data.beacons是陣列內容)
				this.setState({beacons: data.beacons});
					
			}
		);
		
	}//end componentDidMount()
	
	
	
	
	
	//更新加速器狀態
	onAccelerometerUpdate(data){
		
		//連接Sate
		var levelFlag = this.state.levelFlag;
		
		if( ((data.x>-angleAccuracy)&&(data.x<angleAccuracy) || (data.y>-angleAccuracy)&&(data.y<angleAccuracy)) && (data.z>gravityAcceleration) ){
			//手機水平時
			levelFlag = true;
		}else if( ((data.x>-angleAccuracy)&&(data.x<angleAccuracy) || (data.y>-angleAccuracy)&&(data.y<angleAccuracy)) && (data.z>-angleAccuracy)&&(data.z<angleAccuracy) ){
			//手機垂直時
			levelFlag = false;
		}else{
			//手機不確定的狀態時
			levelFlag = false;
		}//end if

		//存回State
		this.setState({
			levelFlag: levelFlag
		});
		
	}//end onAccelerometerUpdate
	
	
	
	
	
	//流程控制
	mainFlowControl(){
		//console.warn('mainFlowControl');
		
		//Step_1:計數偵測到的IBeacons
		this.coutDectIBeacons();
		
		//Step_2:Pick out video id
		this.pickVideoId();
		
		//Step_3:Judge Play Video
		this.judgePlayVideo();
		
		//Step_4:judgment Disconnect
		this.judgeDisconnect();
		
		//console.warn("Play="+!this.state.paused);
		
	}//end mainFlowControl
  
  
  
  

	//計數iBecons偵測次數(參數beconData是陣列)
	coutDectIBeacons(){
		
		//先連結State
		var beacons = this.state.beacons;
		var closeMajor = this.state.closeMajor;
		var closeMinor = this.state.closeMinor;
		//var nearRangRSSI = this.state.nearRangRSSI;
		
		//讀取抓取的ibeaconData
		for (var i = 0; i < beacons.length ; i++)
		{
			//要到一定距離才計算偵測次數
			if(beacons[i].rssi >= nearRangRSSI){
				
				//偵測次數++
				for(var k=0;k<iBInfo.length;k++){
					if((beacons[i].major == iBInfo[k][0]) && (beacons[i].minor == iBInfo[k][1])){
						iBInfo[k][3]++;
						//console.warn(beacons[i].major + "'s Count = " + iBInfo[k][3]);
					}//end if
					
				}//end for
				
			}else{
				//console.warn(beacons[i].major + "'s RSSI = " + beacons[i].rssi);
			}//end if
			
		}//end for
		
		//console.warn("計數iBecons偵測次數");
		
	}//end coutDectIBeacons()
	
	
	
	
	//選出Uri
	pickVideoId(){
		
		//連結state
		var resetDectCountCount = this.state.resetDectCountCount;
		var old_closeMajor = this.state.closeMajor;
		var old_closeMinor = this.state.closeMinor;
		
		resetDectCountCount++;
		
		//次數到了
		if(resetDectCountCount >= LITI_RESET_COUNT){
			
			//console.warn("次數到了");
			
			//回復狀態，避免有不可辨識的IBeacons
			this.setState({haveIB: false});
			
			//選出最大的Count IBeacon
			this.MaxCountIBeacons();
			var new_closeMajor = this.state.closeMajor;
			var new_closeMinor = this.state.closeMinor;
			
			//如果有抓到較近的iBeacon
			if(new_closeMajor != null && new_closeMinor != null){
				
				//如果與上一個最接近的不一樣，則重新抓取VideoID
				if( !((old_closeMajor == new_closeMajor) && (old_closeMinor == new_closeMinor)) ){
					
					//console.warn("iBInfo的大小:"+iBInfo.length);
					//console.warn("closeMajor:"+closeMajor+",closeMinor:"+closeMinor);
				
					//配對Major, Minor
					for(var i=0; i < iBInfo.length ; i++){
					
						//console.warn("iBInfo["+i+"][0]:"+iBInfo[i][0]+",iBInfo["+i+"][1]:"+iBInfo[i][1]);
						
						if((new_closeMajor == iBInfo[i][0]) && (new_closeMinor == iBInfo[i][1])){
							
							//設定Uri
							this.setState({VideoId:iBInfo[i][2]});
							
							//附近有可以辨識的IBeacons
							this.setState({haveIB: true});
							
							//console.warn("VideoID="+this.state.VideoId);
							
						}//end if
					}//end for	
				}else{
					//console.warn("一樣的VideoID="+this.state.VideoId);
					
					//附近有可以辨識的IBeacons
					this.setState({haveIB: true});
				}//end if
			}//end if
			
			//重設偵測次數計數器
			resetDectCountCount = 0;
			this.ResetBeaconCount();
		
		}//end if
		
		this.setState({
			resetDectCountCount: resetDectCountCount
		});
		
		//console.warn("挑出VideoID");
		
	}//end pickVideoId
	
	
	
	
	
	//判斷是否可以撥放
	judgePlayVideo(){
		//連結state
		var resetDectCountCount = this.state.resetDectCountCount;
		
		//console.warn(resetDectCountCount + "/" + LITI_VIBRATE + "=" + (resetDectCountCount / LITI_VIBRATE));
		
		//連結state
		var flagConnect = this.state.flagConnect;
		var levelFlag = this.state.levelFlag;
		var VideoId = this.state.VideoId;
			
		if( flagConnect && levelFlag && (VideoId=!null)){
				
			//開始撥放影片
			this.setState({paused:false, STATUS:true});
			//console.warn("撥放影片:"+this.state.VideoId+", paused="+this.state.paused);
				
		}else if( flagConnect && !levelFlag && (VideoId =! null)){
				
			//震動間隔
			if((resetDectCountCount % LITI_VIBRATE) == 0){
	
				//有影片可以撥放時可以觀看，提醒使用者
				Vibration.vibrate();
				this.setState({paused:true, STATUS:false});
				//console.warn("震動");
			}//end if
				
		}else if( !flagConnect ){
				
			//附近完全沒有IBeacon
			this.setState({paused:true, STATUS:false});
				
			//重設狀態
			var closeMajor = null;
			var closeMinor = null;
			//console.warn("附近完全沒有IBeacon:"+this.state.counterDisconnect);
				
		}//end if
			
		//console.warn("判斷是否播放");
		
	}//end judgePlayVideo
	
	
	
	
	
	//Step_4 斷線判斷
	judgeDisconnect(){
		//取得State
		var counterDisconnect = this.state.counterDisconnect;
		var flagConnect = this.state.flagConnect;
		const haveIB = this.state.haveIB;
		
		//console.warn("haveIB="+haveIB);
		if(haveIB){//周圍有IBeacons
			
			//計數器復原
			counterDisconnect = disconnectValue;
			
		}else{//周圍沒有IBeacons
			
			//計數器--
			counterDisconnect--;
		}
		
		//console.warn("counterDisconnect="+counterDisconnect);
		if(counterDisconnect > 0){
			//連線
			flagConnect = true;
		}else{
			//斷線
			flagConnect = false;
		}
		
		//回存計數器
		this.setState({
			counterDisconnect:counterDisconnect,
			flagConnect:flagConnect
			
		});
		
		//console.warn("判斷是否斷線");
		
	}//end judgeDisconnect()

	
	
	
	
	//挑出偵測次數最高的iBeacons
	MaxCountIBeacons(){
		var count=0;
		var closeMajor=null;
		var closeMinor=null;
		
		for(var i=0;i<iBInfo.length;i++){
			if((iBInfo[i][3] != 0) && (iBInfo[i][3] > count)){
				count = iBInfo[i][3];
				closeMajor = iBInfo[i][0];
				closeMinor = iBInfo[i][1];
			}
		}//end for
		
		this.setState({
				closeMajor:closeMajor,
				closeMinor:closeMinor
		});
		
	}//end MaxCountIBeacons

	
	
	
	
	//Reset偵測次數
	ResetBeaconCount(){
		
		for(var i=0;i<iBInfo.length;i++){
			iBInfo[i][3] = 0;
		}//end for
		//console.warn("IBeacon計數紀錄清除完成");
		
	}//end ResetBeaconCount
	
	
	
	
	
	//渲染畫面	
	render() {
		return (
			<YouTube
				videoId={ this.state.VideoId }
				play={ !this.state.paused }
				hidden={ true }
				playsInline={ false }
				controls={ 0 }
				loop={ true }
				apiKey={ myYoutubeAPIKey }
				style={ styles.video }
			/>
				
		);
	}//end render()	
	
	//關閉APP時的處理
	componentWillUnMount(){

	}//end componentWillUnMount
	
}//end Class






const styles = StyleSheet.create({
	fullScreen: {
		flex:1,
		backgroundColor: '#ffffff',
		justifyContent: "center",
		alignItems: "center",
	},
	video:{
		flex:1,
		backgroundColor: '#ffffff',
	},
	radar:{
		width: 200,
		height: 200,
		resizeMode: 'contain',
	},
});






//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");


