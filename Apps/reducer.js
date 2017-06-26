// import {combineReducers} from 'redux';
const types = {
    dataLoginPage: "DATA_LOGINPAGE",
    dataSearchPage: "DATA_SEARCHPAGE", 
    dataFilterPage: "DATA_FILTERPAGE"
}

export const reducer = (state = {},action) => {
    switch (action.type) {
        case types.dataSearchPage:
            return {
                ...state, 
                params: action.payload
            }
            break;
        case types.dataFilterPage: 
            return {
                ...state, 
                params: action.payload
            }
            break;
        case types.dataLoginPage: 
            return {
                ...state,
                params: action.payload
            }
            break;
        default:
    }
    return state;
}

export const actionCreators = {
    storeDataForSearch(params) {
        return {
            type: types.dataSearchPage, 
            payload: params
        }
    },
    storeFilterSettings(params){
        return (
            type: types.dataFilterPage, 
            payload: params
        )

    }
}