import request from "../utils/request"

export const handleTimKiem = async (values) => {
    const res = await request.get(`/handleTimKiem?searchKey=${values}`)
    if (res.data.status === 'success') return res.data.data
    return []
}