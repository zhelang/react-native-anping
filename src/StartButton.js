import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback , Image} from "react-native";

//Router API
import {Actions} from "react-native-router-flux";

//取得圖片位置
import Arrow from '../drawable/ic_arr.png';
import Button_One from '../drawable/btn_start_one.png';
import Button_Four from '../drawable/btn_start_four.png';
import VideoListBtnSrc from '../drawable/btn_video_list.png';
//圖片陣列
const BtnViewArray = [Button_One,Button_Four];

//取得裝置螢幕大小
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get("window");

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),//畫面起始位置
			ScanBtnSrc:  BtnViewArray[0] //按鈕初始效果
        };
		
		//JaveScript SE6 添加Function到此Class
		this.playPressing = this.playPressing.bind(this);
		this.jumpMainFunctionPage = this.jumpMainFunctionPage.bind(this);
    }
	
	
	
	

    componentWillMount(){

    }
	
	
	
	

    componentDidMount() {
		
		//開啟此頁面(WelcomePage)特效
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }
	
	
	
	jumpMainFunctionPage(){
		Actions.mainfunction_page();
	}
	
	
	jumpVideoListPage(){
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
						按下按鈕後{'\n'}
						請將手機放置"AR望眼鏡"中{'\n'}
						將開始安平海關導覽！
					</Text>
					
					<Image source={Arrow} style={styles.arrow} />
					
					<TouchableWithoutFeedback  onPress={ this.jumpMainFunctionPage } onPressIn={ this.playPressing }>
						<Image source={this.state.ScanBtnSrc} style={styles.ScanButton} />
                    </TouchableWithoutFeedback>
					
					<TouchableWithoutFeedback onPress={ this.jumpVideoListPage }>
						<Image source={VideoListBtnSrc} style={styles.VideoListButton} />
                    </TouchableWithoutFeedback>
					
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
	VideoListButton:{marginTop:20, width: 50, height: 50,resizeMode: Image.resizeMode.contain}
});