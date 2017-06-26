import React, { Component } from 'react';
import {StyleSheet, TouchableWithoutFeedback, Image, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import StartButton1 from '../../images/btn_start_one.png';
import StartButton2 from '../../images/btn_start_four.png';

export default class StartButton extends Component{
    constructor(props){
        super (props);

        this.state={
            StartButtonImage: StartButton1,
        };

		this.changeStartButton = this.changeStartButton.bind(this);
    }

    changeStartButton(){
		if(this.state.StartButtonImage == StartButton1 ){
			this.setState({StartButtonImage: StartButton2});
		}else{
			this.setState({StartButtonImage: StartButton1});
		}
	}//end changeStartButton


    render(){
        return(
            <TouchableWithoutFeedback onPressOut={ this.changeStartButton } onPressIn={ this.changeStartButton } onPress={()=>{ Actions.hintguide_page(); }} >
				<Image source={this.state.StartButtonImage} style={styles.StartButton}/>
			</TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
   	StartButton:{width: 125, height: 125, resizeMode: Image.resizeMode.contain},
});