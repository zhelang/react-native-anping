import React, { Component } from 'react';
import {View, Text, Image, StyleSheet } from 'react-native';

export default class HintText extends Component{
    render(){
        return(
            <Text style={styles.context}>
					請將手機放置於「AR眼鏡」中{'\n'}倒數
					<Text style={styles.number}> {this.props.timer} </Text>
					秒
			</Text>	
        );
    }
}

const styles = StyleSheet.create({
    context:{color:"#585858", fontSize:20, textAlign:'center'},
    number:{fontSize: 30, color: "#E2754B"},
});