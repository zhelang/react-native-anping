import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity , Image} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";

//引用圖片
import Logo from '../drawable/logo.png';

//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");

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

export default class extends React.Component {
    constructor(props){
        super (props);

		//畫面起始位置
        this.state = {
            offset: new Animated.Value(-deviceHeight)
        };
    }

	
	
	
	
    componentWillMount(){
		
		//1秒後跳轉MainFunctionPage
		setTimeout(() => {
			Actions.start_button_page()  //origin Actions.home()
		}, 2000);

    }

	
	
	
	
    componentDidMount() {
		
		//開啟此頁面(WelcomePage)特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }

	
	
	
	
    closeModal() {
		
		//跳轉MainFunctionPage特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: deviceHeight
        }).start(Actions.start_button_page());
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
