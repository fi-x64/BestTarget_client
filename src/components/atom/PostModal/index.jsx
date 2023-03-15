import { Modal } from 'antd'
import React from 'react'

function PostModal({ data, isModalOpen }) {
    return (
        <Modal title="Đăng tin" open={isModalOpen} footer={null}>
            <div className='menu-category p-4 hover:bg-[#f5f5f5]'>
                {data.map((values, index) => {
                    return (
                        <>
                            <div key={values.id}><i class="fa-solid fa-laptop"></i> {values.tenDanhMuc} <i class="float-right text-lg fa-solid fa-chevron-right"></i></div>
                        </>
                    )

                })}
            </div>
        </Modal>
    )
}

export default PostModal