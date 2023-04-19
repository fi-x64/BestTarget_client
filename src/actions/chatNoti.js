import { COUNT_MESSAGE, MINUS_MESSAGE } from "./types";

export const COUNT_MESSAGE = (data) => ({
    type: COUNT_MESSAGE,
    payload: data,
});

export const MINUS_MESSAGE = (data) => ({
    type: MINUS_MESSAGE,
    payload: data,
});
