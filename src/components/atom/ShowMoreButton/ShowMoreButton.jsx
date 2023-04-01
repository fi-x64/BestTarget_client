import React, { useState } from 'react'

function ShowMoreButton({ text, limit }) {
    var [isShowMore, setIsShowMore] = useState(false);

    let handleClick = () => {
        setIsShowMore(!isShowMore);
    }

    return (
        <div className='block'>
            {isShowMore ? <p>{text}</p> : <p>{text.substr(0, limit)}</p>}
            <button className='text-blue-500 items-center' onClick={handleClick}>{isShowMore ? "Thu gọn" : "Xem thêm"}</button>
        </div >
    )
}

export default ShowMoreButton
