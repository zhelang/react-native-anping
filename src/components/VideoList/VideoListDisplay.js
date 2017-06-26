import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, ListView, Dimensions, TouchableOpacity, Image, Text} from 'react-native';

import IC_LOCK from '../../images/ic_lock.png';
import IC_PLAY from '../../images/btn_play.png';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get("window");
var flagNetwork= false;

export default class VideoListDisplay extends Component{
	constructor(props){
		super(props);
		flagNetwork= this.props.flagNetwork;
		this.touchImage = this.touchImage.bind(this);
	}

	touchImage(_videoID, _unlocked, _flagNetwork){
        if(_unlocked && _flagNetwork){
            //dispatch play video actions
            this.props.playVideo(_videoID);
        }
    }

    //顯示使用
	_renderRow(rowData, sectionID, rowID, highlightRow) {

		//console.warn('rowData' , rowData);
		let maxLen = 105;
		

		//大於顯示值，則????
		if(rowData.body.length > maxLen){
		  rowData.body = rowData.body.slice(0,maxLen) + '...';
		}

		return(
			//不能用包裝成component的方式return，所有的function將只會由最後一個element載入
			//<VideoListCell rowData={rowData} flagNetwork={this.props.flagNetwork} playVideo={this.props.playVideo} stopVideo={this.props.stopVideo}/>
			<View style={styles.cellContainer}>
				<View style={styles.cell}>
				
				  	<View style={styles.cellsTitleContainer}>
					<Text style={styles.cellsTitle}>{rowData.title}</Text>
				  	</View>
				  
				  	<TouchableOpacity onPress={()=>{ this.touchImage(rowData.video_id, rowData.unlocked, flagNetwork); }}>
						<View style={ styles.thumbnailContainer }>
							<Image style={ rowData.unlocked ? styles.thumbnail : styles.thumbnail_lock } source={{uri:'https://img.youtube.com/vi/'+rowData.video_id+'/sddefault.jpg'}}/>
							<Image style={ styles.lock }source={ (!rowData.unlocked && flagNetwork) ? IC_LOCK : IC_PLAY }/>
							<Text style={ !flagNetwork ? styles.opennetwork_show : styles.opennetwork_hide }>請開啟網路{'\n'}Please open network.</Text>
						</View>
				  	</TouchableOpacity>
				  
					<View style={styles.cellsBodyContainer}>
						<Text style={styles.cellsBody}>{rowData.body}</Text>
					</View>
				  
				</View>
			</View>
		);
  }//end _renderRow

    render(){
        return(
            <View style={ styles.videoListContainer }>
				<ScrollView horizontal={true}>
					<ListView
						horizontal={true}
						contentInset={{top:100}}
						dataSource={this.props.dataSource}
						renderRow={(rowData , sectionID , rowID , highlightRow) => this._renderRow(rowData , sectionID , rowID , highlightRow) }
						style={{marginLeft:20,marginRight:20}}
						enableEmptySections={true}
					/>
				</ScrollView>
			</View>
        );
    }
}

const styles = StyleSheet.create({
    videoListContainer:{
        flex: 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor:'red',
        //borderWidth:2,
        //marginTop:10,
        //marginBottom:10,
    },
	cellContainer:{
        width:deviceWidth / 3.5 + 10,
        height:deviceHeight,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //borderColor:'blue',
        //borderWidth:2,
    },
    cell:{
        width:deviceWidth / 3.5,
        height:deviceHeight/1.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop:10,
        marginBottom:10,
        backgroundColor:'#ffffff',
        borderColor:'#C7C7C7',
        borderWidth:1,
    },
    cellsTitleContainer:{
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor:'yellow',
        //borderWidth:2,
    },
    cellsTitle:{
        fontWeight:"400",
        fontSize: 20,
        color: "#585858",
    },
    thumbnailContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail:{
        height:deviceHeight / 2.5,
        width:deviceWidth / 3.5 - 10,
        resizeMode:'contain',
    },
    thumbnail_lock:{
        height:deviceHeight / 2.5,
        width:deviceWidth / 3.5 - 10,
        resizeMode:'contain',
        opacity: 0.25,/*影片縮圖被鎖時的透明度*/
    },
    lock:{
        position:'absolute',
        top: (deviceHeight / 2)*0.5 - 64/2 ,
        left: (deviceWidth / 3.5 - 10)/2 - (64/2),
        height: 32, 
        resizeMode: Image.resizeMode.contain,
    },
    lock_hide:{
        width:0,
        height:0,
    },
    opennetwork_show:{
        color: '#6b6b6b',
        fontSize: 12,
    },
    opennetwork_hide:{
        fontSize: 0,
    },
    cellsBodyContainer:{
        width:deviceWidth / 3.5 - 10,
        //borderColor:'green',
        //borderWidth:2,
    },
    cellsBody:{
        fontWeight:"200",
        fontSize: 15,
        color: "#585858",
    },
});