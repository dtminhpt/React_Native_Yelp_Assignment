// import {combineReducers} from 'redux';
const types = {
    dataSearchPage: "DATA_SEARCHPAGE", 
}

export const reducer = (state = {},action) => {
    switch (action.type) {
        case types.dataSearchPage:
            return {
                ...state, 
                params: action.payload
            }
            break;
    }
    return state;
}

export const actionCreators = {
    setDataForMeNow(params) {
        return {
            type: types.dataSearchPage, 
            payload: params
        }
    }
}