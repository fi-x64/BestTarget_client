import { COUNT_MESSAGE, MINUS_MESSAGE } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case COUNT_MESSAGE:
            return { countMessage: payload };

        case MINUS_MESSAGE:
            return { countMessage: payload };

        default:
            return state;
    }
}
