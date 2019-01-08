import { connect } from "react-redux";
import { createAction, createReducer } from "redux-delta";
import { takeEvery, put, call, all, select } from "redux-saga/effects";

const findLocation = createAction("FIND_LOCATION");
const findLocationErr = createAction("FIND_LOCATION_ERROR");
const setLocation = createAction("SET_LOCATION");

export const user = createReducer({}, [
    setLocation.case((_, location) => ({ location }))
])

export const withUser = connect(
    ({ user }) => ({ user }),
    { findLocation, setLocation }
)

function* findLocationSaga () {
    try {
        const position = yield getLocation();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        yield put(setLocation({ lat, lng }));
    } catch (err) {
        yield put(findLocationErr(err.message));
    }
}

export default function* userSaga () {
    yield takeEvery(findLocation.type, findLocationSaga);
}

function getLocation() {
    return new Promise((res, rej) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((v) => res(v));
        } else {
            throw new Error("Not supported");
        }
    });
}