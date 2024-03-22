import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Utils } from '../utils';

const APP_VERSION = Utils.getAppVersion()

export async function ping (_req: Request, res: Response): Promise<void> {
  res.status(StatusCodes.OK).send('Pong!');
}

export async function version (_req: Request, res: Response): Promise<void> {
  res.status(StatusCodes.OK).send(`Authentication API v${APP_VERSION}`)
}
