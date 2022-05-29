import { Request, Response } from "express";

export interface IRequest extends Request {}

export interface IResponse extends Response {}

export interface ApiResponse {
  status: number;
  message: string;
}