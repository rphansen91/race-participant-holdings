import { combineReducers } from "redux";
import { race } from "./race";
import { user } from "./user";
import { map } from "./map";
import { snackbar } from "./snackbar";

export default combineReducers({
    race,
    user,
    map,
    snackbar,
});