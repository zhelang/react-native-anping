import React , { Component }from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ArrowImage from '../../images/ic_arr.png';

export default class Header extends Component {
	render() {
		return(
			<View style={styles.container}>
				<Text style={styles.context}>
					按下按鈕{'\n'}開始安平海關AR導覽！
				</Text>
				<Image source={ArrowImage} style={styles.Arrow} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{justifyContent: "center",alignItems: "center"},
	context:{color:"black",fontSize:20,justifyContent: "center",alignItems: "center",textAlign: "center"},
	Arrow:{width: 10, height: 10,},
});