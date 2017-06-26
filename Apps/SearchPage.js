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
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';


import {connect} from 'react-redux';
import FilterPage from './FilterPage.js';
import {Yelp} from './api/YelpSearch.js';

import {actionCreators} from './reducer.js';

let _restaurantList = [];
let DIMS = Dimensions.get('window');
let SCREEN_WIDTH = DIMS.width;
let SCREEN_HEIGHT = DIMS.height;

class SearchPage extends Component {
    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        places: [],
        access_token: "",
        token_type: "",
        //searchString: "",
        refreshing: false,
        isFirstPage: true,
        currentPage: 1,
        loading: true, 
        dataProps: "", 
        token: {}
      };
    }
  componentDidMount(){
    this.fetchToken();
    //this.searchWithTerm();
  }

  async searchWithTerm(){
    let keyword = '';
    console.log('Search props:', this.props.filterData);
    if (this.props.filterData){
      keyword = this.props.filterData.searchTerm;
      console.log(keyword);
    }

    var data;
    var count=0;
    data = await Yelp.searchWithFilter(keyword).then((item) => {
      return item;
    });

    if (data.length > 0) {
      console.log(data.length);

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data), 
        refreshing: false, 
        loading: false, 
        places: data
      })
    }
  }

  fetchToken() {
    const params = {
      client_id: 'xFFxSFfOHvhHLGiluxkizg', // use your own
      client_secret: 'rEtHrl4UAZ4ZmjgGY0CfcGm300Jub2nm1mStUUp1fBeBYlIvFiRWzsP1r3qcqpq2', // use your own
      grant_type: 'client_credentials'
    }

    const request = new Request('https://api.yelp.com/oauth2/token', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      }),
      body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}`
    });

    return fetch(request).then(response => {
        return response.json()
      }).then(json => {
        console.log(json);
        this.setState({
          token_type: json.token_type,
          access_token: json.access_token
        })
        this.fetchData()
        return json; // Token
      })
      .catch(error => {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          this.setState({
              loading: false, 
              searchString: 'Something bad happened' + error
          })
        });
    }

    async fetchData() {
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

      return await fetch(request).then(response => {
          return response.json()
        }).then(json => {
          console.log("fetchData Done");
          console.log("json.businesses= " + json.businesses);
          _restaurantList = _restaurantList.concat(json.businesses)
          this.setState(
            {
              //dataSource: this.state.dataSource.cloneWithRows(json.businesses),
              places: json.businesses,
              dataSource: this.state.dataSource.cloneWithRows(_restaurantList),
              isFirstPage: false,
              currentPage: this.state.currentPage + 1,
              loading: false, 
              refreshing: false,
            }
          )
          return json; // Token
        }).done();
  }

  _onEndReached() {
    this.fetchData();
  }

  searchRestaurant(text) {
    if (!text) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.places)
      })
    }

    // this.setState({
    //   searchString: text
    // })

    var matchingPlaces = [];
    // this.state.places.forEach(function(place) {
    //   if (place.name.toLowerCase().match(text.toLowerCase()))
    //     matchingPlaces.push(place)
    // })

    for (var i=0; i < this.state.dataSource._dataBlob.s1.length; i++) {
      var name = this.state.dataSource._dataBlob.s1[i].name.toLowerCase();
      if(name.search(text.toLowerCase()) !== -1){
        matchingPlaces.push(this.state.dataSource._dataBlob.s1[i]);
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(matchingPlaces)
    });

    if (matchingPlaces.length === 0) {
      alert("No result");
    }
  }

  renderHeader(sectionID, rowID){
      return(
      <View style={{flexDirection: 'row', backgroundColor: 'red'}}>
          {/*<TouchableHighlight underlayColor='#99d9f4'
            style={styles.button}
            onPress={() => alert("CLick Filter")}>
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableHighlight>*/}
          <Button onPress={this._gotoFilter} title="Go to scene Filter" />

          <TextInput
              style={styles.inputSearch}
              onChangeText={(searchString) => this.searchRestaurant(searchString)}
              value={this.state.searchString}
              placeholder="Search..."
          />
      </View>
      )
    }

  _gotoFilter = () => {
      this.props.dispatch(actionCreators.setDataForMeNow({text: this.state.dataProps}))
      this.props.navigator.push({
        title: "Filter",
        component: FilterPage, 
        passProps: {dataPropsFromSearch: this.state.dataProps}
      })
  }

  renderRow(rowData, sectionID, rowID) {
      if (!rowData){
        return;
      }
      return(
        <View>
          <View style={styles.container}>
              <Image
                source={{uri: rowData.image_url}}
                style={styles.thumbnail}
              />
              <View style={{marginLeft:10}}>
                <Text style={{fontWeight: 'bold'}}>{rowData.name}</Text>
                <View>
                  <Text>{rowData.review_count} Reviews</Text>
                </View>
                <View>
                  <Text>Address:{rowData.location.address1}, {rowData.location.address2}</Text>
                  <Text>{rowData.location.city} - 
                        {rowData.location.display_address[rowData.location.display_address.length - 1]}
                  </Text>
                </View>
              </View>
          </View>
        </View>

      )
    }

    renderSeparator(sectionID, rowID) {
      return (<View 
        key={`${sectionID}-${rowID}`}
        style={{
          width: '90%',
          height: 2,
          alignSelf: 'center',
          backgroundColor: "#909090"
      }}></View>)
    }

    render() {
      if(this.state.loading) {
        return(
          <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
            <ActivityIndicator
            loading={this.state.loading}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
          </View>
        )
      }
      return (
        <View style={{marginTop: 20}}>
          <ListView
            enableEmptySections={true}
            renderHeader={this.renderHeader.bind(this)}
            enableEmptySections= {true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator.bind(this)}
            onEndReached={this._onEndReached()}
          />
      </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
  },
  centering: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
});

const mapStateToProps = (state) => {
  return {
    filterData: state.params,
  }
}
export default connect(mapStateToProps)(SearchPage);