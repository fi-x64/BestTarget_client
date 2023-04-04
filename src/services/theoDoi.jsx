import request from "../utils/request"
import authHeader from "./auth-header"

export const xoaTheoDoi = async (followId) => {
    const res = await request.get(`/theoDoi/xoaTheoDoi?followId=${followId}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data
    return []
}

export const themTheoDoi = async (followId) => {
    const res = await request.get(`/theoDoi/themTheoDoi?followId=${followId}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data
    return []
}

export const getListFollower = async (userId) => {
    const res = await request.get(`/theoDoi/getListNguoiTheoDoi?userId=${userId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getListFollowing = async (userId) => {
    const res = await request.get(`/theoDoi/getListDangTheoDoi?userId=${userId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getListLoggedFollower = async () => {
    const res = await request.get(`/theoDoi/getListLoggedNguoiTheoDoi`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getListLoggedFollowing = async () => {
    const res = await request.get(`/theoDoi/getListLoggedDangTheoDoi`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}