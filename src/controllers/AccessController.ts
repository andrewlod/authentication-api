import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { JWTManager } from '../auth'

interface AuthorizationHeader {
  authorization?: string
}

export async function isAuthenticated (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { authorization } = req.headers as AuthorizationHeader

  if (authorization === undefined) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Authorization header missing!'
    })
    return
  }

  if (!authorization.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Invalid token type!'
    })
    return
  }

  try {
    const decoded = JWTManager.verify(authorization.substring(7))
    res.locals.user = decoded
    res.locals.authenticated = true

    next()
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Invalid token!'
    })
  }
}
