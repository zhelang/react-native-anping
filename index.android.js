/**
 * Anping App
 * Ver:002 Date:2016/12/20
 * ZheLeng YuanSyun
 */
 

 
import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View,} from 'react-native';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import{ connect, Provider} from 'react-redux';
import {mapStateToProps} from './src/components/util/mapStateToProps';
import {mapDispatchToProps} from './src/components/util/mapDispatchToProps';

import store from './src/store/index';
import Welcome from './src/components/Welcome/Welcome';
import StartButton from './src/components/StartButton/StartButtonContainer';
import HintGuide from './src/components/HintGuide/HintGuideContainer';
import MainFunctionPage from './src/components/MainFunction/MainFunctionContainer';
import VideoListPage from './src/components/VideoList/VideoListContainer';

//Connect store and Component
const RouterWithRedux = connect(mapStateToProps, mapDispatchToProps)(Router);
const StartButtonWithRedux = connect(mapStateToProps, mapDispatchToProps) (StartButton);
const VideoListPageWithRedux = connect(mapStateToProps, mapDispatchToProps) (VideoListPage);
const MainFunctionPageWithRedux = connect(mapStateToProps, mapDispatchToProps) (MainFunctionPage);


export default class Anping_V002 extends Component {
  render() {
    return (
        <Provider store={store}>
            <RouterWithRedux>
                <Scene key="root" hideNavBar>
                    <Scene key="startbutton_page" component={StartButtonWithRedux} title="StartButton" initial/>
                    <Scene key="welcome" component={Welcome} title="Welcome" direction="vertical"/>
                    <Scene key="hintguide_page" component={HintGuide} title="HintGuide"/>
                    <Scene key="mainfunction_page" component={MainFunctionPageWithRedux} title="MainFunctionPage"/>
                    <Scene key="videolist_page" component={VideoListPageWithRedux} title="VideoListPage"/>
                </Scene>
            </RouterWithRedux>
        </Provider>
    );
  }
}//end class



AppRegistry.registerComponent('Anping_V002', () => Anping_V002);