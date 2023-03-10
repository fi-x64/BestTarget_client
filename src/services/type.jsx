import request from "../utils/request"

export const getFuelTypes = async () => {
    const res = await request.get('/type/get-all')
    if (res.data.success) return res.data.data
    return []
}