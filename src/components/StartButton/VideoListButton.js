import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, Text, View } from 'react-native';
import {Actions} from "react-native-router-flux";
import VideoListBtnImage from '../../images/list.png';

export default class VideoListButton extends Component{
    render(){
        return(
            <View style={styles.container}>
					<TouchableWithoutFeedback onPress={ ()=>{ Actions.videolist_page(); }}>
					    <Image source={VideoListBtnImage} style={styles.buttonImage} />
					</TouchableWithoutFeedback>
					<Text style={{color: "#4F4F4F"}}>
						影片列表
					</Text>
			</View>
        );
    }
}

const styles = StyleSheet.create({
    container:{justifyContent: "center",alignItems: "center"},
    buttonImage:{marginTop:20, width: 75, height: 75,resizeMode: Image.resizeMode.contain}
});