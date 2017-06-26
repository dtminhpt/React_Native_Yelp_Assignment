import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    StatusBar, 
    TouchableHighlight, 
    Image
} from 'react-native';

import ModalDropDown from 'react-native-modal-dropdown'

import {connect} from 'react-redux'
import {actionCreators} from './reducer.js'

import SearchPage from './SearchPage.js'
import {Yelp} from './api/YelpSearch.js'

class FilterPage extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            loading: true,
            selectedDistance:{
                index:0,
                text: 'Auto'
            },
            selectedSortBy:{
                index:0,
                text:'Best Match'
            },
            categories:[{}],
            currentCategories:[{}],
            selectedCategories: [],
            dataSource: this.ds.cloneWithRows([]),
            searchTerm:''
        }
    }
     _dropdown_renderRow(rowData, rowID, highlighted) {
        let icon = highlighted ? require('./resources/heart.png') : require('./resources/uncheck.png');
        return (
        <TouchableHighlight underlayColor='white'>
            <View style={[styles.dropdown_row, {backgroundColor:'white'}]}>
            <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                {`${rowData}`}
            </Text>
            <Image style={styles.dropdown_image}
                    mode='stretch'
                    source={icon}
            />
            
            </View>
        </TouchableHighlight>
        );
    }

    returnSearchScreen() {
        this.props.navigator.push({
            title:'Search Screen',
            component:SearchPage
        })
    }

    joinSearchTerm() {
        alert("joinSearchTerm")
    }

    render(){
        const distanceOptions = ['Auto','3 miles','1 miles','5 miles','20 miles'];
        const matchOptions = ['Best Match','Review Count','Rating'];
        let dropdown_icon = this.state.dropdown_icon_heart ? require('./resources/heart.png') : require('./resources/uncheck.png');

        return(
            <View>
                <StatusBar barStyle='light-content'/>
                <View style={{marginTop:30}}>
                    <Text onPress={() => this.returnSearchScreen()}>Cancel</Text>
                    <Text>Filter</Text>
                    <Text onPress={() => this.joinSearchTerm()}>Search</Text>
                </View>

                <View>
                    <Text>Distance</Text>
                    <ModalDropDown style={styles.dropdown}
                                    style={{paddingTop:6,paddingBottom:6, 
                                    backgroundColor:'white',borderRadius: 5, borderWidth: 1,borderColor:'silver',
                                    marginTop:2, marginLeft:8, marginRight:8}}
                           textStyle={styles.dropdown_text}
                           defaultIndex={this.state.selectedDistance.index}
                           dropdownStyle={styles.dropdown_dropdown}
                           options={distanceOptions} 
                           onSelect={(index,value) => this.setState({selectedDistance:
                               { index: index, text:value}
                           })}
                           renderRow={this._dropdown_renderRow.bind(this)}>
                           <Text style={{fontSize:22, paddingTop:4, paddingBottom:4,marginLeft:8, fontWeight:'500'}}>{this.state.selectedDistance.text}</Text>              
                </ModalDropDown>


                    <Text>Sort By</Text>
                    <ModalDropDown style={styles.dropdown}
                                style={{paddingTop:6,paddingBottom:6,
                            backgroundColor:'white',borderRadius: 5, borderWidth: 1,borderColor:'silver',
                            marginTop:2, marginLeft:8, marginRight:8}}
                           textStyle={styles.dropdown_text}
                           defaultIndex={this.state.selectedSortBy.index}
                           dropdownStyle={styles.dropdown_dropdown}
                           options={matchOptions} 
                           onSelect={(index,value) => this.setState({
                               selectedSortBy:
                               { index: index, text:value}
                           })}
                           renderRow={this._dropdown_renderRow.bind(this)}>
                           <Text style={{fontSize:22, paddingTop:4, paddingBottom:4,marginLeft:8, fontWeight:'500'}}>{this.state.selectedSortBy.text}</Text>              
                    </ModalDropDown>

                    <Text>Category</Text>
                    <View>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData, sectionID, rowID) => this.renderCategoryCell(rowData, rowID)}
                        />
                        <Text onPress={() => this.expandListView()}>See all...</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    alignSelf: 'center',
    top: 32,
    right: 8,
    justifyContent:'space-between',
    backgroundColor: 'cornflowerblue',
  },
  dropdown_text: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  dropdown_dropdown: {
    marginTop:10,
    height: 253,

  },
  dropdown_row: {
       borderTopColor: 'white',
       width:'95%',
    flexDirection: 'row',
    height: 50,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  dropdown_image: {
    width: 30,
    height: 30,
  },
  dropdown_row_text: {
    marginHorizontal: 14,
    fontSize: 22,
    color: 'navy',
    textAlignVertical: 'center',
  },
})

const mapStateToProps = (state) => {
    return {
        filterData: state.params
    }
}

export default connect(mapStateToProps)(FilterPage);

