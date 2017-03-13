import React, { Component } from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, ListView,TouchableOpacity , ScrollView,Image} from "react-native";
import {Actions} from 'react-native-router-flux';
import RNFS from 'react-native-fs';

var {
  height: deviceWidth,
  width: deviceHeight,
} = Dimensions.get("window");

//引用圖片
import LOCK from '../drawable/lock.png';

//抓取記事本
const VIDEO_LIST_FILE = RNFS.DocumentDirectoryPath + '/vid_list.txt';





export default class extends React.Component {
  constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
      this.state = {
        dataSource:ds.cloneWithRows([]),
        comingSoonTop:deviceHeight,
        showing:false,

      };

	  //ES6 class add functions
      this.fetchData = this.fetchData.bind(this);
	  this.deleteVideoData = this.deleteVideoData.bind(this);

  }//end constructor

  
  
  componentWillMount() {
	//抓取資料
    this.fetchData();
  }

  
  
  
  //抓取資料
  fetchData(){
	  
		//抓取記事本內容(JSON格式)
        RNFS.readFile(VIDEO_LIST_FILE).then((content)=>{    
			//with vid_list
            var vid_info = JSON.parse(content);
			this.setState({
                dataSource:this.state.dataSource.cloneWithRows(vid_info)
            });
			//console.warn("抓到資料囉");
                                                      
        }).catch((err)=>{
			console.log("FETCH ERROR:"+err);
			
        }).done();
		
  }//end fetch Data
  
  
  
	//清除資料
	deleteVideoData(){
		
		RNFS.unlink(VIDEO_LIST_FILE).then(()=>{
			//console.warn("清除成功");
			Actions.welcome({popNum: 2,refresh: {}});//jump welcome
			
		})
		.catch((err)=>{
			console.log("清除失敗："+err.message)
		})
		
		//console.log('清除資料了');
	}//end deleteVideoData

  
  
  
	//顯示使用
  _renderRow(rowData, sectionID, rowID, highlightRow) {

    //console.warn('rowData' , rowData);
    var maxLen = 105;

	//大於顯示值，則????
    if(rowData.body.length > maxLen){
      rowData.body = rowData.body.slice(0,maxLen) + '...';
    }

	//非解鎖狀態
    if(rowData.unlocked){
      var outImage = <Image style={styles.thumbnail} source={{uri:'https://img.youtube.com/vi/'+rowData.video_id+'/sddefault.jpg'}}/>
	  console.log('抓取YOUTUBE 截圖成功');
    }
    else{
      var outImage = <Image style={styles.thumbnail} source={ LOCK }/>
    }
    return(

          <View style={styles.cellContainer}>
            <View style={styles.cell}>
			
              <View style={styles.cellsTitleContainer}>
                <Text style={styles.cellsTitle}>{rowData.title}</Text>
              </View>
			  
              <TouchableOpacity onPress={()=>{rowData.unlocked ? Actions.videoplayerpage({video_id:rowData.video_id,refresh:{}}) : null}}>
                <View style={styles.thumbnailContainer}>
                  {outImage}
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
        <View style={{flex:1, backgroundColor:'#ffffff' }}>
		
			<View style={styles.title}>
			
				<TouchableOpacity style={styles.backbuttonContainer} onPress={()=>{Actions.pop();}}>
					<View>
						<Text>Back</Text>
					</View>
				</TouchableOpacity>
				
				<Text style={{color: "white",fontSize:20,fontWeight: "bold"}}>
					安平海關AR導覽
				</Text>
				
				<TouchableOpacity style={styles.resetbuttonContainer} onPress={()=>{ this.deleteVideoData(); }}>
					<View>
						<Text>RESET</Text>
					</View>
				</TouchableOpacity>
				
			</View>
			
			  
              <View style={styles.videoListContainer}>
                  <ScrollView horizontal={true}>
                    <ListView
                      horizontal={true}
                      contentInset={{top:100}}
                      dataSource={this.state.dataSource}
                      renderRow={(rowData , sectionID , rowID , highlightRow) => this._renderRow(rowData , sectionID , rowID , highlightRow) }
                     />
                  </ScrollView>
              </View>

              
        </View>

    );
  }//end render
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor:'red',
    borderWidth:2,
  },
  title:{
	  flex:0.1,
	  backgroundColor:"#e6684b",
	  justifyContent: "center",
	  alignItems: "center",
	  flexDirection: 'row',
   },
  backbuttonContainer:{
	position:'absolute',
    top:2,
    left:2,
	width: 50,
	height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'green',
    borderWidth:2,
  },
  resetbuttonContainer:{
	position:'absolute',
    top:2,
    right:2,
	width: 50,
	height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'green',
    borderWidth:2,
  },
  videoListContainer:{
	flex:0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'red',
    borderWidth:2,
	marginTop:10,
    marginBottom:10,
  },
  cellContainer:{
    width:deviceWidth / 3.5 + 10,
    height:deviceHeight - 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'#ececec',
    borderColor:'blue',
    borderWidth:2,
  },
  cell:{
    width:deviceWidth / 3.5,
    height:deviceHeight - 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10,
    backgroundColor:'#ffffff',

    borderColor:'purple',
    borderWidth:2,
  },
  cellsTitleContainer:{
    height:30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'yellow',
    borderWidth:2,
  },
  cellsTitle:{
    fontWeight:"500",
    fontSize:16,
  },
  thumbnailContainer:{
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail:{
    height:deviceHeight / 2,
    width:deviceWidth / 3.5 - 10,
    resizeMode:'contain',
  },
  cellsBodyContainer:{
    width:deviceWidth / 3.5,
    marginTop:10,
    borderColor:'green',
    borderWidth:2,
  },
  cellsBody:{
    fontWeight:"200",
    fontSize:14,
  },

});
