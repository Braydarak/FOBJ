import { combineReducers } from "redux";
import reportReducer from "./objectReducer";

const rootReducer = combineReducers({
    objects: reportReducer
});

export default rootReducer;
