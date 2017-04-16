import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";

//取得圖片位置
import VideoListBtnSrc from '../drawable/btn_video_list.png';

//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");

//倒數計時器
var TIMER;
//倒數器間隔=100ms
const TIMER_INERVAL = 1000;
const TIMER_TIME = 8;



export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),//畫面起始位置
			timer: TIMER_TIME, //倒數計時
			flagGoScanPage: true
        };
		
		//JaveScript SE6 添加Function到此Class
		this.playPressing = this.playPressing.bind(this);
		this.jumpMainFunctionPage = this.jumpMainFunctionPage.bind(this);
		this.goScanPage = this.goScanPage.bind(this);
		
    }//end constructor
	
	
	
	

    componentWillMount(){

    }
	
	
	
	

    componentDidMount() {
		
		//開啟此頁面(WelcomePage)特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
		
		this.goScanPage();

    }//end componentDidMount
	
	
	
	//
	goScanPage(){
		
		this.setState({flagGoScanPage: !this.state.flagGoScanPage});
		if(this.state.flagGoScanPage){
			//開始倒數
			TIMER = setInterval(() => {
				this.jumpMainFunctionPage()  
			}, TIMER_INERVAL);
		}else{
			//暫停倒數
			clearInterval(TIMER);
		}//end if
		
	}//end goScanPage
	
	
	
	//
	jumpMainFunctionPage(){
		
		currentTime = this.state.timer - TIMER_INERVAL/1000;
		if(currentTime<=0){
			//clear timer
			clearInterval(TIMER);
			this.state = {
				timer: TIMER_TIME, //倒數計時
				flagGoScanPage: true
			};
			//跳轉頁面
			Actions.pop();
			Actions.startbutton_page();
			Actions.mainfunction_page();
		}else{
			this.setState({
				timer: currentTime,
			});
		}//end if
		
	}//end jumpMainFunctionPage()
	
	
	jumpVideoListPage(){
		//clear timer
		clearInterval(TIMER);
		Actions.videolist_page();
	}
	
	

    closeModal() {
		
		//跳轉MainFunctionPage特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: deviceHeight
        }).start(Actions.mainfunction_page());
    }//end 

	
	
	
	
	//播放按鈕效果
	playPressing(){
		
		this.setState({
			BtnSrc:BtnViewArray[1]
		});
	
	}//end playButtonView
	
	

	//onPress={ Actions.videolistpage }
	
	/*橘色標題
		<View style={styles.title}>
			<Text style={{color: "white",fontSize:20,fontWeight: "bold"}}>
				安平海關AR導覽
			</Text>
		</View>
	*/
    render(){
        return (
            <View style={styles.container}>

				
				<View style={styles.photo}>
				
					<Text style={styles.context}>
						請將手機放置"AR望眼鏡"中{'\n'}
						將開始安平海關導覽！
					</Text>
					
					<TouchableWithoutFeedback onPress={ this.goScanPage }>
						<View style={styles.GoScanPage_show}>
							<Text style={ this.state.flagGoScanPage ? {fontSize: 20, color: "#4F4F4F"} : {fontSize: 0} }>
								{ this.state.flagGoScanPage ? ">>" : null}
							</Text>
							<Text style={ !this.state.flagGoScanPage ? {fontSize: 20, color: "#4F4F4F"} : {fontSize: 0} }>
								{ !this.state.flagGoScanPage ? this.state.timer : null }
							</Text>
						</View>
					</TouchableWithoutFeedback>
					
					
					
					<View style={styles.VideoListDiv}>
						<TouchableWithoutFeedback onPress={ this.jumpVideoListPage }>
							<Image source={VideoListBtnSrc} style={styles.VideoListButton} />
						</TouchableWithoutFeedback>
						<Text>
							影片列表
						</Text>
					</View>
					
				</View>
           </View>
        );
    }//end render
	
}//end class

var styles = StyleSheet.create({
    container:{flexDirection: "column",flex:1},
	title:{flex:0.1,backgroundColor:"#e6684b",justifyContent: "center",alignItems: "center"},
	context:{color:"black",fontSize:20,justifyContent: "center",alignItems: "center",textAlign: "center"},
	photo:{flex:0.9,justifyContent: "center",alignItems: "center"},
	arrow:{width: 20,height: 20,resizeMode: Image.resizeMode.contain},
	ScanButton:{width: 125,	height: 125,resizeMode: Image.resizeMode.contain},
	GoScanPage_show:{position: "absolute", right: 35, bottom: 45},
	VideoListDiv:{position: "absolute", left: 25, bottom: 25},
	VideoListButton:{marginTop:20, width: 50, height: 50,resizeMode: Image.resizeMode.contain}
});