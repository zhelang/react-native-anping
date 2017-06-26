import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, BackAndroid} from "react-native";
import {Actions} from "react-native-router-flux";
import CountAR_Image from '../../images/count_ar.png';
import HintText from './HintText';

const {height: deviceHeight,width: deviceWidth} = Dimensions.get("window");
const TIMER_INERVAL = 1000;//倒數器間隔=100ms
const TIMER_TIME = 8;
var TIMER;

export default class extends React.Component {
    constructor(props){
        super (props);
        this.state = {
			timer: TIMER_TIME,
        };
		this.jumpMainFunctionPage = this.jumpMainFunctionPage.bind(this);
    }
	
	

    componentWillMount(){

    }
	
	

    componentDidMount() {
		
		//跳轉初次導覽畫面
		TIMER = setInterval(() => {this.jumpMainFunctionPage()}, TIMER_INERVAL);
	
    }//end componentDidMount
	
	
	
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
				<HintText timer={this.state.timer}/> 

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

const styles = StyleSheet.create({
    container:{flexDirection: "column",flex:1,justifyContent: "center",alignItems: "center"},
	CountAR:{height:deviceWidth/3, resizeMode: Image.resizeMode.contain},
});