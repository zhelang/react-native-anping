/*
此page主要功能：

 0.讀取vid_list.txt
 1.iBeacon偵測距離
 2.震動 提醒指定距離到了
 3.加速器偵測水平時，才可以播放影片；否則震動提示
 4.水平時且距離近，則顯示影片

*/



import React, {Component}  from 'react';
import {StyleSheet,Text,View,DeviceEventEmitter,Vibration,BackAndroid,TouchableOpacity,Image,Dimensions,AsyncStorage,NativeModules} from 'react-native';
//ibeacons API引用
import Beacons from 'react-native-beacons-android';
//藍芽串流 API引用
import BluetoothSerial from 'react-native-bluetooth-serial';
//SensorManager API
var mSensorManager = require('NativeModules').SensorManager;
//Youtube API
import YouTube from 'react-native-youtube';
//Sound API
import Sound from 'react-native-sound';
//Storage API
import RNFS from 'react-native-fs';
//ScreenBrightness API
const { ScreenBrightness } = NativeModules;




//iBeacons可排序的距離(dbm)
const nearRangRSSI = -75;
//藍芽偵測頻率(s)
const bluetoothScanFrequency = 2;
//加速器偵測頻率(ms)
const acceleratorDetectionFrequency = 2000;
//水平角度誤差(越大越遲鈍)
const angleAccuracy = 9;
//重力加速度
const gravityAcceleration = 9.8;
//斷線誤差(s)
const disconnectValue = 5;
//程式迴圈間隔(ms)
const FPS = 1000;
//偵測次數重設間隔(s)，建議至少大於iBeacons發送訊號時間的兩倍(Interval: 2588ms)
const LITI_RESET_COUNT = 8;
//震動間隔(s)
const LITI_VIBRATE = 2;



//雷達圖片
import Radar from '../drawable/radar.gif';
//音效位置
const requireAudio = 'hit_sound.mp3';
//Youtube API Key
const myYoutubeAPIKey = 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY';



//影片儲存檔案位置
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';
//VIdeo JSON
var VIDEO_JSON;
//Ibeacons的基本資訊 Array
//Index_0=Major, Index_1=minor, Index_2=VideoUri, Index_3=是否被看過, Index_4=偵測次數
const MAJOR = 0,MINOR = 1, VIDEOID = 2, VIEWED = 3 ,DECTCOUNT = 4;
var IBINFO = [];
//紀錄陣列大小
var IBEACON_LENG;



//Timer
var TIMER;



export default class MainFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		  //原始螢幕亮度
		  initScreenBrithness: 0.5,
			
		  //IBeacon 資料存放陣列
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
		  
		  //斷線誤差計數器，一開始要為0
		  counterDisconnect:0,
		  
		  //重設偵測次數計數器
		  resetDectCountCount:0,

		  //紀錄已撥放的影片數量
		  VideoISViewed: 0,
		  
		  //影片播放器參數
		  isReady: null,
		  VideoStatus: null,
		  quality: null,
		  error: null,
		  paused: false,
		  VideoId: '',
		  apikey: myYoutubeAPIKey,
		  playEndedFlag: false,
		};
		
		
		
		//抓取已閱覽紀錄
		this.GetViewVideoInfo=()=>{
			//抓取記事本內容(JSON格式)
			RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			
				//with vid_list
				VIDEO_JSON = JSON.parse(content);
				
				//將JSON資料放置IBINFO Array
				var temp_array_vid_info=[];
				var isViewedNumber=0;
				for(var i=0 ; i<VIDEO_JSON.length ; i++){
					temp_array_vid_info.push(VIDEO_JSON[i].major);
					temp_array_vid_info.push(VIDEO_JSON[i].minor);
					temp_array_vid_info.push(VIDEO_JSON[i].video_id);
					temp_array_vid_info.push(VIDEO_JSON[i].unlocked);
					temp_array_vid_info.push(0);//Index_4=偵測次數
					if(VIDEO_JSON[i].unlocked){ isViewedNumber++;	} //紀錄已看過數量
					IBINFO.push(temp_array_vid_info);
					//console.warn("temp_array_vid_info:"+temp_array_vid_info);
					temp_array_vid_info=[];
				}
				IBEACON_LENG = IBINFO.length; //總共IBeacons數量
				this.setState({
					VideoISViewed: isViewedNumber,
				});
				
				//console.warn("FETCH SUCCES");									  
			}).catch((err)=>{
				console.warn("FETCH ERROR:"+err);
				
			}).done();
			
		};
		this.GetViewVideoInfo();
		
		
		
		//音效設定
		this.playSound=()=>{
			const HitSound = new Sound(requireAudio,Sound.MAIN_BUNDLE,(error)=>{
				if(error){
					console.log('error: ',error);
				}else{
					HitSound.setSpeed(1);
					HitSound.play(()=>HitSound.release());
				}
			});
		};
		
		//亮度設定
		this.SetMAXScreenBrightness=()=>{
			
			//保存目前亮度
			ScreenBrightness.getBrightness()
			.then(brightness=>{
				//brightness range = 0~255,but api Only accepted 0~1
				this.setState({initScreenBrithness: brightness/255});
			}).catch(err=>{
				console.log('ScreenBrightness.getBrightness FAIL:'+err.message);
			});
			
			//調整最大亮度
			ScreenBrightness.setBrightness(1);
			
		};
		this.SetMAXScreenBrightness();
		
		//JavaScript ES6 添加function到此class
		this.onAccelerometerUpdate = this.onAccelerometerUpdate.bind(this);
		this.coutDectIBeacons = this.coutDectIBeacons.bind(this);
		this.pickVideoId = this.pickVideoId.bind(this);
		this.judgePlayVideo = this.judgePlayVideo.bind(this);
		this.judgeDisconnect = this.judgeDisconnect.bind(this);
		this.mainFlowControl = this.mainFlowControl.bind(this);
		this.MaxCountIBeacons = this.MaxCountIBeacons.bind(this);
		this.ResetBeaconCount = this.ResetBeaconCount.bind(this);
		this.RecodViewedNumber = this.RecodViewedNumber.bind(this);
		
		//Android 返回鍵
		BackAndroid.addEventListener('hardwareBackPress', ()=> {
			
			//釋放Timer
			clearInterval(TIMER);
			
			//release Listener
			this._beaconsDidRange.remove();
			this._Accelerometer.remove();
			
			//關閉藍芽
			BluetoothSerial.disable()
			.then((res) => 
				console.log("藍芽關閉成功"))
			.catch((err) => 
				console.log("藍芽關閉失敗 ${err}"));
				
			//復原亮度
			ScreenBrightness.setBrightness(this.state.initScreenBrithness);
	
		});
		
		//FPS(ms)觸發一次，mainFlowControl()
		TIMER = setInterval(() => { 
				//進入流程控制
				this.mainFlowControl(); 
		}, FPS);
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
		this._Accelerometer = DeviceEventEmitter.addListener('Accelerometer', (data) => 
			this.onAccelerometerUpdate(data)
		);
		
		//強制開啟藍芽
		BluetoothSerial.enable()
		.then((res) => 
			console.log("強制開啟藍芽成功"))
		.catch((err) => 
			console.log("強制開啟藍芽失敗 ${err}"));
		
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
		this._beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange',(data) => {
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
		BeaLength = beacons.length;//降低存取次數
		for (var i = 0; i < BeaLength ; i++)
		{
			//要到一定距離才計算偵測次數
			if(beacons[i].rssi >= nearRangRSSI){
				//偵測次數++
				for(var k=0;k<IBEACON_LENG;k++){
					if((beacons[i].major == IBINFO[k][MAJOR]) && (beacons[i].minor == IBINFO[k][MINOR])){
						IBINFO[k][DECTCOUNT]++;
						//console.warn(beacons[i].major + "'s Count = " + IBINFO[k][3]);
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
					
					//console.warn("iBInfo的大小:"+IBINFO.length);
					//console.warn("closeMajor:"+closeMajor+",closeMinor:"+closeMinor);
				
					//配對Major, Minor
					for(var i=0; i < IBEACON_LENG ; i++){
					
						//console.warn("IBINFO["+i+"][0]:"+IBINFO[i][0]+",IBINFO["+i+"][1]:"+IBINFO[i][1]);
						
						if((new_closeMajor == IBINFO[i][MAJOR]) && (new_closeMinor == IBINFO[i][MINOR])){
							
							//設定Uri
							this.setState({VideoId:IBINFO[i][VIDEOID]});
							
							//附近有可以辨識的IBeacons
							this.setState({haveIB: true, playEndedFlag: false});
	
							//有影片可以撥放時可以觀看，提醒使用者
							for(let j=0;j<LITI_VIBRATE;j++){
								Vibration.vibrate();
							}
							
							//播放音效
							this.playSound();

							//console.warn("VideoID="+this.state.VideoId);
							
						}//end if
					}//end for	
				}else{
					//console.warn("一樣的VideoID="+this.state.VideoId);
					
					//已撥放完影片，則不可再次撥放，需離開範圍在進入
					if(!this.state.playEndedFlag){
						
						//附近有可以辨識的IBeacons
						this.setState({haveIB: true});
						
					}//end if
					
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
			this.setState({paused:false});
			//console.warn("撥放影片:"+this.state.VideoId+", paused="+this.state.paused);
				
		}else if( flagConnect && !levelFlag && (VideoId =! null)){
			//console.warn("暫停播放");
			
			this.setState({paused:true});
				
		}else if( !flagConnect ){
				
			//附近完全沒有IBeacon
			this.setState({paused:true});
				
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
		
		for(var i=0;i<IBEACON_LENG;i++){
			if((IBINFO[i][DECTCOUNT] != 0) && (IBINFO[i][DECTCOUNT] > count)){
				count = IBINFO[i][DECTCOUNT];
				closeMajor = IBINFO[i][MAJOR];
				closeMinor = IBINFO[i][MINOR];
			}
		}//end for
		
		this.setState({
				closeMajor:closeMajor,
				closeMinor:closeMinor
		});
		
	}//end MaxCountIBeacons

	
	
	
	
	//Reset偵測次數
	ResetBeaconCount(){
		
		for(var i=0;i<IBEACON_LENG;i++){
			IBINFO[i][DECTCOUNT] = 0;
		}//end for
		//console.warn("IBeacon計數紀錄清除完成");
		
	}//end ResetBeaconCount





	//紀錄已撥放的影片數量
	RecodViewedNumber(){
		
		//連結state
		NowVideoID = this.state.VideoId;
		NowIBMinor = this.state.closeMinor;

		//搜尋
		for(let i=0;i<IBEACON_LENG;i++){
			//相同Minor and 找到ID and 沒有被看過
			if(IBINFO[i][MINOR]==NowIBMinor && IBINFO[i][VIDEOID]==NowVideoID && IBINFO[i][VIEWED]==false){

				//已看過影片數量+1
				this.setState({VideoISViewed: this.state.VideoISViewed += 1 });

				//紀錄已看過
				IBINFO[i][VIEWED] = true;
				VIDEO_JSON[i]['unlocked'] = true;
				
				//寫回vid_list.txt
				RNFS.writeFile(VIDEO_LIST_FILE , JSON.stringify(VIDEO_JSON) , 'utf8')
				.then((success)=>{
					console.warn('File WRITTEN');
					})
				.catch((err)=>
					console.warn(err.message)
				);
				
			}
		}//end for

	}//end RecodViewedNumber
	
	
	
	
	
	//渲染畫面	
	render() {
		return (
			<View style={styles.fullScreen}>
			
				<Image source={Radar} style={ (this.state.paused&&!this.state.flagConnect) ? styles.radar_show : styles.radar_hide } />

				<Text style={ (this.state.paused&&!this.state.flagConnect) ? styles.viewed_hit_show : styles.viewed_hit_hide }> 
					{"已導覽: " + this.state.VideoISViewed + "/" + IBEACON_LENG } 
				</Text>
		
				<YouTube
					videoId={ this.state.VideoId }
					play={ !this.state.paused }
					hidden={ true }
					playsInline={ true }
					controls={ 0 }
					loop={ false }
					apiKey={ myYoutubeAPIKey }
					style={ this.state.flagConnect ? styles.video_play : styles.video_paused }
					onChangeState={ (event) => { 
					
						//播放完畢時，暫停撥放
						if(event.state == 'ended'){
							
							//讓目前IBeacon斷線
							this.setState({paused: false, haveIB: false, playEndedFlag: true});

							//紀錄已撥放的影片數量
							this.RecodViewedNumber();
						}
						
					}}
				/>
			
			</View>
		);
	}//end render()	
	
	//關閉APP時的處理
	componentWillUnMount(){

	}//end componentWillUnMount
	
}//end Class





//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");





const styles = StyleSheet.create({
	fullScreen: {
		flex:1,
		backgroundColor: '#000000',
		justifyContent: "center",
		alignItems: "center",
	},
	video_play:{
		width: deviceHeight,
		height: deviceWidth,
	},
	video_paused:{
		
	},
	radar_show:{
		flex:1,
		width: 200,
		height: 200,
		resizeMode: 'contain',
	},
	radar_hide:{
		position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
		width: 0,
		height: 0,
		resizeMode: 'contain',
	},
	/*search_hit_show:{
		fontSize: 25,
	},
	search_hit_hide:{
		fontSize: 0,
	},*/
	viewed_hit_show:{
		position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
		fontSize: 20,
	},
	viewed_hit_hide:{
		fontSize: 0,
	},
});









