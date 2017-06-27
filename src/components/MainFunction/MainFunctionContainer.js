/*
此page主要功能：

 0.讀取vid_list.txt
 1.iBeacon偵測距離
 2.震動 提醒指定距離到了
 3.加速器偵測水平時，才可以播放影片；否則震動提示
 4.水平時且距離近，則顯示影片
 5.看完影片時，則寫回vid_list.txt已閱覽過

*/
import React, {Component}  from 'react';
import {StyleSheet,Text,View,DeviceEventEmitter,Vibration,BackAndroid,TouchableOpacity,Image,Dimensions,AsyncStorage,NativeModules,NetInfo} from 'react-native';
import Beacons from 'react-native-beacons-android';//ibeacons API引用
var mSensorManager = require('NativeModules').SensorManager;//SensorManager API
import YouTube from 'react-native-youtube';//Youtube API
import Sound from 'react-native-sound';//Sound API//Sound API
import RNFS from 'react-native-fs';//Storage API
const { ScreenBrightness } = NativeModules;//ScreenBrightness API
import {Actions} from 'react-native-router-flux';//Router API
import Toast from "@remobile/react-native-toast";//Toast APi



//取得裝置螢幕大小
const {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");





const CONFIG={
	nearRangRSSI : -100,//iBeacons可排序的距離(dbm)
	bluetoothScanFrequency : 1,//iBeacons掃描週期(s)
	acceleratorDetectionFrequency : 2000,//加速器偵測頻率(ms)
	ANGLE_ACC : 6.5,//水平角度誤差(越大越遲鈍)
	disconnectValue : 3,//斷線誤差(s)
	FPS : 1000,//程式迴圈間隔(ms)
	LITI_RESET_COUNT : 7,//偵測次數重設間隔(s)，建議至少大於iBeacons發送訊號時間的兩倍(Interval: 2588ms)
	LITI_VIBRATE : 2,//震動間隔(s)
	myYoutubeAPIKey : 'AIzaSyARyHtNd7_R3r4ZCaEow8DkbHX4K3TTpwY',//Youtube API Key
	VIDEO_LIST_FILE : RNFS.DocumentDirectoryPath + '/vid_list.txt',//影片儲存檔案位置
	OPENSCAN_TIME : 1500,//恢復掃描間隔
};



//雷達圖片
import img_Radar from '../../images/radar.gif';
//音效位置
const sound_Hit = 'hit_sound.mp3';




var BUFFER_IBEACONS_ARRAY = [];//Receive iBeacons buffer array
var VIDEO_JSON;//VIdeo JSON
var IBINFO = [];//Ibeacons的基本資訊 Array
const MAJOR = 0,MINOR = 1, VIDEOID = 2, VIEWED = 3 ,DECTCOUNT = 4;//Index_0=Major, Index_1=minor, Index_2=VideoUri, Index_3=是否被看過, Index_4=偵測次數
var IBEACON_LENG;//紀錄陣列大小



//Listener
var TIMER, TIME_OPENSCAN;
var BeaconsDidRange_Listener;
var Accelerometer_Listener;



export default class MainFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  initScreenBrithness: 0.5, //原始螢幕亮度
		  closeMajor:null,//最近的IBeaon資訊
		  closeMinor:null,
		  counterDisconnect:0,//斷線誤差計數器，一開始要為0
		  resetDectCountCount:0,//重設偵測次數計數器
		  VideoISViewed: 0,//紀錄已撥放的影片數量
		  flagFirstGuid: false,//第一次播放影片flag
		  playEndedFlag: false,
		  videoID: '',
		};
		
		//JavaScript ES6 添加function到此class
		this.onAccelerometerUpdate = this.onAccelerometerUpdate.bind(this);
		this.countDectIBeacons = this.countDectIBeacons.bind(this);
		this.pickVideoId = this.pickVideoId.bind(this);
		this.judgePlayVideo = this.judgePlayVideo.bind(this);
		this.judgeDisconnect = this.judgeDisconnect.bind(this);
		this.mainFlowControl = this.mainFlowControl.bind(this);
		this.maxCountIBeacons = this.maxCountIBeacons.bind(this);
		this.resetBeaconCount = this.resetBeaconCount.bind(this);
		this.recordViewedNumber = this.recordViewedNumber.bind(this);
		this.playSound = this.playSound.bind(this);
		this.backButtonFunction = this.backButtonFunction.bind(this);
		this.scanButtonFunction = this.scanButtonFunction.bind(this);
		this.exitScan = this.exitScan.bind(this);
		this.openScan = this.openScan.bind(this);
		this.judgeFirstGuid = this.judgeFirstGuid.bind(this);
		this.getViewVideoInfo = this.getViewVideoInfo.bind(this);
		this.setMAXScreenBrightness = this.setMAXScreenBrightness.bind(this); 

	}//end constructor
	
	
	
	
	
	//Use this as an opportunity to perform preparation before an update occurs. 
	componentWillMount() {
		
	}

		
	
	//Use this as an opportunity to operate on the DOM when the component has been updated. 
	componentDidMount() {
		
		if(this.props.network.flagNetwork){
			this.getViewVideoInfo();//抓取已閱覽紀錄
			this.setMAXScreenBrightness();//最大亮度設定

			//加速器偵測事件
			Accelerometer_Listener = DeviceEventEmitter.addListener('Accelerometer', (data) => {
				this.onAccelerometerUpdate(data);
			});
			mSensorManager.startAccelerometer(CONFIG.acceleratorDetectionFrequency);//開始加速器偵測(ms)
			
			Beacons.setBackgroundBetweenScanPeriod( CONFIG.bluetoothScanFrequency );//iBeacons的掃描的間隔時間(s)
			Beacons.detectIBeacons();//開始偵測iBeacon
			//開啟iBecons Ranging(測距)
			Beacons.startRangingBeaconsInRegion('REGION1').then(() => 
				console.log('Beacons ranging started succesfully')
			)
			.catch(error => 
				console.log('Beacons ranging not started, error: ${error}')
			);
			//iBecons Ranging的事件
			BeaconsDidRange_Listener = DeviceEventEmitter.addListener('beaconsDidRange',(data) => {			
				//儲存資料(data.beacons是陣列內容)
				BUFFER_IBEACONS_ARRAY = data.beacons;			
			});
			
			//backbutton listener(android)
			BackAndroid.addEventListener('hardwareBackPress', () => {
				//if youtube player is playying, stop it
				if (this.props.videoPlayer.flagPlay) {
					this.props.actions.pausedVideo();
					this.props.actions.notSignalBeacons();
					this.props.actions.disconnectBeacon();
					this.setState({playEndedFlag: true, flagFirstGuid: false});
					return true;
				}
				return false;
			});

			//開始mainFlowControl()
			TIMER = setInterval(() => { this.mainFlowControl(); }, CONFIG.FPS);
		}//end if
	}//end componentDidMount()

	
	
	
	
	
	//更新加速器狀態
	onAccelerometerUpdate(data){

		/*Toast.showShortBottom("Play="+this.props.videoPlayer.flagPlay+
							", ScanBeacons="+this.props.scanBeaconManager.flagScanBeacons+
							", SignalBeaoncs="+this.props.scanBeaconManager.flagSignalBeacons+
							", ConnectBeacon="+this.props.scanBeaconManager.flagConnectBeacon+
							", Level="+this.props.levelPhone.flagLevel
							);*/
		
		//掃描到IB則判斷水平
		if(this.props.scanBeaconManager.flagSignalBeacons){
			//連接Sate
			let _levelFlag = false;
			//手機水平時
			if( ((data.x>=-CONFIG.ANGLE_ACC) && (data.y>=-CONFIG.ANGLE_ACC)&&(data.y<=CONFIG.ANGLE_ACC)) && (data.z>=CONFIG.ANGLE_ACC) ){
				_levelFlag = true;
			}//end if

			//存回State
			if(_levelFlag!=this.props.levelPhone.flagLevel){
				if(_levelFlag){
					this.props.actions.levelPhone();
				}else{
					this.props.actions.verticalPhone();
				}
				Toast.showShortBottom("flagLevel="+this.props.levelPhone.flagLevel);
			}//end if
		}//end if
		//console.warn('acc.x='+data.x+', acc.y='+data.y+', acc.z='+data.z+', levelFlag='+levelFlag);
		
	}//end onAccelerometerUpdate
	
	
	
	
	
	//流程控制
	mainFlowControl(){
		//console.warn('mainFlowControl');
		
		//目前已有連線的Ibeacons，則不再偵測Ibeacons
		if(!this.props.scanBeaconManager.flagSignalBeacons){
			//Step_1:計數偵測到的IBeacons
			this.countDectIBeacons();
			
			//Step_2:Pick out video id
			this.pickVideoId();
		}//end if
		
		//Step_3:Judge Play Video
		this.judgePlayVideo();
		
		//Step_4:judgment Disconnect
		this.judgeDisconnect();
	}//end mainFlowControl
  
  
  
  

	//Step_1:計數iBecons偵測次數(參數beconData是陣列)
	countDectIBeacons(){
		
		//先連結State
		let beacons = BUFFER_IBEACONS_ARRAY;
		let closeMajor = this.state.closeMajor;
		let closeMinor = this.state.closeMinor;
		
		//讀取抓取的ibeaconData
		BeaLength = beacons.length;//降低存取次數
		for (let i = 0; i < BeaLength ; i++)
		{
			//要到一定距離才計算偵測次數
			if(beacons[i].rssi >= CONFIG.nearRangRSSI){
				//偵測次數++
				for(let k=0;k<IBEACON_LENG;k++){
					if((beacons[i].major == IBINFO[k][MAJOR]) && (beacons[i].minor == IBINFO[k][MINOR])){
						IBINFO[k][DECTCOUNT]++;
						//console.warn(beacons[i].major + "'s Count = " + IBINFO[k][3]);
					}//end if
				}//end for k	
			}//end if
		}//end for i
	}//end coutDectIBeacons()
	
	
	
	
	//Step_2:選出Uri
	pickVideoId(){
		
		//連結state
		let resetDectCountCount = this.state.resetDectCountCount;
		let old_closeMajor = this.state.closeMajor;
		let old_closeMinor = this.state.closeMinor;
		let _flagSignalBeacon = false;//回復狀態，避免有不可辨識的IBeacons
		
		resetDectCountCount++;
		
		//次數到了
		if( (resetDectCountCount >= CONFIG.LITI_RESET_COUNT) && !this.state.flagFirstGuid ){
			
			//console.warn("次數到了");
			
			//選出最大的Count IBeacon
			this.maxCountIBeacons();
			
			let new_closeMajor = this.state.closeMajor;
			let new_closeMinor = this.state.closeMinor;
			
			//如果有抓到較近的iBeacon 且 目前無撥放的影片
			if(new_closeMajor != null && new_closeMinor != null){
				
				//如果與上一個最接近的不一樣，則重新抓取VideoID
				if( !((old_closeMajor == new_closeMajor) && (old_closeMinor == new_closeMinor)) ){
					
					//console.warn("iBInfo的大小:"+IBINFO.length);
					//console.warn("closeMajor:"+closeMajor+",closeMinor:"+closeMinor);
				
					//配對Major, Minor
					for(let i=0; i < IBEACON_LENG ; i++){
					
						//console.warn("IBINFO["+i+"][0]:"+IBINFO[i][0]+",IBINFO["+i+"][1]:"+IBINFO[i][1]);
						
						if((new_closeMajor == IBINFO[i][MAJOR]) && (new_closeMinor == IBINFO[i][MINOR])){
							
							//設定Uri,附近有可以辨識的IBeacons
							_flagSignalBeacon = true;
							this.props.actions.playVideo( IBINFO[i][VIDEOID] );
							this.setState({videoID: IBINFO[i][VIDEOID], playEndedFlag: false});
	
							//有影片可以撥放時可以觀看，提醒使用者
							for(let j=0;j<CONFIG.LITI_VIBRATE;j++){ Vibration.vibrate(); }
							
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
						_flagSignalBeacon = true;
						
					}//end if
					
				}//end if
			}//end if
			
			if(_flagSignalBeacon!=this.props.scanBeaconManager.flagSignalBeacons){
				if(_flagSignalBeacon){
					this.props.actions.signalBeacons();
				}else{
					this.props.actions.notSignalBeacons();
				}
			}//end if
			
			//重設偵測次數計數器
			resetDectCountCount = 0;
			this.resetBeaconCount();
		
		}//end if
		
		this.setState({resetDectCountCount: resetDectCountCount});
		
	}//end pickVideoId
	
	
	
	
	
	//Step_3:判斷是否可以撥放
	judgePlayVideo(){	
		//連結state
		const _flagConnectBeacon = this.props.scanBeaconManager.flagConnectBeacon;
		const _levelFlag = this.props.levelPhone.flagLevel;
		const _videoID = this.state.videoID;
		let _flagPlay = false;
			
		if( !( _videoID===null) && _flagConnectBeacon && _levelFlag ){
			_flagPlay=true;
		}else{
			_flagPlay=false;
		}//end if
		
		if(_flagPlay != this.props.videoPlayer.flagPlay){
			if(_flagPlay){
				this.props.actions.playVideo(this.state.videoID);
			}else{
				this.props.actions.pausedVideo();
			}//end if
		}//end if
		
	}//end judgePlayVideo
	
	
	
	
	
	//Step_4 斷線判斷
	judgeDisconnect(){
		
		//取得State
		let counterDisconnect = this.state.counterDisconnect;
		let _flagConnectBeacon = this.props.scanBeaconManager.flagConnectBeacon;
		const _flagFirstGuid = this.state.flagFirstGuid;
		const _flagSignalBeacon = this.props.scanBeaconManager.flagSignalBeacons;
		
		
		//console.warn("haveIB="+haveIB);
		if(_flagSignalBeacon){//周圍有IBeacons
			
			//計數器復原
			counterDisconnect = CONFIG.disconnectValue;
			
		}else{//周圍沒有IBeacons
			
			//計數器--
			counterDisconnect--;
		}
		
		//console.warn("counterDisconnect="+counterDisconnect);
		if( (counterDisconnect > 0) || _flagFirstGuid){
			//連線
			_flagConnectBeacon = true;
		}else{
			//斷線
			_flagConnectBeacon = false;
		}
		
		//回存計數器
		if(_flagConnectBeacon!=this.props.scanBeaconManager.flagConnectBeacon){
			if(_flagConnectBeacon){
				this.props.actions.connectBeacon();
			}else{
				this.props.actions.disconnectBeacon();
			}
		}//end if
		
		this.setState({
			counterDisconnect:counterDisconnect,
		});
		
	}//end judgeDisconnect()

	
	
	
	
	//挑出偵測次數最高的iBeacons
	maxCountIBeacons(){
		let count=0;
		let closeMajor=null;
		let closeMinor=null;
		
		for(let i=0;i<IBEACON_LENG;i++){
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
		
	}//end maxCountIBeacons

	
	
	
	
	//Reset偵測次數
	resetBeaconCount(){
		
		for(let i=0;i<IBEACON_LENG;i++){
			IBINFO[i][DECTCOUNT] = 0;
		}//end for
		//console.warn("IBeacon計數紀錄清除完成");
		
	}//end resetBeaconCount





	//紀錄已撥放的影片數量
	recordViewedNumber(){
		
		//連結state
		NowVideoID = this.state.videoID;
		NowIBMinor = this.state.closeMinor;

		//搜尋
		for(let i=0;i<IBEACON_LENG;i++){
			//相同Minor and 找到ID and 沒有被看過
			if(IBINFO[i][MINOR]==NowIBMinor && IBINFO[i][VIDEOID]==NowVideoID && IBINFO[i][VIEWED]==false){

				//已看過影片數量+1
				this.setState({VideoISViewed: this.state.VideoISViewed += 1 ,vIdeoID: ''});

				//紀錄已看過
				IBINFO[i][VIEWED] = true;
				VIDEO_JSON[i]['unlocked'] = true;
				
				//寫回vid_list.txt
				RNFS.writeFile(CONFIG.VIDEO_LIST_FILE , JSON.stringify(VIDEO_JSON) , 'utf8')
				.then((success)=>{
					//console.warn('File WRITTEN');
					})
				.catch((err)=>
					console.log(err.message)
				);
			}else{
				//console.warn("紀錄失敗 IBINFO["+i+"][VIEWED] = " + IBINFO[i][VIEWED]);
			}
		}//end for

	}//end RecodViewedNumber
	

	
	setMAXScreenBrightness(){
		
		//保存目前亮度
		ScreenBrightness.getBrightness().then( brightness =>{
			//brightness range = 0~255,but api Only accepted 0~1
			this.setState({initScreenBrithness: brightness/255});
		}).catch(err=>{
			console.log('ScreenBrightness.getBrightness FAIL:'+err.message);
		});
			
		//調整最大亮度
		ScreenBrightness.setBrightness(1);
			
	}//end setMAXScreenBrightness
	
	
	
	getViewVideoInfo(){
		//抓取記事本內容(JSON格式)
		RNFS.readFile(CONFIG.VIDEO_LIST_FILE).then((content)=>{    
			
			//with vid_list
			VIDEO_JSON = JSON.parse(content);
				
			//將JSON資料放置IBINFO Array
			let temp_array_vid_info=[];
			let isViewedNumber=0;
			for(let i=0 ; i<VIDEO_JSON.length ; i++){
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
			IBEACON_LENG = VIDEO_JSON.length; //總共IBeacons數量
			this.setState({VideoISViewed: isViewedNumber,});
			//console.log("FETCH SUCCES");
			
			//判斷是否第一次導覽
			this.judgeFirstGuid();
									  
		}).catch((err)=>{
			console.log("FETCH ERROR:"+err);
				
		}).done();
			
	}//end GetViewVideoInfo
	
	
	
	judgeFirstGuid(){
		//目前沒有在第一次導覽&沒有看過影片&有網路，則播放第一次導覽教學影片
		if(!this.state.flagFirstGuid && this.state.VideoISViewed==0 && this.props.network.flagNetwork){
			
			//目前正在第一次導覽
			this.props.actions.playVideo( IBINFO[0][VIDEOID] );
			this.props.actions.signalBeacons();
			this.setState({flagFirstGuid: true,
							closeMinor: IBINFO[0][MINOR],
							playEndedFlag: false,
							videoID: IBINFO[0][VIDEOID],
			});
		}//end if
	}//end judgeFirstGuid
	
	
	
	//音效設定
	playSound(){
		const HitSound = new Sound(sound_Hit ,Sound.MAIN_BUNDLE,(error)=>{
			if(error){
				console.log('playSound error: ',error);
			}else{
				HitSound.setSpeed(1);
				HitSound.play(()=>HitSound.release());
			}
		});
	}//end playSound
	
	
	
	openScan(){
		//撥放結束後重新開啟掃描功能
		this.props.actions.notSignalBeacons();
		//清除Timer
		if(TIME_OPENSCAN!=null){
			clearTimeout(TIME_OPENSCAN);
			TIME_OPENSCAN = null;
		}
	}//end openScan
	
	
	
	
	
	//返回鍵
	backButtonFunction(){
		Actions.pop();
	}//end backButtonFunction()
	
	
	
	
	
	//Scan 開關
	scanButtonFunction(){
		
		_flagScanBeacons = this.props.scanBeaconManager.flagScanBeacons;
		
		if(_flagScanBeacons){
			//關閉掃描
			if(TIMER!=null){
				clearInterval(TIMER);
				TIMER = null;
				_flagScanBeacons = false;
				Toast.showShortBottom("停止掃描iBeacons");
			}//end if
		}else{
			if(this.props.network.flagNetwork){
				if(TIMER==null){	
					TIMER = setInterval( () => {this.mainFlowControl();}, CONFIG.FPS);
					_flagScanBeacons = true;
					Toast.showShortBottom("開始掃描iBeacons");
				}//end if
			}else{
				Toast.showShortBottom("Please open Network");
			}//end if
		}//end if
		
		if(_flagScanBeacons){
			this.props.actions.scanBeacons();
		}else{
			this.props.actions.stopScanBeacons();
		}//end if
		
	}//end scanButtonContainer
	
	
	
	
	
	//exit scan ibeacons
	exitScan(){
		
		//Stop VIdeo Player
		if(this.props.videoPlayer.flagPlay){this.props.actions.pausedVideo();}

		//釋放Timer
		if(TIMER!=null){
			clearInterval(TIMER);
			TINER = null;
		}
		if(TIME_OPENSCAN!=null){
			clearTimeout(TIME_OPENSCAN);
			TIME_OPENSCAN = null;
		}
				
		//Release Listener
		BeaconsDidRange_Listener.remove();
		Accelerometer_Listener.remove();
			
		//復原亮度
		ScreenBrightness.setBrightness(this.state.initScreenBrithness);
		
	}//end exitScan()
	
	
	
	
	
	//渲染畫面	
	render() {
		return (
			<View style={styles.fullScreen}>
			
				<TouchableOpacity style={  styles.backbuttonContainer } onPress={()=>{ this.backButtonFunction(); }}>
						<View>
							<Text>Back</Text>
						</View>
				</TouchableOpacity>
				
				<TouchableOpacity style={  styles.scanButtonContainer } onPress={()=>{ this.scanButtonFunction(); }}>
						<View>
							<Text> {this.props.scanBeaconManager.flagScanBeacons ? "Scan" : "Stop"} </Text>
						</View>
				</TouchableOpacity>
			
				<Image source={ img_Radar } style={ ( !this.props.videoPlayer.flagPlay && !this.props.scanBeaconManager.flagConnectBeacon && this.props.scanBeaconManager.flagScanBeacons) ? styles.radar_show : styles.radar_hide } />
				
				<Text style={ (this.props.network.flagNetwork) ? styles.viewed_hit_hide : styles.viewed_hit_show }> 
					請開啟網路{'\n'}
					Please open network.
				</Text>

				<YouTube
					videoId={ this.props.videoPlayer.videoID }
					play={ this.props.videoPlayer.flagPlay }
					hidden={ false }
					playsInline={ true }
					fs={ false }
					rel={ false }
					loop={ false }
					modestbranding={ true }
					controls={ 0 }
					showinfo = { true }
					apiKey={ CONFIG.myYoutubeAPIKey }
					style={ ( this.props.scanBeaconManager.flagConnectBeacon && this.props.network.flagNetwork) ? styles.video_play : styles.video_paused }
					onChangeState={ (event) => { 
						//播放完畢時，暫停撥放
						if(event.state == 'ended'){
							this.props.actions.pausedVideo();
							this.props.actions.disconnectBeacon();
							//讓目前IBeacon斷線
							this.setState({playEndedFlag: true, flagFirstGuid: false});
							//紀錄已撥放的影片數量
							this.recordViewedNumber();
							//回復掃描功能
							TIME_OPENSCAN = setTimeout(() => {this.openScan()}, CONFIG.OPENSCAN_TIME);
						}//end if
					}}
				/>
			</View>
		);
	}//end render()	
	
	
	
	//關閉APP時的處理
	componentWillUnmount(){
		this.exitScan();
		//remove backbutton listener
		BackAndroid.removeEventListener('hardwareBackPress', () => {});
	}//end componentWillUnMount
	
}//end Class





const styles = StyleSheet.create({
	fullScreen: {
		flex:1,
		backgroundColor: '#000000',
		justifyContent: "center",
		alignItems: "center",
	},
	video_play:{
		width: deviceWidth*0.95,
		height: deviceHeight*0.95,
	},
	video_paused:{
		//留白，播放不順利可維持畫面
	},
	backbuttonContainer:{
		position: "absolute",
		top: 10,
		width: 50,
		left: 10,
		justifyContent: 'center',
		alignItems: 'center',
		//borderColor:'green',
		//borderWidth:1,
	},
	scanButtonContainer:{
		position: "absolute",
		top: 10,
		width: 50,
		right: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	radar_show:{
		position: "absolute",
		bottom:0,
		left: (deviceWidth/2) - (200/2),
		width: 200,
		height: 200,
		resizeMode: 'contain',
		opacity: 0.7,
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
		fontSize: 20,
	},
	viewed_hit_hide:{
		fontSize: 0,
	},
});









