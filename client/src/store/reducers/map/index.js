import { connect } from "react-redux";
import { createAction, createReducer } from "redux-delta";
import { put, call, all } from "redux-saga/effects";

const setMapCenter = createAction("SET_MAP_CENTER");

export const map = createReducer({
    center: { lat: 0, lng: 0 }
}, [
    setMapCenter.case((_, center) => ({ center }))
])

export const withMap = connect(
    ({ map }) => ({ map }),
    { setMapCenter }
)

export default function* mapSaga () {

}