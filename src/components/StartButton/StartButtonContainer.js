import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image, BackAndroid, NetInfo} from "react-native";

import {Actions} from "react-native-router-flux";
import BluetoothSerial from 'react-native-bluetooth-serial';

import BackGround_Image from '../../images/home_bg.png';
import Header from './Header';
import VideoListButton from './VideoListButton';
import StartButton from './StartButton';

const {height: deviceHeight,width: deviceWidth} = Dimensions.get("window");



export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(+deviceHeight),//畫面起始位置
        };

		console.log("props = " + JSON.stringify(this.props));
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

		//檢查是否有網路
		NetInfo.isConnected.fetch().then(isConnected => {
			if(isConnected){
				this.props.actions.connectNetwork();
			}else{
				this.props.actions.disconnectNetwork();
			}
		});
		
    }//end componentDidMount


	
    render(){
        return (
            <Image source={BackGround_Image} style={styles.container}>
					<Header/>
					<View style={{marginTop: 10}}>
						<StartButton/>
					</View>
					<View style={ styles.videoListButton }>
						<VideoListButton/>
					</View>
           </Image>
        );
    }//end render
	
	
	
	componentWillUnmount(){

	}//end componentWillUnMount()
	
}//end class

const styles = StyleSheet.create({
    container:{width: deviceWidth, height: deviceHeight, justifyContent: "center",alignItems: "center"},
	videoListButton:{position: "absolute", left: 50, bottom: 30},
});