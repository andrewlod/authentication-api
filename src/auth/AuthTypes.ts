import type { Response } from 'express'

export interface AuthLocals {
  user: {
    id: number
    email: string
    isAdmin: boolean
    timestamp: Date
  }
  authenticated: boolean
}

export type AuthResponse = Omit<Response, 'locals'> & {
  locals: AuthLocals
}
