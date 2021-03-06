import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, BackAndroid} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";


import CountAR_Image from '../drawable/count_ar.png';//取得圖片位置
var {height: deviceHeight,width: deviceWidth} = Dimensions.get("window");//取得裝置螢幕大小
var TIMER;
const TIMER_INERVAL = 1000;//倒數器間隔=100ms
const TIMER_TIME = 8;

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
			timer: TIMER_TIME,
        };
		
		//JaveScript SE6 添加Function到此Class
		this.jumpMainFunctionPage = this.jumpMainFunctionPage.bind(this);
    }
	
	

    componentWillMount(){

    }
	
	

    componentDidMount() {
		
		//跳轉初次導覽畫面
		TIMER = setInterval(() => {this.jumpMainFunctionPage()}, TIMER_INERVAL);
	
    }//end componentDidMount
	
	

    /*closeModal() {
		
		//跳轉MainFunctionPage特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: deviceHeight
        }).start(Actions.mainfunction_page());
		
    }//end */
	
	
	
	//
	goScanPage(){
		
		if(this.state.flagGoScanPage){
			//開始倒數
			TIMER = setInterval(() => {this.jumpMainFunctionPage() }, TIMER_INERVAL);
		}else{
			//暫停倒數
			clearInterval(TIMER);
			TIMER = null;
		}//end if
	}//end goScanPage
	
	
	
	//
	jumpMainFunctionPage(){
		
		currentTime = this.state.timer - TIMER_INERVAL/1000;
		if(currentTime<=0){
			this.state = {
				timer: TIMER_TIME, //倒數計時
				flagGoScanPage: true
			};
			//跳轉頁面
			Actions.pop();
			Actions.mainfunction_page();
		}else{
			this.setState({timer: currentTime});
		}//end if
		
	}//end jumpMainFunctionPage()


	
	//onPress={ Actions.videolistpage }
    render(){
        return (
            <View style={styles.container}>
				<Image source={CountAR_Image} style={styles.CountAR}/>
					
				<Text style={styles.context}>
					請將手機放置於「AR眼鏡」中{'\n'}倒數
					<Text style={{fontSize: 30, color: "#E2754B"}}> {this.state.timer} </Text>
					秒
				</Text>	
           </View>
        );
    }//end render
	
	
	
	componentWillUnmount(){
		//clear timer
		if(TIMER!=null){
			clearInterval(TIMER);
			TIMER = null;
		}
	}//end componentWillUnmount
	
}//end class {this.state.timer}...

var styles = StyleSheet.create({
    container:{flexDirection: "column",flex:1,justifyContent: "center",alignItems: "center"},
	CountAR:{height:deviceWidth/3, resizeMode: Image.resizeMode.contain},
	context:{color:"#585858", fontSize:20, textAlign:'center'},
});