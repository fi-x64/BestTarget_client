import request from "../utils/request"
import authHeader from "./auth-header"

export const getAllPhongChatByUserId = async (type) => {
    const res = await request.get(`/phongChat/getAllPhongChatByUserId?type=${type}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllPhongChatForNoti = async () => {
    const res = await request.get(`/phongChat/getAllPhongChatForNoti`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createPhongChat = async (values) => {
    const res = await request.post(`/phongChat/createPhongChat`, values, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data;
    return []
}