import request from "../utils/request";


export async function getAllAreas() {
    const res = await request.get('/location/area')
    if (res.data.success) return res.data.data
    return []
}