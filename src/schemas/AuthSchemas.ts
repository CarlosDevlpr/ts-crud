import * as yup from 'yup'

export const registerSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    phone: yup.string().required()
})
export const RRegisterSchema = yup.object({
    body: registerSchema
})

export const updateMeSchema = yup.object({
    name: yup.string(),
    email: yup.string(),
    password: yup.string(),
    phone: yup.string()
})

export const RUpdateMeSchema = yup.object({
    body: updateMeSchema
})


export const loginSchema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
})
export const RLoginSchema = yup.object({
    body: loginSchema
})


export const RDeleteUserSchema = yup.object({
    params: yup.object({
        userId: yup.number().required()
    })
})


export const tokenSchema = yup.object({
    token: yup.string().required(),
})
