import { Request, Response, NextFunction } from "express";
import { getTickeyById } from "@/services/tickets.service";
import { getPaymentsbyTicketId as get} from "@/services/payments.service";
import httpStatus from "http-status";
import { postPaymentProcess as post } from "@/services/payments.service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getPaymentsbyTicketId(req:AuthenticatedRequest, res: Response, next: NextFunction){

    const idTicket = Number(req.query.ticketId);
    const {userId} = req;
    const idUser = userId;
    if(!idTicket){
        return res.sendStatus(400);
    }

    try{const payment = await get(idUser, idTicket);
    if (!payment) 
    {return res.sendStatus(httpStatus.NOT_FOUND);}
    return res.status(httpStatus.OK).send(payment);
}

    catch(e){
        next(e);
    }

}

export async function postPaymentProcess(req: AuthenticatedRequest, res:Response, next: NextFunction){
    const {userId} = req;
  const { ticketId, cardData } = req.body;

  if(!ticketId || !cardData){
    return res.sendStatus(400)
  }

  try{
    const payment = await post(ticketId, userId, cardData)
    if (!payment){return res.sendStatus(404)}
    return res.status(httpStatus.OK).send(payment);
  }
  catch(e){
    next(e);
  }
}