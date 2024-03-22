import type { Response } from 'express'

export interface AuthLocals {
  user: {
    id: number
    timestamp: Date
  }
  authenticated: boolean,
  token: string
}

export type AuthResponse = Omit<Response, 'locals'> & {
  locals: AuthLocals
}
