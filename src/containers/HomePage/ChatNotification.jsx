import { Avatar, Badge, Button, Dropdown, Input, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import logo from '../../assets/img/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { editReadThongBao, getAllThongBao } from '../../services/thongBao';
import moment from 'moment';
import socket from '../../utils/socketio';
import { getAllPhongChatForNoti } from '../../services/phongChat';
import { COUNT_MESSAGE } from '../../actions/types';
import {
    MessageOutlined
} from '@ant-design/icons';

function ChatNotification({ type }) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { countMessage } = useSelector((state) => state.chatNoti);

    const [chatData, setChatData] = useState();
    const [tinChuaDoc, setTinChuaDoc] = useState();

    const dispatch = useDispatch()

    async function fetchData() {
        const notiData = await getAllPhongChatForNoti(user.data._id);

        if (notiData) {
            setTinChuaDoc(notiData.soLuongTinChuaDoc);
            dispatch({
                type: COUNT_MESSAGE,
                payload: notiData.soLuongTinChuaDoc,
            });
            setChatData(notiData);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (chatData) {
            socket.on(`newMessageNoti_${user.data._id}`, async (values) => {
                if (values) {
                    setTinChuaDoc(values.soLuongTinChuaDoc);
                    dispatch({
                        type: COUNT_MESSAGE,
                        payload: values.soLuongTinChuaDoc,
                    });
                    setChatData(values);
                }
            })
        }
    })

    return (
        <div>
            {isLoggedIn && user && user.data ?
                <Link to="/chat">
                    <Space>
                        {type && type == 'managerPage' ?
                            <>
                                <Badge count={countMessage ? countMessage : 0} size='small' className='mr-1'>
                                    <i className="fa-regular fa-comment-dots text-white mr-1"></i>
                                </Badge>
                            </>
                            :
                            <>
                                <Badge count={countMessage ? countMessage : 0} size='small' className='mr-1'>
                                    <i className="fa-solid fa-comments mt-1"></i>
                                </Badge>
                            </>
                        }
                    </Space>
                </Link>
                :
                <Link to="/login"><i className="fa-solid fa-comments"></i> Chat</Link>
            }
        </div >

    )
}

export default ChatNotification
