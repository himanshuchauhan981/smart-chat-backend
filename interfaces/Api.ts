import { Request, Response } from "express";

export interface User {
  id: string;
  iat: number;
  exp: number;
}

export interface IRequest extends Request {
  user?: User
}

export interface IResponse extends Response {}

export interface ApiResponse {
  status: number;
  message: string;
}