import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView, 
  TextInput, 
  Button, 
  Image, StatusBar
} from 'react-native';

export default class HomePage extends Component {
    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        access_token: "", 
        token_type: "", 
        //fullListData: []
      };
    }
  componentWillMount(){
    this.fetchToken();
  }

  fetchToken() {
    const params = {
      client_id: 'qDPlyf_EBtljgqKxPALx6Q', // use your own
      client_secret: 'RlFVBx8XonMjZcNnal3e827ooycXR7Pc4JngdpbM6UmdbW61GEfiss22OMRK0p4M', // use your own
      grant_type: 'client_credentials'
    }

    const request = new Request('https://api.yelp.com/oauth2/token', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      }),
      body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}`
    });

    return fetch(request)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log(json);
        console.log(json.access_token);
        console.log(json.token_type);
        this.setState({
          token_type: json.token_type, 
          access_token: json.access_token
        })
        console.log(this.state.access_token);
        console.log(this.state.token_type);
        this.fetchData();
        
        return json; // Token
      })
    }

    fetchData() {
      const request = new Request('https://api.yelp.com/v3/businesses/search?term=delis&location=San%20Francisco', {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
          'Authorization': this.state.token_type + ' ' + this.state.access_token
        })
      });

      return fetch(request)
        .then(response => {
          return response.json()
        })
        .then(json => {
          console.log("fetchData Done");
          console.log(json.businesses);
          this.setState(
            {
              //fullListData: json.businesses,
              dataSource: this.state.dataSource.cloneWithRows(json.businesses)
            }
          )
          return json; // Token
        })
  }
  renderHeader(){
      return(
      <View style={{flexDirection: 'row', backgroundColor: 'red'}}>
          <Button style={styles.button}
            onPress={() => alert("CLick Filter")}
            title="Filter"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />

          <TextInput
              style={styles.inputSearch}
              onChangeText={(searchText) => this.searchMovie(searchText)}
              value={this.state.searchText}
              placeholder="Search..."
          />
      </View>
      )
    }

    renderRow(rowData) {
        return(
          <View>
            <View style={styles.container}>
                <Image 
                  source={{uri: rowData.image_url}}
                  style={styles.thumbnail}
                />
                <View style={{marginLeft:10}}>
                  <Text style={{fontWeight: 'bold'}}>{rowData.name}</Text>
                  <Text>{rowData.review_count} Reviews</Text>
                  <Text style={styles.year}>{rowData.location.address1}</Text>
                </View>
            </View>
          </View>
            
        )
    }

    renderSeparator() {
      return (<View style={{
          width: '90%',
          height: 2,
          alignSelf: 'center',
          backgroundColor: "#909090"
      }}></View>)
    }

    render() {
      return (
        <View style={{marginTop: 20}}>
          <StatusBar
            backgroundColor="red"
            //barStyle="light-content"
          />
          <ListView
              renderHeader={this.renderHeader.bind(this)}
              enableEmptySections={true}
              dataSource={this.state.dataSource}
              renderRow={(rowData) => this.renderRow(rowData)}
              renderSeparator={() => this.renderSeparator()}
          />
      </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 90,
    height: 90,
    margin: 10
  },
  inputSearch:{
    height: 30,
    width: 250,
    flex: 2.5,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 6, 
    borderWidth: 1, 
    margin: 5
  }, 
  button: {
    flex:1, 
    flexDirection: 'row', 
    borderWidth: 2, 
    borderColor: 'black', 
    borderRadius: 10,  
    textAlign: 'center' 
  }
});

AppRegistry.registerComponent('HomePage', () => HomePage);
