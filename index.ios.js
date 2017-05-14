/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import * as firebase from 'firebase';
const styles = require('./styles.js')
import {
  AppRegistry,
  Text,
  View,
  AlertIOS,
  ListView
} from 'react-native';
// Initialize Firebase
import {firebaseConfig} from './configFirebase';
const firebaseApp = firebase.initializeApp(firebaseConfig);
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');


export default class GroceryApp extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows({ title: 'Pizza' }),

        };
        this.itemsRef = firebaseApp.database().ref();

    }
    _addItem() {
        AlertIOS.prompt(
            'Add New Item',
            null,
            [
                {
                    text: 'Add',
                    onPress: (text) => {
                        this.itemsRef.push({ title: text })
                    }
                },
            ],
            'plain-text'
        );
    }
    listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    title: child.val().title,
                    _key: child.key
                });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items)
            });

        });
    }
    componentDidMount() {
        this.listenForItems(this.itemsRef);
    }

    _renderItem(item) {
        const onPress = () => {
            AlertIOS.prompt(
                'Complete',
                null,
                [
                    {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
                    {text: 'Cancel', onPress: (text) => console.log('Cancel')}
                ],
                'default'
            );
        };
        return (
            <ListItem item={item} onPress={onPress} />
            );
}

render() {
    return (
        <View style="{styles.container}">

            <StatusBar title="Grocery List" />
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderItem.bind(this)}
            />

            <ActionButton title="Add" onPress={() => AlertIOS.prompt('Add New Item', null, [
                {
                    text: 'Add',
                    onPress: (text) => {
                        this.itemsRef.push({ title: text })
                    }
                },
            ],)}>
            </ActionButton>


        </View>
);
}
}


AppRegistry.registerComponent('GroceryApp', () => GroceryApp);
