import * as yup from 'yup'

export const userSchema = yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    email: yup.string().email().required().trim(),
    phone: yup.string(),
    deleted: yup.bool()
})