import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';



import LoginPage from './LoginPage.js'
import HomePage from './HomePage.js'


const SimpleApp = TabNavigator({
    Home: { screen: HomePage,
            navigationOptions: {
                title: 'Home'
                }
            },
  Login: { screen: LoginPage,
           navigationOptions: {
                title: 'Login'
            }
        },
  
});

export default SimpleApp;


