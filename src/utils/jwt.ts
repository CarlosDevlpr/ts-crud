import { User } from '@models/User'
import { UserService } from '@services/UserService'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { isNil, propOr } from 'ramda'

export const createJWT = (user: User, expiresIn: number | string = 48000) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn })

export const verifyJWT = (request: Request, response: Response, next: NextFunction) => {
    const token: string | null = propOr(null, 'x-access-token')(request.headers)
    if (isNil(token)) return response.status(401).json({ message: 'no token provided' })

    jwt.verify(token, process.env.JWT_SECRET || '', async (err, decoded) => {
      if (err) return response.status(500).json({ message: 'failed to authenticate token' })
      console.log(decoded)
      if (!decoded?.email) return response.status(500).json({ message: 'failed to authenticate token'})

      const currentUser = await UserService().getFullProfile(decoded?.id)
  
      response.locals.currentUser = currentUser
      next()
    })
  }