import React from 'react'

function HomeFooter() {
    return (
        <div className='bg-[#f4f4f4] p-[16px]'>
            <div className='grid grid-cols-3'>
                <div className="footer-item">
                    <div className='text-lg font-bold'>Hỗ trợ khách hàng</div>
                    <ul className='font-normal'>
                        <li><a href="">Trung tâm trợ giúp</a></li>
                        <li><a href="">An toàn mua sắm</a></li>
                        <li><a href="">Quy định cần biết</a></li>
                        <li><a href="">Quy chế quyền riêng tư</a></li>
                        <li><a href="">Liên hệ hỗ trợ</a></li>
                    </ul>
                </div>
                <div className="footer-item">
                    <div className='text-lg font-bold'>Về Best Target</div>
                    <ul className='font-normal'>
                        <li><a href="">Giới thiệu</a></li>
                        <li><a href="">Tuyển dụng</a></li>
                        <li><a href="">Truyền thông</a></li>
                        <li><a href="">Blog</a></li>
                    </ul>
                </div>
                <div className="footer-item">
                    <div className='text-lg font-bold'>Liên kết</div>
                    <ul className='font-normal'>

                    </ul>
                </div>
            </div>

        </div>
    )
}

export default HomeFooter
