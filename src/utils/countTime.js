import moment from "moment";

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

export default countTime
