import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { CameraOutlined, VideoCameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllTinhThanh, getPhuongXa, getQuanHuyen } from '../../services/diaChi';
import { ErrorMessage, FastField, Field, Formik } from 'formik'
import * as Yup from 'yup'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import "./EditPost.scss";
import axios from 'axios';
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea';
import ActionButton from '../../components/atom/ActionButton'
import { createPost, deleteImage, deleteVideo, editPost, getGoiY, getTinDangId } from '../../services/tinDang';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
const mdParser = new MarkdownIt(/* Markdown-it options */);

function EditPost() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [quanHuyen, setQuanHuyen] = useState([]);
    const [phuongXa, setPhuongXa] = useState([]);
    const tinhThanh = useQuery(['tinhThanh'], getAllTinhThanh);
    const [goiY, setGoiY] = useState();
    const [loading, setLoading] = useState(false);

    const [currentPostData, setCurrentPostData] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [fullDiaChiTin, setFullDiaChiTin] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await getTinDangId(searchParams.get('id'));

            if (res) {
                const goiY = await getGoiY(res.danhMucPhuId);
                setQuanHuyen(await getQuanHuyen(res.diaChiTinDang.tinhTPCode));
                setPhuongXa(await getPhuongXa(res.diaChiTinDang.quanHuyenCode));

                setGoiY(goiY);
                setCurrentPostData(res);
            } else {
                navigate('/')
                window.location.reload()
            }
        }
        fetchData();
    }, [])

    const reloadCurrentPostData = async (id) => {
        const res = await getTinDangId(id);
        if (res) {
            const goiY = await getGoiY(res.danhMucPhuId);
            setQuanHuyen(await getQuanHuyen(res.diaChiTinDang.tinhTPCode));
            setPhuongXa(await getPhuongXa(res.diaChiTinDang.quanHuyenCode));

            setGoiY(goiY);
            setCurrentPostData(res);
        }
    }

    const deleteImageMutation = useMutation(deleteImage, {
        onSuccess: async (res) => {
            if (res.message) message.success(res.message);

            reloadCurrentPostData(currentPostData._id)

        },
    })

    const deleteVideoMutation = useMutation(deleteVideo, {
        onSuccess: async (res) => {
            if (res.message) message.success(res.message);
            reloadCurrentPostData(currentPostData._id)
        },
    })

    const handleDeleteImage = async ({ imagePublicId, postId }) => {
        deleteImageMutation.mutate({ imagePublicId, postId })
    }

    const handleDeleteVideo = async ({ videoPublicId, postId }) => {
        deleteVideoMutation.mutate({ videoPublicId, postId })
    }

    const onChangeTinhTP = async (value) => {
        setQuanHuyen(await getQuanHuyen(value));
    };

    const onChangeQuanHuyen = async (value) => {
        setPhuongXa(await getPhuongXa(value));
    };

    const sampleAddress = {
        soNha: '',
        phuongXaCode: {},
        quanHuyenCode: {},
        tinhTPCode: {},
    }

    const sampleMoTa = {
        text: '',
        html: '',
    }

    const ValidationSchema = () => {
        const PostSchema = Yup.object().shape({
            tieuDe: Yup.string().min(4, 'Tiêu đề ít nhất 4 ký tự').max(50, 'Tiêu đề không nhiều hơn 50 ký tự').required('Vui lòng nhập tiêu đề tin đăng!'),
            // moTa: Yup.string().min(4).max(500).required('Vui lòng nhập mô tả chi tiết sản phẩm!'),
            gia: Yup.number().min(10000, 'Giá không được thấp hơn 10,000đ').required('Vui lòng nhập giá bán').typeError('Giá bán phải là số'),
            moTa:
                Yup.object().shape({
                    text: Yup.string().min(4, 'Mô tả ít nhất 4 ký tự').max(1000, 'Mô tả không được nhiều hơn 1000 ký tự').required('Vui lòng nhập mô tả chi tiết sản phẩm!')
                }),
            diaChiTinDang:
                Yup.object().shape({
                    tinhTPCode: Yup.string().required(
                        'Vui lòng chọn Tỉnh/Thành phố!'
                    ),
                    quanHuyenCode: Yup.string().required(
                        'Vui lòng chọn Quận/Huyện!'
                    ),
                    phuongXaCode: Yup.string().required(
                        'Vui lòng chọn Phường/Xã!'
                    )
                }),
            tinhTrang: Yup.string().required('Vui lòng chọn tình trạng sản phẩm'),
            hinhAnh: Yup.array().min(1, 'Vui lòng đăng nhất ít nhất 1 ảnh sản phẩm').max(6, 'Tối đa 6 ảnh sản phẩm').required('Vui lòng đăng nhất ít nhất 1 ảnh sản phẩm'),
            video: Yup.array().max(3, 'Tối đa 3 video sản phẩm')
        })

        var ValidationSchema = PostSchema;

        if (currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7) {
            const hangSXSchema = Yup.object({
                hangSX: Yup.string().required('Vui lòng chọn hãng sản xuất'),
            });
            ValidationSchema = ValidationSchema.concat(hangSXSchema);
        }

        if (currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3) {
            const mauSacSchema = Yup.object({
                mauSac: Yup.string().required('Vui lòng chọn màu sắc sản phẩm'),
            });
            ValidationSchema = ValidationSchema.concat(mauSacSchema);
        }

        if (currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7) {
            const thietBiSchema = Yup.object({
                thietBi: Yup.string().required('Vui lòng chọn loại thiết bị'),
            });
            ValidationSchema = ValidationSchema.concat(thietBiSchema);
        }

        if (currentPostData.danhMucPhuId == 8) {
            const phuKienSchema = Yup.object({
                phuKien: Yup.string().required('Vui lòng chọn loại phụ kiện'),
            });
            ValidationSchema = ValidationSchema.concat(phuKienSchema);
        }

        if (currentPostData.danhMucPhuId == 9) {
            const linhKienSchema = Yup.object({
                linhKien: Yup.string().required('Vui lòng chọn loại linh kiện'),
            });
            ValidationSchema = ValidationSchema.concat(linhKienSchema);
        }

        return ValidationSchema;
    }

    const handleSubmit = async (values, setFieldError) => {
        setLoading(true)
        const key = 'uploadable'
        message.loading({
            content: 'Đang đăng ảnh và video. Vui lòng không đóng tab hay tắt trình duyệt',
            key,
        })

        const submitHinhAnh = values.hinhAnh.filter((x) => x.url == null);
        const submitVideo = values.video.filter((x) => x.url == null);
        const uploadedHinhAnh = values.hinhAnh.filter((x) => x.url != null);
        const uploadedVideo = values.video.filter((x) => x.url != null);

        for (let image of submitHinhAnh) {
            const data = new FormData()
            data.append('file', image)
            data.append('upload_preset', 'postsData')
            const uploadRes = await axios.post(
                'https://api.cloudinary.com/v1_1/dcqllxxrk/image/upload',
                data,
                { withCredentials: false }
            )
            const { url, public_id } = uploadRes.data
            uploadedHinhAnh.push({ url, public_id })
        }

        for (let video of submitVideo) {
            const data = new FormData()
            data.append('file', video)
            data.append('upload_preset', 'postsData')
            const uploadRes = await axios.post(
                'https://api.cloudinary.com/v1_1/dcqllxxrk/video/upload',
                data,
                { withCredentials: false }
            )
            const { url, public_id } = uploadRes.data
            uploadedVideo.push({ url, public_id })
        }

        values.hinhAnh = uploadedHinhAnh;
        values.video = uploadedVideo;

        values.nguoiDungId = user.data._id;
        values.trangThaiTin = 'Đang đợi duyệt';

        const res = await editPost(currentPostData._id, values);

        if (res) {
            setLoading(false)
            message.success({
                content: 'Chỉnh sửa tin thành công, vui lòng chờ duyệt',
                key,
                duration: 1,
            })
            navigate('/managePost/4');
        }
    }

    return (
        <div>
            {currentPostData ?
                <Formik
                    initialValues={
                        currentPostData
                    }
                    onSubmit={(values, { setFieldError }) => {
                        handleSubmit(values, setFieldError)
                    }
                    }
                    validationSchema={ValidationSchema}
                    enableReinitialize={true}
                    disabled={loading ? true : false}
                >
                    {({
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                        <div className='grid grid-cols-3 bg-[#fff]'>
                            <div className='w-[300px] ml-2'>
                                <div className='mb-3'>
                                    <Dragger
                                        name={`hinhAnh`}
                                        id={`hinhAnh`}
                                        accept="image/*"
                                        multiple={true}
                                        fileList={values.hinhAnh}
                                        showUploadList={false}
                                        beforeUpload={async (file, fileList) => {
                                            const isLt5M = file.size / 1024 / 1024 < 5;
                                            if (!isLt5M) {
                                                message.error('Hình ảnh phải nhỏ hơn 5MB!');
                                            } else {
                                                var newHinhAnh = [];
                                                if (fileList.length > 0) {
                                                    newHinhAnh = [...values.hinhAnh, ...fileList];
                                                    if (newHinhAnh.length >= 6) {
                                                        for (var i = 6; i < newHinhAnh.length; i++) {
                                                            newHinhAnh.pop();
                                                        }
                                                    }
                                                } else newHinhAnh = [...values.hinhAnh, file];
                                                setFieldValue('hinhAnh', newHinhAnh)
                                            }
                                            return false
                                        }}
                                        status={
                                            errors?.hinhAnh &&
                                                touched?.hinhAnh
                                                ? 'error'
                                                : ''
                                        }
                                        disabled={values.hinhAnh?.length < 6 ? false : true}
                                        onRemove={(file) => {
                                            setFieldValue(
                                                'hinhAnh',
                                                values.hinhAnh.filter((x) => { x.uid !== file.uid })
                                            )
                                        }
                                        }
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <CameraOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Kéo thả vào khu vực này để đăng ảnh
                                        </p>
                                        <p className="ant-upload-hint">
                                            Hỗ trợ đăng tối đa 6 ảnh
                                        </p>
                                    </Dragger>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name={`hinhAnh`}
                                    ></ErrorMessage>
                                    <div className='image-list'>
                                        {values.hinhAnh?.map((x) => (
                                            <div key={x?._id || x.uid} className="image">
                                                <img
                                                    className='img'
                                                    src={x?._id ? x.url : URL.createObjectURL(x)}
                                                    alt=""
                                                />
                                                <ActionButton
                                                    className={'image-delete'}
                                                    onClick={() => {
                                                        setFieldValue(
                                                            'hinhAnh',
                                                            values.hinhAnh.filter((y) => y.uid !== x.uid)
                                                        )
                                                        if (x.url) {
                                                            handleDeleteImage({
                                                                imagePublicId: x.public_id,
                                                                postId: currentPostData._id
                                                            }
                                                            )
                                                        }
                                                    }}
                                                    icon={<DeleteOutlined />}

                                                    tooltipText="Delete this image?"
                                                    type="delete"
                                                ></ActionButton>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Dragger
                                        id='video'
                                        accept="video/*"
                                        name="video"
                                        multiple={true}
                                        fileList={values.video}
                                        showUploadList={false}
                                        beforeUpload={async (file, fileList) => {
                                            const isLt50M = file.size / 1024 / 1024 < 50;
                                            if (!isLt50M) {
                                                message.error('Video phải nhỏ hơn 50MB!');
                                            } else {
                                                var newVideo = [];
                                                if (fileList.length > 0) {
                                                    newVideo = [...values.video, ...fileList];
                                                    if (newVideo.length >= 2) {
                                                        for (var i = 2; i < newVideo.length; i++) {
                                                            newVideo.pop();
                                                        }
                                                    }
                                                } else newVideo = [...values.video, file];
                                                setFieldValue('video', newVideo)
                                            }
                                            return false
                                        }}
                                        disabled={values.video?.length < 2 ? false : true}
                                        onRemove={(file) =>
                                            setFieldValue(
                                                'video',
                                                values.video.filter((x) => x.uid !== file.uid)
                                            )
                                        }
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <VideoCameraOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Kéo thả vào khu vực này để đăng video
                                        </p>
                                        <p className="ant-upload-hint">
                                            Hỗ trợ tải lên tối đa 2 video
                                        </p>
                                    </Dragger>
                                    <div className='image-list'>
                                        {values.video?.map((x) => (
                                            <div key={x?._id || x.uid} className="image">
                                                <video
                                                    className='img'
                                                    src={x?._id ? x.url : URL.createObjectURL(x)}
                                                    alt=""
                                                />
                                                <ActionButton
                                                    className={'image-delete'}
                                                    onClick={() => {
                                                        setFieldValue(
                                                            'video',
                                                            values.video.filter((y) => y.uid !== x.uid)
                                                        )
                                                        if (x.url) {
                                                            handleDeleteVideo({
                                                                videoPublicId: x.public_id,
                                                                postId: currentPostData._id
                                                            }
                                                            )
                                                        }
                                                    }}
                                                    icon={<DeleteOutlined />}
                                                    tooltipText="Delete this video?"
                                                    type="delete"
                                                ></ActionButton>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2 ml-1'>

                                {/* <SuggestField /> */}
                                <div className='[&>div]:mb-5'>
                                    <div className='w-[550px] mt-[15px] ml-[30px] [&>div]:mb-5'>
                                        {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7 ?
                                            <div>
                                                <label htmlFor="hangSX">
                                                    Hãng: <RequiredIcon />
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="hangSX"
                                                    id="hangSX"
                                                    status={
                                                        errors?.hangSX &&
                                                            touched?.hangSX
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.hangSX}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `hangSX`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn hãng sản xuất"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.hangSX}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`hangSX`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 ?
                                            <div>
                                                <label htmlFor="mauSac">
                                                    Màu sắc: <RequiredIcon />
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="mauSac"
                                                    id="mauSac"
                                                    status={
                                                        errors?.mauSac &&
                                                            touched?.mauSac
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.mauSac}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `mauSac`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn màu sắc"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.mauSac}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`mauSac`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 ?
                                            <div>
                                                <label htmlFor="dungLuong">
                                                    Dung lượng:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="dungLuong"
                                                    id="dungLuong"
                                                    status={
                                                        errors?.dungLuong &&
                                                            touched?.dungLuong
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.dungLuong}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `dungLuong`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn dung lượng (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.dungLuong}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`dungLuong`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 2 ?
                                            <div>
                                                <label htmlFor="suDungSim">
                                                    Sử dụng sim:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="suDungSim"
                                                    id="suDungSim"
                                                    status={
                                                        errors?.suDungSim &&
                                                            touched?.suDungSim
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.suDungSim}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `suDungSim`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại sim máy sử dụng"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.suDungSim}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`suDungSim`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="boViXuLy">
                                                    Bộ vi xử lý:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="boViXuLy"
                                                    id="boViXuLy"
                                                    status={
                                                        errors?.boViXuLy &&
                                                            touched?.boViXuLy
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.boViXuLy}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `boViXuLy`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn bộ vi xử lý (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.boViXuLy}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`boViXuLy`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="ram">
                                                    Dung lượng RAM:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="ram"
                                                    id="ram"
                                                    status={
                                                        errors?.ram &&
                                                            touched?.ram
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.ram}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `ram`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn dung lượng RAM (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.ram}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`ram`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="kichCoManHinh">
                                                    Kích cỡ màn hình:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="kichCoManHinh"
                                                    id="kichCoManHinh"
                                                    status={
                                                        errors?.kichCoManHinh &&
                                                            touched?.kichCoManHinh
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.kichCoManHinh}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `kichCoManHinh`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn kích cỡ màn hình (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.kichCoManHinh}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`kichCoManHinh`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="oCung">
                                                    Dung lượng ổ cứng:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="oCung"
                                                    id="oCung"
                                                    status={
                                                        errors?.oCung &&
                                                            touched?.oCung
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.oCung}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `oCung`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn dung lượng ổ cứng (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.oCung}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`oCung`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="loaiOCung">
                                                    Loại ổ cứng:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="loaiOCung"
                                                    id="loaiOCung"
                                                    status={
                                                        errors?.loaiOCung &&
                                                            touched?.loaiOCung
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.loaiOCung}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `loaiOCung`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại ổ cứng (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.loaiOCung}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`loaiOCung`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                            <div>
                                                <label htmlFor="cardManHinh">
                                                    Loại card màn hình:
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="cardManHinh"
                                                    id="cardManHinh"
                                                    status={
                                                        errors?.cardManHinh &&
                                                            touched?.cardManHinh
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.cardManHinh}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `cardManHinh`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại card màn hình (Không bắt buộc)"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.cardManHinh}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`cardManHinh`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7 ?
                                            <div>
                                                <label htmlFor="thietBi">
                                                    Loại thiết bị: <RequiredIcon />
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="thietBi"
                                                    id="thietBi"
                                                    status={
                                                        errors?.thietBi &&
                                                            touched?.thietBi
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.thietBi}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `thietBi`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại thiết bị"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.thietBi}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`thietBi`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 8 ?
                                            <div>
                                                <label htmlFor="phuKien">
                                                    Loại phụ kiện: <RequiredIcon />
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="phuKien"
                                                    id="phuKien"
                                                    status={
                                                        errors?.phuKien &&
                                                            touched?.phuKien
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.phuKien}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `phuKien`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại phụ kiện"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.phuKien}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`phuKien`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        {currentPostData.danhMucPhuId == 9 ?
                                            <div>
                                                <label htmlFor="linhKien">
                                                    Loại linh kiện: <RequiredIcon />
                                                </label>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    name="linhKien"
                                                    id="linhKien"
                                                    status={
                                                        errors?.linhKien &&
                                                            touched?.linhKien
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    value={currentPostData.linhKien}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            `linhKien`,
                                                            value
                                                        )
                                                    }
                                                    onBlur={handleBlur}
                                                    placeholder="Chọn loại linh kiện"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{ label: 'label', value: 'label' }}
                                                    options={goiY?.linhKien}
                                                ></Select>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`linhKien`}
                                                ></ErrorMessage>
                                            </div>
                                            : null}
                                        <div>
                                            <label htmlFor="tinhTrang">
                                                Tình trạng: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name="tinhTrang"
                                                id="tinhTrang"
                                                status={
                                                    errors?.tinhTrang &&
                                                        touched?.tinhTrang
                                                        ? 'error'
                                                        : ''
                                                }
                                                value={values.tinhTrang}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        `tinhTrang`,
                                                        value
                                                    )
                                                }
                                                onBlur={handleBlur}
                                                placeholder="Tình trạng"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '')
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                options={[
                                                    { label: "Mới", value: "Mới" },
                                                    { label: "Đã sử dụng (chưa sửa chữa)", value: "Đã sử dụng (chưa sửa chữa)" },
                                                    { label: "Đã sử dụng (qua sửa chữa)", value: "Đã sử dụng (qua sửa chữa)" }
                                                ]}
                                            ></Select>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`tinhTrang`}
                                            ></ErrorMessage>
                                        </div>
                                    </div>
                                </div>
                                <h1 className='p-4 font-semibold text-lg'>Tiêu đề và Mô tả</h1>
                                <div>
                                    <div className='[&>div]:mb-5'>
                                        <Form className='w-[550px] mt-[15px] ml-[30px] [&>div]:mb-5'>
                                            <div>
                                                <label htmlFor="tieuDe">
                                                    Tiêu đề: <RequiredIcon />
                                                </label>
                                                <FastField
                                                    name="tieuDe"
                                                    id="tieuDe"
                                                    component={Input}
                                                    value={values.tieuDe}
                                                    status={errors?.tieuDe && touched?.tieuDe ? 'error' : ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                ></FastField>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name="tieuDe"
                                                ></ErrorMessage>
                                            </div>
                                            <div>
                                                <label htmlFor="moTa">
                                                    Mô tả: <RequiredIcon />
                                                </label>
                                                <FastField
                                                    name="moTa"
                                                    id="moTa"
                                                    style={{ height: '300px' }}
                                                    component={MdEditor}
                                                    // status={errors?.moTa && touched?.moTa ? 'error' : ''}
                                                    status={errors?.moTa?.text && touched?.moTa?.text ? 'error' : ''}
                                                    renderHTML={text => mdParser.render(text)}
                                                    onChange={(value) => {
                                                        setFieldValue(
                                                            `moTa`,
                                                            value
                                                        )
                                                    }}
                                                    value={values.moTa.text}
                                                    onBlur={handleBlur}
                                                ></FastField>
                                                {/* <MdEditor
                                            style={{ height: '300px' }}
                                            renderHTML={text => mdParser.render(text)}
                                            status={errors?.moTa?.text && touched?.moTa?.text ? 'error' : ''}
                                            onChange={(value) => {
                                                setFieldValue(
                                                    `moTa`,
                                                    value
                                                )
                                            }}
                                            value={values.moTa.text} /> */}
                                                <div className='text-red-500'>{errors?.moTa?.text ? errors.moTa.text : null}</div>
                                                {/* <ErrorMessage
                                                    // className="field-error"
                                                    component="div"
                                                    name="moTa.text"
                                                ></ErrorMessage> */}
                                            </div>
                                            <div>
                                                <label htmlFor="gia">
                                                    Giá: <RequiredIcon />
                                                </label>
                                                <FastField
                                                    name="gia"
                                                    id="gia"
                                                    component={Input}
                                                    value={values.gia}
                                                    status={errors?.gia && touched?.gia ? 'error' : ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                ></FastField>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name="gia"
                                                ></ErrorMessage>
                                            </div>
                                            <div>
                                                <label htmlFor="">Địa chỉ tin đăng</label>
                                            </div>
                                            <div>
                                                <div className='ml-3 [&>*]:mb-4'>
                                                    <div>
                                                        <label
                                                            htmlFor={`diaChiTinDang.soNha`}
                                                        >
                                                            Số nhà, đường:
                                                        </label>
                                                        <Field
                                                            name={`diaChiTinDang.soNha`}
                                                            id={`diaChiTinDang.soNha`}
                                                            value={values.diaChiTinDang.soNha}
                                                            component={Input}
                                                            status={
                                                                errors?.diaChiTinDang?.soNha &&
                                                                    touched?.diaChiTinDang?.soNha
                                                                    ? 'error'
                                                                    : ''
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        ></Field>
                                                        <ErrorMessage
                                                            className="field-error"
                                                            component="div"
                                                            name={`diaChiTinDang.soNha`}
                                                        ></ErrorMessage>
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor={`diaChiTinDang.tinhTPCode`}
                                                        >
                                                            Tỉnh/Thành phố: <RequiredIcon />
                                                        </label>
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            name={`diaChiTinDang.tinhTPCode`}
                                                            id={`diaChiTinDang.tinhTPCode`}
                                                            value={values.diaChiTinDang.tinhTPCode}
                                                            status={
                                                                errors?.diaChiTinDang?.tinhTPCode &&
                                                                    touched?.diaChiTinDang?.tinhTPCode
                                                                    ? 'error'
                                                                    : ''
                                                            }
                                                            onChange={
                                                                (value) => {
                                                                    if (values?.diaChiTinDang?.quanHuyenCode && values?.diaChiTinDang?.phuongXaCode) {
                                                                        values.diaChiTinDang.quanHuyenCode = null;
                                                                        values.diaChiTinDang.phuongXaCode = null;
                                                                    }
                                                                    setFieldValue(
                                                                        `diaChiTinDang.tinhTPCode`,
                                                                        value
                                                                    )
                                                                    onChangeTinhTP(value)
                                                                }
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="Chọn Tỉnh/Thành phố"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '')
                                                                    .toLowerCase()
                                                                    .includes(input.toLowerCase())
                                                            }
                                                            fieldNames={{ label: 'ten', value: 'id' }}
                                                            options={tinhThanh.data}
                                                        ></Select>
                                                        <ErrorMessage
                                                            className="field-error"
                                                            component="div"
                                                            name={`diaChiTinDang.tinhTPCode`}
                                                        ></ErrorMessage>
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor={`diaChiTinDang.quanHuyenCode`}
                                                        >
                                                            Quận/Huyện: <RequiredIcon />
                                                        </label>
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            name={`diaChiTinDang.quanHuyenCode`}
                                                            id={`diaChiTinDang.quanHuyenCode`}
                                                            value={values.diaChiTinDang.quanHuyenCode}
                                                            status={
                                                                errors?.diaChiTinDang?.quanHuyenCode &&
                                                                    touched?.diaChiTinDang?.quanHuyenCode
                                                                    ? 'error'
                                                                    : ''
                                                            }
                                                            onChange={(value) => {
                                                                if (values?.diaChiTinDang?.phuongXaCode) {
                                                                    values.diaChiTinDang.phuongXaCode = null;
                                                                }
                                                                setFieldValue(
                                                                    `diaChiTinDang.quanHuyenCode`,
                                                                    value
                                                                );
                                                                onChangeQuanHuyen(value)
                                                            }
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="Chọn Quận/Huyện"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '')
                                                                    .toLowerCase()
                                                                    .includes(input.toLowerCase())
                                                            }
                                                            fieldNames={{ label: 'ten', value: 'id' }}
                                                            options={quanHuyen}
                                                        ></Select>
                                                        <ErrorMessage
                                                            className="field-error"
                                                            component="div"
                                                            name={`diaChiTinDang.quanHuyenCode`}
                                                        ></ErrorMessage>
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor={`diaChiTinDang.phuongXaCode`}
                                                        >
                                                            Phường/Xã: <RequiredIcon />
                                                        </label>
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            name={`diaChiTinDang.phuongXaCode`}
                                                            id={`diaChiTinDang.phuongXaCode`}
                                                            value={values.diaChiTinDang.phuongXaCode}
                                                            status={
                                                                errors?.diaChiTinDang?.phuongXaCode &&
                                                                    touched?.diaChiTinDang?.phuongXaCode
                                                                    ? 'error'
                                                                    : ''
                                                            }
                                                            onChange={(value) => {
                                                                setFieldValue(
                                                                    `diaChiTinDang.phuongXaCode`,
                                                                    value
                                                                );
                                                            }
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="Chọn Phường/Xã"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '')
                                                                    .toLowerCase()
                                                                    .includes(input.toLowerCase())
                                                            }
                                                            fieldNames={{ label: 'ten', value: 'id' }}

                                                            options={phuongXa}
                                                        ></Select>
                                                        <ErrorMessage
                                                            className="field-error"
                                                            component="div"
                                                            name={`diaChiTinDang.phuongXaCode`}
                                                        ></ErrorMessage>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Button
                                                    loading={loading}
                                                    onClick={handleSubmit}
                                                    htmlType="submit"
                                                    type='primary'
                                                    className='bg-[#ffba00]'
                                                >
                                                    Cập nhật tin đăng
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                    }
                </Formik >
                : null}
        </div>
    );
};

export default EditPost