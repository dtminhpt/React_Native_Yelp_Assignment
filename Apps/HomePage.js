import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView, 
  TextInput, 
  Button, 
  Image, 
  TouchableHighlight, 
  RefreshControl
} from 'react-native';

let _restaurantList = []; 
export default class HomePage extends Component {
    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        access_token: "", 
        token_type: "", 
        searchString: "", 
        refreshing: false, 
        isFirstPage: true, 
        currentPage: 1
      };
    }
  componentDidMount(){
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
        this.setState({
          token_type: json.token_type, 
          access_token: json.access_token
        })
        this.fetchData();
        
        return json; // Token
      })
    }

    fetchData() {
      if (this.state.isFirstPage) {
        _restaurantList = [];
      }

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
          _restaurantList = _restaurantList.concat(json.businesses)
          this.setState(
            {
              //dataSource: this.state.dataSource.cloneWithRows(json.businesses)
              dataSource: this.state.dataSource.cloneWithRows(_restaurantList), 
              isFirstPage: false, 
              currentPage: this.state.currentPage + 1
            }
          )
          return json; // Token
        })
  }

  _onEndReached() {
    this.fetchToken();
  }

  _onRefresh() {
    this.setState({
      refreshing: true, 
      isFirstPage: true
    })

    this.fetchToken().then(()=> {
      this.setState({
        refreshing: false
      });
    })
  }

  searchRestaurant(text) {
    this.setState({
      searchString: text
    })

    var rows = [];
    for (var i=0; i < this.state.dataSource._dataBlob.s1.length; i++) {
      var name = this.state.dataSource._dataBlob.s1[i].name.toLowerCase();
      if(name.search(text.toLowerCase()) !== -1){
        rows.push(this.state.dataSource._dataBlob.s1[i]);
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows)
    });

    if (text === '') {
      this.fetchToken();
    }

    if (rows.length === 0) {
      alert("No result");
    }
  }

  renderHeader(){
      return(
      <View style={{flexDirection: 'row', backgroundColor: 'red'}}>
          <TouchableHighlight underlayColor='#99d9f4'
            style={styles.button}
            onPress={() => alert("CLick Filter")}>
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableHighlight> 

          <TextInput
              style={styles.inputSearch}
              onChangeText={(searchString) => this.searchRestaurant(searchString)}
              value={this.state.searchString}
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
          <ListView
              enableEmptySections={true}
              renderHeader={this.renderHeader.bind(this)}
              dataSource={this.state.dataSource}
              renderRow={(rowData) => this.renderRow(rowData)}
              renderSeparator={() => this.renderSeparator()}
              onEndReached={this._onEndReached()}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this._onRefresh.bind(this)}
                />
              }
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
    borderWidth: 1, 
    borderColor: 'black', 
    borderRadius: 10,  
    height: 30, 
    margin: 5, 
  },
  buttonText: {
    alignSelf: 'center', 
    marginTop: 5, 
    color: 'white'
  }
});

AppRegistry.registerComponent('HomePage', () => HomePage);
