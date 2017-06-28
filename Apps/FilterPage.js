import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    StatusBar, 
    TouchableHighlight, 
    Image, 
    Switch
} from 'react-native';

import ModalDropDown from 'react-native-modal-dropdown'
import SearchPage from './SearchPage.js'
import {Yelp} from './api/YelpSearch.js'
import {connect} from 'react-redux'
import {actionCreators} from './reducer.js'


class CustomSwitch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            switchValue:false
        }
    }

    render() {
        return(
            <View>
                <Text>{this.props.text}</Text>
                <Switch
                    onTintColor='#d11141' 
                    value={this.props.switchOn}
                />
            </View>
        )
    }
}
class FilterPage extends Component {
    constructor(props) {
        super(props);

        this.renderCategoryCell = this.renderCategoryCell.bind(this);
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
            searchTerm:'', 
            dropdown_icon_heart: true,
            offerSetting: false
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

    componentDidMount() {
        this.searchNewSetting();
    }

    async searchNewSetting(){
        console.log('Start getting data from category api');

        let categories = await Yelp.getCategories().then((item) => {
            return item;
        });
        console.log(categories.length);

        if (categories.length > 0) {
            this.setState({
                categories: categories, 
                currentCategories: categories.slice(0,3), 
                loading: false, 
                dataSource: this.ds.cloneWithRows(categories.slice(0,3))
            })
        }
    }

    returnSearchScreen() {
        this.props.navigator.push({
            title:'Search Screen',
            component:SearchPage
        })
    }

    addValueToCategory(alias, rowID) {
        let tmpCategory = this.state.currentCategories;
        var index = this.state.selectedCategories.indexOf(alias);
        if (index != -1) {
            this.state.selectedCategories.splice(index,1);
            tmpCategory[rowID].check = false;
        } else {
            this.state.selectedCategories.push(alias);
            tmpCategory[rowID].check = true;
        }

        this.setState({categories: tmpCategory, 
                       dataSource: this.ds.cloneWithRows(tmpCategory)})

        console.log(this.state.categories[rowID]);
    }

    renderCategoryCell(rowData, rowID) {
        return(
             <View style={{flexDirection:'row',
                           justifyContent:'space-between', 
                           paddingTop:8,
                           paddingBottom:8,
                           borderRadius: 5, 
                           borderWidth: 1,
                           borderColor:'silver',
                           marginTop:2, 
                           marginLeft:8, 
                           marginRight:8}}>
                <Text style={{marginLeft: 8,fontSize:22, fontWeight:'500'}}>{rowData.title}</Text>
                <Switch 
                    style={{marginRight:10}}
                    onValueChange={() => this.addValueToCategory(rowData.alias, rowID)} 
                    onTintColor='red' 
                    value={this.state.categories[rowID].check}/>
            </View>
        )
    }

    expandListView()
    {
        let tmpCategory = this.state.categories;
        for(var i =0; i< 3;i++){
            tmpCategory[i].check = this.state.currentCategories[i].check;
        }
        this.setState({
            currentCategories: tmpCategory,
            categories: tmpCategory,
        })

        this.setState({
            dataSource: this.ds.cloneWithRows(tmpCategory)
        })
    }

    joinSearchTerm(){
        let term = '';
        if(this.state.selectedDistance.text !== 'Auto'){
            term += '&radius=' + this.state.selectedDistance.text.substr(0, this.state.selectedDistance.text.indexOf(' '));
        }

            let str = this.state.selectedSortBy.text.split(" ").join('_');
            term += '&sort_by='+ str.toLowerCase();


        if(this.state.selectedCategories.length > 0){
            term += '&categories=' + this.state.selectedCategories.join(',');
        }

        this.setState({searchTerm: term});
        this.props.dispatch(actionCreators.storeFilterSettings({
            offerSetting:this.state.offerSetting,
            selectedDistance: this.state.selectedDistance,
            selectedSortBy: this.state.selectedSortBy,
            categories: this.state.currentCategories,
            searchTerm : term
        }))

        this.props.navigator.push({
            title:'Search Screen',
            component:SearchPage
        })
    }

    render(){
        const distanceOptions = ['Auto','3 miles','1 miles','5 miles','20 miles'];
        const matchOptions = ['Best Match','Review Count','Rating'];
        let dropdown_icon = this.state.dropdown_icon_heart ? require('./resources/heart.png') : require('./resources/uncheck.png');

        return(
            <View>
                <StatusBar barStyle='light-content'/>
                <View style={{marginTop:20, 
                            backgroundColor: 'red', 
                            marginBottom: 10, 
                            marginLeft: 10, 
                            marginRight: 10, 
                            flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            height: 38
                            }}>
                    <Text style={{fontSize: 20}}
                        onPress={() => this.returnSearchScreen()}>Cancel</Text>
                    <Text style={{fontSize: 20}}>Filter</Text>
                    <Text style={{fontSize: 20}}
                        onPress={() => this.joinSearchTerm()}>Search</Text>
                </View>

                {/*<View><Text>{this.props.passProps.dataPropsFromSearch}</Text></View>*/}

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
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData, sectionID, rowID) => this.renderCategoryCell(rowData, rowID)}
                        />
                        <Text onPress={() => this.expandListView()} 
                              style={{fontSize:22, textAlign:'center',
                                      paddingTop:4, marginLeft:8, 
                                      fontWeight:'400'}}>See all ...</Text>
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

