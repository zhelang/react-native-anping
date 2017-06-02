import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, NetInfo, BackAndroid} from "react-native";

import {Actions} from 'react-native-router-flux';//Router API
import RNFS from 'react-native-fs';//檔案寫入 API
import Toast from "@remobile/react-native-toast";//Toast APi

import Logo from '../drawable/logo.png';//引用圖片
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';//儲存檔案位置
var {height: deviceHeight,width: deviceWidth} = Dimensions.get("window");//取得裝置螢幕大小
const WELCOME_TIME = 3000;//開啟延遲時間
var TIMER;



export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(0)//畫面起始位置
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
    }//end componentDidMount

	
	
	
	fetchVideoData(){

		//抓取記事本內容(JSON格式)
        RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			
			TIMER = setTimeout(() => {this.jumpStartButtonPage()}, WELCOME_TIME);
                                                      
        }).catch((err)=>{
			console.log("ERROR MESSAGE:"+err);
			
			//如果沒有抓到vid_list.txt
			//則自動生成一個vid_list.txt檔
			//此處可改成用Fetch網頁的JSON資料，增加彈性
			let filePath =  VIDEO_LIST_FILE;
			let vid_info = [
                            {title:'海關緣起' , 'body':'' , vid:1 , unlocked:false , 'video_id': 'W0FodgQtRYI' , "major" : "10001" , "minor" : "1001"},
                            {title:'長型辦事桌' , 'body':'' , vid:2 , unlocked:false , 'video_id': 'VixuvOP6f1g' , "major" : "10001" , "minor" : "1002"},
                            {title:'外部屋頂' , 'body':'' , vid:3 , unlocked:false , 'video_id': 'N_Mc77T_LG0' , "major" : "10001" , "minor" : "1000"},
                            {title:'內部天花板' , 'body':'' , vid:4 , unlocked:false , 'video_id': 'jFX83WI9y0E' , "major" : "10001" , "minor" : "1003"},
                            {title:'廣播室' , 'body':'人員休息室' , vid:5 , unlocked:false , 'video_id': 'JXJgtAF-2QI' , "major" : "10001" , "minor" : "1004"},
							{title:'報關室' , 'body':'' , vid:6 , unlocked:false , 'video_id': 'IjDaMvYsE4E' , "major" : "10001" , "minor" : "1005"},
                            {title:'礙子' , 'body':'' , vid:7 , unlocked:false , 'video_id': 'khz1S5qEEus' , "major" : "10001" , "minor" : "1006"},
                            {title:'編竹夾泥牆' , 'body':'' , vid:8 , unlocked:false , 'video_id': 'CpbCjoADc8U' , "major" : "10001" , "minor" : "1007"},
							{title:'日式玻璃工坊' , 'body':'' , vid:9 , unlocked:false , 'video_id': 'iYr0taFGaag' , "major" : "10001" , "minor" : "1008"},
							{title:'海關工作流程' , 'body':'機船進出、報關繳稅' , vid:10 , unlocked:false , 'video_id': '-j8lrgMWP2A' , "major" : "10001" , "minor" : "1009"},
			];
			RNFS.writeFile(filePath , JSON.stringify(vid_info) , 'utf8').then((success)=>{console.log('File WRITTEN:'+filePath);}).catch((err)=>console.warn(err.message));                                                       
			
			//跳轉畫面
			TIMER = setTimeout(() => {this.jumpStartButtonPage()}, WELCOME_TIME);
			
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
    }//end render
	
	
	
	componentWillUnmount(){
		if(TIMER!=null){
			clearTimeout(TIMER);
			TIMER = null;
		}
	}//end componentWillUnmount
	
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
