import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, BackAndroid} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";
//藍芽串流 API引用
import BluetoothSerial from 'react-native-bluetooth-serial';

//取得圖片位置
import BackGround_Image from '../drawable/home_bg.png';
import Arrow_Image from '../drawable/ic_arr.png';
import StartButton1 from '../drawable/btn_start_one.png';
import StartButton2 from '../drawable/btn_start_four.png';
import VideoListBtnImage from '../drawable/list.png';

//取得裝置螢幕大小
var {
  height: deviceWidth,
  width: deviceHeight
} = Dimensions.get("window");



export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(+deviceHeight),//畫面起始位置
			StartButtonImage: StartButton1,
        };
		
		this.jumpHintGuidePage = this.jumpHintGuidePage.bind(this);
		this.jumpVideoListPage = this.jumpVideoListPage.bind(this);
		this.changeStartButton = this.changeStartButton.bind(this);
		
    }//end constructor
	
	
	
	

    componentWillMount(){

    }

	

    componentDidMount() {
		//WelcomePage
		Actions.welcome();
		
		//強制開啟藍芽
		BluetoothSerial.enable()
		.then((res) => 
			console.log("強制開啟藍芽成功"))
		.catch((err) => 
			console.log("強制開啟藍芽失敗 ${err}"));
		
    }//end componentDidMount
	
	
	
	jumpHintGuidePage(){
		Actions.hintguide_page();
	}
	
	
	
	jumpVideoListPage(){
		Actions.videolist_page();
	}
	
	
	
	changeStartButton(){
		if(this.state.StartButtonImage == StartButton1 ){
			this.setState({StartButtonImage: StartButton2});
		}else{
			this.setState({StartButtonImage: StartButton1});
		}
	}//end changeStartButton
	

	
    render(){
        return (
            <Image source={BackGround_Image} style={styles.container}>
				
					<Text style={styles.context}>
						按下按鈕{'\n'}開始安平海關AR導覽！
					</Text>
					
					<Image source={Arrow_Image} style={styles.Arrow}/>
					
					<TouchableWithoutFeedback onPressOut={ this.changeStartButton } onPressIn={ this.changeStartButton } onPress={ this.jumpHintGuidePage } >
						<Image source={this.state.StartButtonImage} style={styles.StartButton}/>
					</TouchableWithoutFeedback>
					
					<View style={styles.VideoListDiv}>
						<TouchableWithoutFeedback onPress={ this.jumpVideoListPage }>
							<Image source={VideoListBtnImage} style={styles.VideoListButton} />
						</TouchableWithoutFeedback>
						<Text style={{color: "#4F4F4F"}}>
							影片列表
						</Text>
					</View>

           </Image>
        );
    }//end render
	
	
	
	componentWillUnmount(){
		//關閉藍芽
		BluetoothSerial.disable()
		.then((res) => 
			console.log("藍芽關閉成功"))
		.catch((err) => 
			console.log("藍芽關閉失敗 ${err}"));
	}//end componentWillUnMount()
	
}//end class

var styles = StyleSheet.create({
    container:{flexDirection: "column",flex:1, width: deviceWidth, height: deviceHeight,justifyContent: "center",alignItems: "center"},
	context:{color:"black",fontSize:20,justifyContent: "center",alignItems: "center",textAlign: "center"},
	Arrow:{width: 10, height: 10},
	StartButton:{width: 125,height: 125,resizeMode: Image.resizeMode.contain,marginTop: 10},
	VideoListDiv:{position: "absolute", left: 50, bottom: 30,justifyContent: "center",alignItems: "center"},
	VideoListButton:{marginTop:20, width: 75, height: 75,resizeMode: Image.resizeMode.contain}
});