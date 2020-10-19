import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../Components/MyHeader';

export default class MyReceivedItemsScreen extends Component{
  constructor(){
    super()
    this.state={
      userId: firebase.auth().currentUser.email,
      receivedItemsList: []
    }
    this.requestRef= null
  }

  getReceivedItemsList=()=>{
    this.requestRef = db.collection("requested_items")
    .where('user_id', '==', this.state.userId).where("item_status", '==', 'received')
    .onSnapshot((snapshot)=>{
      var receivedItemsList = snapshot.docs.map((doc)=>doc.data())
      this.setState({
        receivedItemsList: receivedItemsList
      });
    })
  }

  componentDidMount(){
    this.getReceivedItemsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, i})=>(
    <ListItem key={i} title={item.item_name}
    subtitle={item.item_status.charAt(0).toUpperCase() + item.item_status.slice(1)}
      titleStyle={{color: 'black', fontWeight: 'bold'}} bottomDivider />
  )

  render(){
    return(
      <View style={{flex: 1}}>
        <MyHeader title="Received Items" navigation={this.props.navigation} />
        <View style={{flex: 1}}>
          {this.state.receivedItemsList.length == 0
            ?(<View style={styles.subContainer}>
                <Text style={{fontSize: 20}}>List Of All Received Items</Text>
              </View>
             )
            :(<FlatList
                keyExtractor={this.keyExtractor} data={this.state.receivedItemsList}
                renderItem={this.renderItem} />
             )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff5722",
    shadowColor: "#000000",
    shadowOffset: {width: 0, height: 8}
  }
})