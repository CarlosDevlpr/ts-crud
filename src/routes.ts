import Router, { Request, Response } from 'express'

import { authController } from '@controllers/AuthController'
import { userController } from '@controllers/UserController'
import { RRegisterSchema, RLoginSchema, RUpdateMeSchema, RDeleteUserSchema } from '@schemas/AuthSchemas'
import { verifyJWT } from '@utils/jwt'

const route = Router()

const validate = (schema: any) => async (req: Request, res: Response, next: any) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
            files: req.files
        }, { stripUnknown: true })

        return next()
    } catch (err) {
        return res.status(400).json({ type: err.name, message: err.message })
    }
}
const renderController = (controller: any, method: string) => async (request: Request, response: Response) => controller(request, response)[method]()

route.get('/status', (request: Request, response: Response) => {
    return response.status(200).json({
        status: 'available'
    })
})

// [API] Auth
route.post('/login', [validate(RLoginSchema)], renderController(authController, 'login'))
route.post('/register', [validate(RRegisterSchema)], renderController(authController, 'register'))

// [API] Me
route.get('/me', [verifyJWT], renderController(userController, 'getMe'))
route.put('/me', [verifyJWT, validate(RUpdateMeSchema)], renderController(userController, 'updateMe'))

// [API] Delete User
route.delete('/user/:userId', [verifyJWT, validate(RDeleteUserSchema)], renderController(userController, 'deleteUser'))

export default route