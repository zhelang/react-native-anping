import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, NetInfo, BackAndroid} from "react-native";

//Router API
import {Actions} from 'react-native-router-flux';
//檔案寫入 API
import RNFS from 'react-native-fs';
//Toast APi
import Toast from "@remobile/react-native-toast";

//引用圖片
import Logo from '../drawable/logo.png';
//儲存檔案位置
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';
//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");
//開啟延遲時間
const WELCOME_TIME = 3000;
var TIMER;



export default class extends React.Component {
    constructor(props){
        super (props);

		//畫面起始位置
        this.state = {
            offset: new Animated.Value(0)
        };

		this.jumpStartButtonPage = this.jumpStartButtonPage.bind(this);
		this.fetchVideoData = this.fetchVideoData.bind(this);
		
    }//end constructor

	
	
	
	
    componentWillMount(){
		
    }//end componentWillMount

	
	
	
	
    componentDidMount() {
		//預先抓取資料
		this.fetchVideoData();
		NetInfo.isConnected.fetch().then(isConnected => {
			if(!isConnected){
				Toast.showShortBottom("Please Open Network.\n請開啟網路");
			}
		});
		//Android 返回鍵
		BackAndroid.addEventListener('hardwareBackPress', ()=>{
			if(TIMER!=null){
				clearTimeout(TIMER);
			}
		});
    }//end componentDidMount

	
	
	
	fetchVideoData(){

		//抓取記事本內容(JSON格式)
        RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			
			TIMER = setTimeout(() => {
				this.jumpStartButtonPage()  //origin Actions.home()
			}, WELCOME_TIME);
			
			//console.warn("抓到Local資料囉");
                                                      
        }).catch((err)=>{
			//如果沒有抓到vid_list.txt
			//則自動生成一個vid_list.txt檔
			//此處可改成用Fetch網頁的JSON資料，增加彈性
			
			var filePath =  VIDEO_LIST_FILE;
			var vid_info = [
                            {title:'Video1' , 'body':'長型辦事桌' , vid:1 , unlocked:false , 'video_id': 'mN29xGSK3po' , "major" : "10001" , "minor" : "1000"},
                            {title:'Video2' , 'body':'安平海關名稱演變' , vid:2 , unlocked:false , 'video_id': 'PAsQAvi8-3Y' , "major" : "10001" , "minor" : "1001"},
                            {title:'Video3' , 'body':'海關屋頂' , vid:3 , unlocked:false , 'video_id': 'N_Mc77T_LG0' , "major" : "10001" , "minor" : "1002"},
                            {title:'Video4' , 'body':'海關天花板' , vid:4 , unlocked:false , 'video_id': 'jFX83WI9y0E' , "major" : "10001" , "minor" : "1003"},
                            {title:'Video5' , 'body':'人員休息室\n廣播室' , vid:5 , unlocked:false , 'video_id': 'JXJgtAF-2QI' , "major" : "10001" , "minor" : "1004"},
							{title:'Video6' , 'body':'報關室' , vid:6 , unlocked:false , 'video_id': 'IjDaMvYsE4E' , "major" : "10001" , "minor" : "1005"},
                            {title:'Video7' , 'body':'礙子' , vid:7 , unlocked:false , 'video_id': 'khz1S5qEEus' , "major" : "10001" , "minor" : "1006"},
                            {title:'Video8' , 'body':'編竹夾泥牆' , vid:8 , unlocked:false , 'video_id': 'CpbCjoADc8U' , "major" : "10001" , "minor" : "1007"},
							{title:'Video9' , 'body':'日式玻璃工坊' , vid:9 , unlocked:false , 'video_id': 'iYr0taFGaag' , "major" : "10001" , "minor" : "1008"},
							{title:'Video10' , 'body':'海關工作流程：機船進出、報關繳稅' , vid:10 , unlocked:false , 'video_id': '-j8lrgMWP2A' , "major" : "10001" , "minor" : "1009"},
			];
			
			console.log("ERROR MESSAGE:"+err);

			RNFS.writeFile(filePath , JSON.stringify(vid_info) , 'utf8').then((success)=>{console.log('File WRITTEN:'+filePath);}).catch((err)=>console.warn(err.message));                                                       
			
			TIMER = setTimeout(() => {
				this.jumpStartButtonPage()  //origin Actions.home()
			}, WELCOME_TIME);
			
        }).done();
		
	}//end fetchVideoData()
	
	
	
	jumpStartButtonPage(){
		Actions.pop();
	}


	
    render(){
        return (
            <View style={[styles.container, {backgroundColor:"#FFFFFF"}]}>
                    <View style={{  width:deviceWidth,
                                    height:deviceHeight,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor:"white" }}>
						<Image source={Logo} style={styles.logo}/>				
                    </View>
            </View>
        );
    }
	
}//end class



var styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"transparent",
        justifyContent: "center",
        alignItems: "center",
    },
	logo:{
		width: 175,
		height: 175,
		resizeMode: Image.resizeMode.contain,
	},
});
