import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, Divider, Form, Input, List, Select, Skeleton } from 'antd';
import { Link, useHref, useSearchParams } from 'react-router-dom';
import { createChat, editReadChat } from '../../services/chat';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';
import socket from '../../utils/socketio';
import { getAllPhongChatByUserId } from '../../services/phongChat';
import { COUNT_MESSAGE } from '../../actions/types';

function Chat() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { countMessage } = useSelector((state) => state.chatNoti);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [chatData, setChatData] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [phongChatId, setPhongChatId] = useState();
    const [message, setMessage] = useState();

    const dispatch = useDispatch();

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const countTime = (thoiGianPush) => {
        const start = thoiGianPush;
        const end = moment();
        const duration = moment.duration(end.diff(start));

        // Lấy giá trị thời gian theo đơn vị phút
        const minutes = duration.asMinutes();
        // Kiểm tra và chuyển đổi sang tiếng hoặc ngày nếu lớn hơn 59 phút hoặc 23 tiếng
        let displayTime;
        var hours;
        if (minutes >= 60) {
            hours = duration.asHours();
            displayTime = `${hours.toFixed(0)} giờ trước`;
        } else {
            displayTime = `${minutes.toFixed(0)} phút trước`;
        }
        var days;
        if (hours >= 24) {
            days = duration.asDays();
            displayTime = `${days.toFixed(0)} ngày trước`;
        }

        return displayTime;
    }

    const loadMoreData = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const res = await getAllPhongChatByUserId();

        if (res) {
            res.map((value, index) => {
                if (value.nguoiDungId1._id === user.data._id) {
                    value.currentNguoiDung = 'nguoiDung1';
                } else if (value.nguoiDungId2._id === user.data._id) {
                    value.currentNguoiDung = 'nguoiDung2';
                }
            })

            setData([...res]);

            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    useEffect(() => {
        if (data) {
            const phongChatId = searchParams.get("phongChatId");

            if (phongChatId) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]._id == phongChatId) {
                        setChatData(data[i]);
                        break;
                    }
                }
                setPhongChatId(phongChatId);

                if (messagesEndRef && messagesEndRef.current) {
                    scrollToBottom();
                }
            }
        }
    })

    const handleClickItem = async (data) => {
        if (data?.chat[0]?.tinNhan[data.chat[0].tinNhan.length - 1]?.nguoiGuiId != user.data._id && data?.chat[0]?.tinNhan[data.chat[0].tinNhan.length - 1]?.daDoc == false) {
            const res = await editReadChat(data.chat[0]._id);

            if (res) {
                dispatch({
                    type: COUNT_MESSAGE,
                    payload: countMessage >= 0 ? countMessage - 1 : 0,
                });
                loadMoreData();
            }
        }
        setChatData(data);
    }

    const handleChangeInput = (e) => {
        setMessage(e.target.value);
    }

    const handleKeyUp = (event) => {
        // Enter
        if (event.keyCode === 13) {
            handleSendMessage();
        }
    }

    const handleSendMessage = async () => {
        if (message != '') {
            const res = await createChat({
                phongChatId: phongChatId,
                tinNhan: {
                    nguoiGuiId: user.data._id,
                    noiDung: message
                }
            });
            if (res) {
                inputRef.current.value = '';
                setMessage('');
                loadMoreData();
            }
        }
    }

    useEffect(() => {
        if (data) {
            // for (let i = 0; i < data.length; i++) {
            socket.on(`newMessage_${user.data._id}`, async (values) => {
                // if (values.status === 'success') {
                //     const res = await getAllPhongChatByUserId();

                //     if (res) {
                //         res.map((value, index) => {
                //             if (value.nguoiDungId1._id === user.data._id) {
                //                 value.currentNguoiDung = 'nguoiDung1';
                //             } else if (value.nguoiDungId2._id === user.data._id) {
                //                 value.currentNguoiDung = 'nguoiDung2';
                //             }
                //         })

                //         setData([...res]);
                //         return;
                //     }
                // }
                console.log("Check newMessage: ", values);
                if (values) {
                    values.map((value, index) => {
                        if (value.nguoiDungId1._id === user.data._id) {
                            value.currentNguoiDung = 'nguoiDung1';
                        } else if (value.nguoiDungId2._id === user.data._id) {
                            value.currentNguoiDung = 'nguoiDung2';
                        }
                    })

                    setData([...values]);
                }
            })
            // }
        }
    })

    return (
        <div className="container bg-[#f4f4f4]">
            <h1 className='p-4 font-semibold text-lg'>Chat</h1>
            <hr />
            <div className="grid grid-cols-3 max-w-[936px] bg-[#fff]">
                {data ?
                    <div className='left-component'>
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 600,
                                overflow: 'auto',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <List
                                dataSource={data}
                                renderItem={(item) => (
                                    <Link to={{ pathname: '/chat', search: `?phongChatId=${item?._id}` }} >
                                        <List.Item key={item._id} onClick={() => handleClickItem(item)} className={phongChatId && phongChatId === item._id ? 'cursor-pointer bg-[#f4f4f4] hover:bg-gray-200' : 'cursor-pointer hover:bg-gray-200'} >
                                            {item.currentNguoiDung === 'nguoiDung1' ?
                                                <List.Item.Meta className={item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1]?.nguoiGuiId != user.data._id && item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1]?.daDoc == false ? 'font-extrabold' : ''}
                                                    avatar={<Avatar src={item.nguoiDungId2?.anhDaiDien?.url ? item.nguoiDungId2.anhDaiDien.url : avatar} />}
                                                    title={
                                                        <div className='flex'>
                                                            {item.nguoiDungId2.hoTen} - <p className='text-xs mt-1 ml-1'>
                                                                {countTime(item.chat[0]?.thoiGianChatMoiNhat)}
                                                            </p>
                                                        </div>
                                                    }
                                                    description={item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1]?.noiDung}
                                                />
                                                :
                                                item.currentNguoiDung === 'nguoiDung2' ?
                                                    <List.Item.Meta className={item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1].nguoiGuiId != user.data._id && item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1].daDoc == false ? 'font-extrabold' : ''}
                                                        avatar={<Avatar src={item.nguoiDungId1?.anhDaiDien?.url === user.data._id ? item.nguoiDungId1.avatar.url : avatar} />}
                                                        title={<div className='flex'>
                                                            {item.nguoiDungId1.hoTen} - <p className='text-xs mt-1 ml-1'>
                                                                {countTime(item.chat[0]?.thoiGianChatMoiNhat)}
                                                            </p>
                                                        </div>}
                                                        description={item?.chat[0]?.tinNhan[item.chat[0].tinNhan.length - 1].noiDung}
                                                    /> : null}
                                        </List.Item>
                                    </Link>
                                )}
                            />
                        </div>
                    </div>
                    : null}
                {chatData ?
                    <div className='right-component col-span-2'>
                        <div className='header'>
                            {chatData.currentNguoiDung == 'nguoiDung1' ?
                                <Link to={{ pathname: '/users/profile', search: `?userId=${chatData.nguoiDungId2._id}` }} className='user flex p-2 my-2'>
                                    <Avatar src={chatData.nguoiDungId2?.anhDaiDien?.url ? chatData.nguoiDungId2.anhDaiDien.url : avatar} />
                                    <h1 className='ml-2 font-semibold'>{chatData.nguoiDungId2.hoTen}</h1>
                                </Link>
                                : chatData && chatData.currentNguoiDung == 'nguoiDung2' ?
                                    <Link to={{ pathname: '/users/profile', search: `?userId=${chatData.nguoiDungId1._id}` }} className='user flex p-2 my-2'>
                                        <Avatar src={chatData.nguoiDungId1?.anhDaiDien?.url ? chatData.nguoiDungId1.anhDaiDien.url : avatar} />
                                        <h1 className='ml-2 font-semibold'>{chatData.nguoiDungId1.hoTen}</h1>
                                    </Link>
                                    : null}
                            <hr />
                            <Link to={{ pathname: '/postDetail', search: `?id=${chatData?.tinDangId._id}` }} className='post flex p-2'>
                                <img src={chatData?.tinDangId?.hinhAnh[0].url} className='w-[50px] h-[50px]' />
                                <div className='block ml-2 text-sm'>
                                    <h1 className='font-bold'>{chatData.tinDangId.tieuDe}</h1>
                                    <NumericFormat className='text-red-600 py-2' value={chatData.tinDangId.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                </div>
                            </Link>
                            <hr />
                        </div>
                        <div className='content flex flex-col space-y-4 p-3 h-[400px] overflow-y-auto'>
                            {chatData?.chat[0] ?
                                <ul>
                                    {chatData.chat[0].tinNhan.map((value, index) => {
                                        if (user.data._id === value.nguoiGuiId) {
                                            return <li className='sender p-2 flex items-end justify-end' key={value._id}>
                                                <div className='flex flex-col space-y-2 text-sm'>
                                                    <span className='px-4 py-2 rounded-lg inline-block rounded-br-none bg-[#fff4d6]'>
                                                        <h1>{value.noiDung}</h1>
                                                        <p className='text-gray-500 text-[11px]'>{moment(value.thoiGianChat).format('DD/MM/YYYY hh:mm')}</p>
                                                    </span>
                                                    <div ref={messagesEndRef} ></div>
                                                </div>
                                            </li>
                                        } else {
                                            return <li className='sender p-2 flex' key={value._id}>
                                                <div className='flex flex-col space-y-2 text-sm'>
                                                    <span className='px-4 py-2 rounded-lg inline-block rounded-bl-none bg-[#f4f4f4]'>
                                                        <h1>{value.noiDung}</h1>
                                                        <p className='text-gray-500 text-[11px]'>{moment(value.thoiGianChat).format('DD/MM/YYYY hh:mm')}</p>
                                                    </span>
                                                    <div ref={messagesEndRef} ></div>
                                                </div>
                                            </li>
                                        }
                                    })}
                                </ul>
                                : null}
                        </div>
                        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0 text-sm sticky z-50">
                            <div className="relative flex">
                                <span className="absolute inset-y-0 flex items-center">
                                    <i className="fa-solid fa-location-dot ml-4 text-lg"></i>
                                </span>
                                <input type="text" placeholder="Nhập tin nhắn!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                                    onChange={(e) => handleChangeInput(e)}
                                    onKeyUp={(e) => handleKeyUp(e)}
                                    ref={inputRef}
                                />
                                <div className="absolute right-0 mr-1 items-center inset-y-0 hidden sm:flex">
                                    <button onClick={() => handleSendMessage()} type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-[#ffba00] hover:opacity-60 focus:outline-none">
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </div >
    );
};

export default Chat