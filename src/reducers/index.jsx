import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import chatNoti from "./chatNoti";

export default combineReducers({
  auth,
  message,
  chatNoti
});
