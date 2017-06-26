import React, { Component } from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import backIC from '../../images/btn_back.png';

export default class backButton extends Component{
    render(){
        return(
            <TouchableOpacity style={  styles.backbuttonContainer } onPress={()=>{ Actions.pop(); }}>
				<Image style={styles.image} source={backIC}/>
			</TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    backbuttonContainer:{
        position: "absolute",
        top: 0,
        left: 15,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor:'green',
        //borderWidth:1,
    },
    image:{
        width: 30,
        resizeMode: Image.resizeMode.contain,
    },
});