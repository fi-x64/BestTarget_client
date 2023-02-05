import * as yup from "yup";

export const basicSchema = yup.object().shape({
    name: yup.string().min(4).max(100).required("This field is required"),
    companyName: yup.string().required("This field is required"),
    address: yup.string().required("This field is required"),
    taxNumber: yup.string().min(4).max(100).required("This field is required"),
    certNumber: yup.string().min(4).max(100).required("This field is required"),
    longitude: yup.number("This field required a number").min(-180).max(180).required("This field is required"),
    latitude: yup.number("This field required a number").min(-90).max(90).required("This field is required"),
    numColumn: yup.number("This field required a number").min(1).required("This field is required"),
    columns: yup.array().of(
        yup.object().shape({
            columnNumber: yup.string().required("This field is required"),
            columnCheckNumber: yup.string().min(4).required("This field is required"),
            columnDate: yup.date().required("This field is required"),
            columnType: yup.string().required("This field is required"),
        }),
    )
})