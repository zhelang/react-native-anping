import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, NetInfo} from "react-native";

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



export default class extends React.Component {
    constructor(props){
        super (props);

		//畫面起始位置
        this.state = {
            offset: new Animated.Value(-deviceHeight)
        };
		
		NetInfo.isConnected.fetch().then(isConnected => {
			if(!isConnected){
				Toast.showShortBottom("Please Open Network.\n請開啟網路");
			}
		});
		
		this.jumpStartButtonPage = this.jumpStartButtonPage.bind(this);
		this.jumpFirstGuidPage = this.jumpFirstGuidPage.bind(this);
		this.fetchVideoData = this.fetchVideoData.bind(this);
    }

	
	
	
	
    componentWillMount(){
		
		//預先抓取資料
		this.fetchVideoData();
		
    }

	
	
	
	
    componentDidMount() {
		
		//開啟此頁面(WelcomePage)特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
	
    }

	
	
	
	fetchVideoData(){

		//抓取記事本內容(JSON格式)
        RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			//跳轉MainFunctionPage
			setTimeout(() => {
				this.jumpStartButtonPage()  //origin Actions.home()
			}, WELCOME_TIME);
			//console.warn("抓到Local資料囉");
                                                      
        }).catch((err)=>{
			//如果沒有抓到vid_list.txt
			//則自動生成一個vid_list.txt檔
			//此處可改成用Fetch網頁的JSON資料，增加彈性
			
			var filePath =  VIDEO_LIST_FILE;
			var vid_info = [
                            {title:'number 1' , 'body':'This is vid 1' , vid:1 , unlocked:false , 'video_id': '2x5XUlLbvn8' , "major" : "10001" , "minor" : "1000"},
                            {title:'number 2' , 'body':'This is vid 2' , vid:2 , unlocked:false , 'video_id': 'T5i-MDRfEYI' , "major" : "10001" , "minor" : "1001"},
                            {title:'number 3' , 'body':'This is vid 3' , vid:3 , unlocked:false , 'video_id': '8yOvsVQKJMs' , "major" : "10001" , "minor" : "1002"},
                            {title:'number 4' , 'body':'This is vid 4' , vid:4 , unlocked:false , 'video_id': 's-m_9RmUNNU' , "major" : "10001" , "minor" : "1003"},
                            {title:'number 5' , 'body':'This is vid 5' , vid:5 , unlocked:false , 'video_id': 'sMyHnZ4lV54' , "major" : "10001" , "minor" : "1004"},
							{title:'number 6' , 'body':'This is vid 6' , vid:6 , unlocked:false , 'video_id': 'oleKA8j841w' , "major" : "10001" , "minor" : "1005"},
                            {title:'number 7' , 'body':'This is vid 7' , vid:7 , unlocked:false , 'video_id': 'A8NlljMtsIY' , "major" : "10001" , "minor" : "1006"},
                            {title:'number 8' , 'body':'This is vid 8' , vid:8 , unlocked:false , 'video_id': '4cjrYBj81Ko' , "major" : "10001" , "minor" : "1007"},
							{title:'number 9' , 'body':'This is vid 9' , vid:9 , unlocked:false , 'video_id': '4cjrYBj81Ko' , "major" : "61577" , "minor" : "38355"},
			];
			
			console.log("ERROR MESSAGE:"+err);

			RNFS.writeFile(filePath , JSON.stringify(vid_info) , 'utf8').then((success)=>{console.log('File WRITTEN:'+filePath);}).catch((err)=>console.warn(err.message));                                                       
			
			//跳轉初次導覽畫面
			setTimeout(() => {
				this.jumpStartButtonPage()  //origin Actions.home()
			}, 2500);
			
        }).done();
	}//end fetchVideoData()
	
	
	
	jumpStartButtonPage(){
		Actions.startbutton_page();
	}
	
	
	
	jumpFirstGuidPage(){
		Actions.firstguid_page();
	}
	
	
	
	componentWillReceiveProps(){

	}
	
	
    render(){
        return (
            <Animated.View style={[styles.container, {backgroundColor:"#FFFFFF"},
                                  {transform: [{translateY: this.state.offset}]}]}>
				
                    <View style={{  width:deviceWidth,
                                    height:deviceHeight,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor:"white" }}>
								
						<Image source={Logo} style={styles.logo}/>				
						
                    </View>
            </Animated.View>
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
