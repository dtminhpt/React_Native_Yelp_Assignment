import React, { Component } from 'react';
import {
    Stylesheet,
    View,
    Text,
} from 'react-native';

import {connect} from "react-redux";
import {reducer} from './reducer';


class FilterPage extends Component {
    render(){
        return(
            <View>
                <Text>Filter2</Text>
                <Text>{this.props.passProps.dataPropsFromSearch}</Text>
            </View>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        hahaha: state.params
    }
}

export default connect(mapStatetoProps)(FilterPage);


