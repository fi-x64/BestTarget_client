import { Button } from 'antd'
import React from 'react'
import logo from '../../assets/img/logo.png'

function HomeHeader() {
    return (
        <div className='bg-[#ffba00] relative pb-3'>
            <div className="max-w-[936px] mx-auto">
                <div className='flex justify-between'>
                    <a href="" className='logo'>
                        <img src={logo} alt="" className='h-14' />
                    </a>
                    <li className='button flex [&>*]:mr-8 mt-5'>
                        <ul><a href=""><i className="fa-solid fa-house"></i> Trang chủ</a></ul>
                        <ul><a href=""><i className="fa-solid fa-list-check"></i> Quản lý tin</a></ul>
                        <ul><a href=""><i className="fa-solid fa-box"></i> Đơn hàng</a></ul>
                        <ul><a href=""><i className="fa-solid fa-comments"></i> Chat</a></ul>
                        <ul><a href=""><i className="fa-solid fa-bell"></i> Thông báo</a></ul>
                        <ul><a href=""><i className="fa-solid fa-circle-user"></i> User</a></ul>
                    </li>
                </div>
                <div className='flex relative my-[12px] mx-auto px-2'>
                    {/* <SearchBar className="fle" /> */}
                    <div class="relative w-full">
                        <input type="search" class="block h-full w-full z-20 text-sm rounded-lg text-left[10px] placeholder:pl-3" placeholder="Tìm mọi thứ trên Best Target" required />
                        <button type="submit" class="absolute top-0 right-0 h-full p-1 text-white bg-[#ff8800] rounded-lg border ">
                            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span class="sr-only">Search</span>
                        </button>
                    </div>
                    <Button className='bg-[#FF8800] ml-2 flex-4'><i class="fa-solid fa-pen-to-square"></i> Đăng tin</Button>
                </div>

            </div>
        </div>
    )
}

export default HomeHeader
