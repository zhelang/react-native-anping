/**
 * Anping App
 * Ver:002 Date:2016/12/20
 * ZheLeng YuanSyun
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
import VideoListPage from './src/VideoList';





//緩衝頁面
const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};



//
export default class Anping_V002 extends Component {
  render() {
    return (
        <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#F7F7F7'}} navigationBarStyle={{backgroundColor:'#7db732'}} >
            <Scene key="root" hideNavBar={true}>
                <Scene key="welcome" component={Welcome} title="Welcome" initial={true}/>
				<Scene key="startbutton_page" component={StartButton} title="Start"/>
				<Scene key="mainfunction_page" component={MainFunctionPage} title="MainFunctionPage"/>
				<Scene key="videolist_page" component={VideoListPage} title="VideoListPage"/>
            </Scene>
        </Router>
    );
  }//end render()
}//end class

AppRegistry.registerComponent('Anping_V002', () => Anping_V002);
