import { userSchema } from '@schemas/UserSchemas'
import { UserService } from "@services/UserService"

import { tokenSchema } from '@schemas/AuthSchemas'

import { createJWT } from '@utils/jwt'
import { Request, Response } from 'express'
import { InferType } from 'yup'
import { ResponseController } from '@controllers/ResponseController'

export const authController = (request: Request, response: Response) => {
    const userService = UserService()    
    const responseController = ResponseController(request, response)

    const login = async () => {
        const responseSerialize = responseController.serialize<InferType<typeof tokenSchema>>(tokenSchema)
        const rememberMe = request.body.rememberMe

        try {
            const hasUser = await userService.findByEmailAndPassword(request.body.email, request.body.password)

            const token = rememberMe ? createJWT(hasUser, '30d') : createJWT(hasUser)
            const parsedToken = await responseSerialize({ token })

            return responseController.ok(parsedToken)
        } catch (err) {
            return responseController.notFound('User and/or password invalid')
        }
    }

    const register = async () => {
        const responseSerialize = responseController.serialize<InferType<typeof userSchema>>(userSchema)

        const hasUser = await userService.findByEmail(request.body.email)

        if (hasUser) return responseController.conflict('User with this email already exist')

        const createdUser = await userService.create(request.body)
        const parsedUser = await responseSerialize(createdUser)
    
        return responseController.ok(parsedUser)
    }

    return { login, register }
} 
