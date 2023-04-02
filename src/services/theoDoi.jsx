import request from "../utils/request"
import authHeader from "./auth-header"

export const getListFollower = async () => {
    const res = await request.get(`/getListNguoiTheoDoi`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getListFollowing = async () => {
    const res = await request.get(`/getListDangTheoDoi`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}