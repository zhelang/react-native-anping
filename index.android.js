/**
 * Anping App
 * Ver:002 Date:2016/12/20
 * ZheLeng
 */
 
//基本元件
import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View,} from 'react-native';

//Router API(畫面流程)
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';

//引入要切換的畫面
import Welcome from './src/Welcome';
import StartButton from './src/StartButton';
import MainFunctionPage from './src/MainFunction';






//緩衝頁面
const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};





export default class Anping_V002 extends Component {
  render() {
    return (
        <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#F7F7F7'}} navigationBarStyle={{backgroundColor:'#7db732'}} >
            <Scene key="root" hideNavBar={true}>
                <Scene key="welcome" component={Welcome} title="Welcome" initial={true}/>
				<Scene key="start_button_page" component={StartButton} title="Start" />
                <Scene key="mainfunctionpage" component={MainFunctionPage} title="MainFunctionPage"/>

            </Scene>
        </Router>
    );
  }//end render()
}//end class






const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Anping_V002', () => Anping_V002);
