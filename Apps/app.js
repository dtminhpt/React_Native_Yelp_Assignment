import React, { Component } from 'react';
import {
    AppRegistry,
    Stylesheet,
    View,
    Text,
    Navigator,
} from 'react-native';

import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';

import LoginPage from './LoginPage.js'
import SearchPage from './SearchPage.js'

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {reducer} from './reducer.js';

const store= createStore(reducer);

export default class App extends Component {
    _renderScene(route, navigator) {
        return <route.component
                    navigator={navigator}
                    passProps={route.passProps}
                />
    }

    render(){
        const defaultRoute={
            title: "Search Page", 
            component: SearchPage
        }
        return(
            <Provider store={store}>
                <Navigator
                    initialRoute={defaultRoute}
                    renderScene={this._renderScene}
                />
            </Provider>
        )
    }
}




