import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, 
  Button
} from 'react-native';

const FBSDK =  require('react-native-fbsdk');

const { LoginButton, LoginManager, ShareDialog } = FBSDK

export default class LoginPage extends Component {
  _goToHome() {
       LoginManager.logInWithReadPermissions(['public_profile']).then((result) => {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          //alert('Login success with permissions: '
          //  +result.grantedPermissions.toString());
          this.getGraph();
        }
      },
      (error) => {
        alert('Login fail with error: ' + error);
      }
    );
    }
  render() {
    return (
      <View style={styles.container}>
        <View>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
      </View>
    );
  }
}

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
