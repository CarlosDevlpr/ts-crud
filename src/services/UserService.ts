import dataSource from "@database/connection"
import { User } from "@models/User"
import { registerSchema, updateMeSchema } from "@schemas/AuthSchemas"
import { hashPassword } from "@utils/password"
import { InferType } from "yup"

export const UserService = () => {
    const userRepository = dataSource.getRepository(User)

    const getFullProfile = async (id: number) => await userRepository.findOne({
        cache: true,
        where: { id },
    })

    const findById = async (id: any) => await userRepository.findOne({
        where: { id },
    })

    const findByEmail = async (email: string) => await userRepository.findOneBy({ email })

    const findByEmailAndPassword = async (email: string, password: string) => await userRepository.findOneOrFail({
        where: {
            email,
            password: hashPassword(password)
        }
    })

    const create = async (user: InferType<typeof registerSchema>) => {
        const createdUser = userRepository.create({
            ...user,
            password: hashPassword(user.password)
        })

        return await userRepository.save(createdUser)
    }

    const update = async (user: User, data: InferType<typeof updateMeSchema>) => {
        const mergedUser = userRepository.merge(user, {
            ...data,
            password: data.password ? hashPassword(data.password) : user.password
        })
        return await userRepository.save(mergedUser)
    } 

    const remove = async (user: User) => {
        const deletedUser = userRepository.merge(user, { deleted: !user.deleted })
        return await userRepository.save(deletedUser)
    }

    return { create, update, remove, findByEmail, findById, findByEmailAndPassword, getFullProfile }
}