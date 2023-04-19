import request from "../utils/request"
import authHeader from "./auth-header"

export const createChat = async (values) => {
    const res = await request.post(`/chat/createChat`, values, { headers: authHeader() })
    if (res.data.status === 'success') return res.data;
    return []
}

export const editReadChat = async (chatId) => {
    const res = await request.get(`/chat/editReadChat?chatId=${chatId}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data;
    return []
}