import { connect } from "react-redux";
import { createAction, createReducer } from "redux-delta";
import { put, call } from "redux-saga/effects";

export const setSnackbarVariant = createAction("SET_SNACKBAR_VARIANT");
export const setSnackbarMessage = createAction("SET_SNACKBAR_MESSAGE");
export const closeSnackbar = createAction("CLOSE_SNACKBAR");
export const snackbar = createReducer({}, [
    setSnackbarVariant.case((_, variant) => ({ variant })),
    setSnackbarMessage.case((_, message) => ({ message })),
    closeSnackbar.case(() => ({ message: "" }))
]);

export const withSnackbar = connect(
    ({ snackbar }) => ({ snackbar }),
    { setSnackbarVariant, setSnackbarMessage, closeSnackbar }
)

export function* displayErrorSaga ({ payload }) {
    yield put(setSnackbarVariant("error"));
    yield put(setSnackbarMessage(payload));
}

export function* displaySuccessSaga ({ payload }) {
    yield put(setSnackbarVariant("success"));
    yield put(setSnackbarMessage(payload));
}

export default function* () {

}