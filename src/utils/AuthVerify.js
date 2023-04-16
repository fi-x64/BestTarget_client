import moment from "moment";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props) => {
    let location = useLocation();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            const decodedJwt = parseJwt(user.token);
            console.log("Check decodedJwt: ", decodedJwt);
            console.log("Check Date.now(): ", Date.now());
            console.log("Check decodedJwt.exp * 1000 < Date.now(): ", decodedJwt.exp * 1000 < Date.now());
            if (decodedJwt.exp * 1000 < Date.now()) {
                console.log("Đã vào đây");
                props.logOut();
            }
        }
    }, [location, props]);

    return;
};

export default AuthVerify;