import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';



import LoginPage from './LoginPage.js'
import SearchPage from './SearchPage1.js'


const SimpleApp = TabNavigator({
    Search: { 
        screen: SearchPage,
        navigationOptions: {
            title: 'Search'
        }
    },
    Login: { 
        screen: LoginPage,
        navigationOptions: {
            title: 'Login'
        }
    },
  
});

export default SimpleApp;


