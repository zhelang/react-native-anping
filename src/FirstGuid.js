import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";

//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");

var TIMER;
//倒數器間隔=100ms
const TIMER_INERVAL = 100;

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
			timer: 3.0,
        };
		
		//JaveScript SE6 添加Function到此Class
		this.jumpMainFunctionPage = this.jumpMainFunctionPage.bind(this);
    }
	
	
	
	

    componentWillMount(){

    }
	
	
	
	

    componentDidMount() {
		
		//跳轉初次導覽畫面
		TIMER = setInterval(() => {
			this.jumpMainFunctionPage()  //origin Actions.home()
		}, TIMER_INERVAL);
	
    }
	
	
	
	jumpMainFunctionPage(){
		
		currentTime = this.state.timer - TIMER_INERVAL/1000;
		
		if(currentTime<=0){
			
			//clear timer
			clearInterval(TIMER);
			//跳轉頁面
			Actions.pop();
			Actions.startbutton_page();
			Actions.mainfunction_page();
			
		}else{
			
			this.setState({
				timer: currentTime,
			});
			
		}//end if
		
	}//end jumpMainFunctionPage
	
	

    closeModal() {
		
		//跳轉MainFunctionPage特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: deviceHeight
        }).start(Actions.mainfunction_page());
		
    }//end 

	
	

	
	//onPress={ Actions.videolistpage }
    render(){
        return (
            <View style={styles.container}>
				<View style={styles.title}>
					<Text style={{color: "white",fontSize:20,fontWeight: "bold"}}>
						安平海關AR導覽
					</Text>
				</View>
				
				<View style={styles.photo}>
				
					<Text style={styles.context}>
						導覽說明頁
					</Text>
					
					<Text style={styles.context}>
						
					</Text>

				</View>
           </View>
        );
    }//end render
	
}//end class {this.state.timer}...

var styles = StyleSheet.create({
    container:{flexDirection: "column",flex:1},
	title:{flex:0.1,backgroundColor:"#e6684b",justifyContent: "center",alignItems: "center"},
	context:{color:"black",fontSize:20,justifyContent: "center",alignItems: "center",textAlign: "center"},
	photo:{flex:0.9,justifyContent: "center",alignItems: "center"},
	arrow:{width: 20,height: 20,resizeMode: Image.resizeMode.contain},
	ScanButton:{width: 125,	height: 125,resizeMode: Image.resizeMode.contain},
	VideoListDiv:{position: "absolute", left: 25, bottom: 25},
	VideoListButton:{marginTop:20, width: 50, height: 50,resizeMode: Image.resizeMode.contain}
});