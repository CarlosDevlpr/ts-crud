import { User } from "@models/User";
import { userSchema } from "@schemas/UserSchemas";
import { UserService } from "@services/UserService";

import { Request, Response } from "express";
import { InferType } from "yup";
import { ResponseController } from "./ResponseController";

export const userController = (request: Request, response: Response) => {
    const currentUser: User = response.locals.currentUser
    const responseController = ResponseController(request, response)
    const userService = UserService()

    const getMe = async () => {
        const responseSerialize = responseController.serialize<InferType<typeof userSchema>>(userSchema)
        if (!currentUser) return responseController.forbidden()

        const profile = await userService.getFullProfile(currentUser.id)
        const parsedProfile = await responseSerialize(profile)

        return responseController.ok(parsedProfile)
    }

    const updateMe = async () => {
        const responseSerialize = responseController.serialize<InferType<typeof userSchema>>(userSchema)
        if (!currentUser) return responseController.forbidden()

        if (request.body.email) {
            const hasUser = await userService.findByEmail(request.body.email)
            if (hasUser) return responseController.conflict(`User with email ${request.body.email} already exists`)
        }

        const updatedProfile = await userService.update(currentUser, request.body)
        const parsedProfile = await responseSerialize(updatedProfile)

        return responseController.ok(parsedProfile)
    }

    const deleteUser = async () => {
        const responseSerialize = responseController.serialize<InferType<typeof userSchema>>(userSchema)

        const userId = Number(request.params.userId)

        const hasUser = await userService.findById(userId)
        if (!hasUser) return responseController.notFound(`User ${userId} not found`)

        const deletedUser = await userService.remove(hasUser)
        const parsedUser = await responseSerialize(deletedUser)

        return responseController.ok(parsedUser)
    }

    return { getMe, updateMe, deleteUser }
}