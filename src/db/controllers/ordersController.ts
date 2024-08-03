import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import { findOrderById, findAllOrders, addOrder, removeOrder, editOrder } from "../models/ordersModel";
import { NewOrder } from "../../helpers/interfaces";

export const getOrderById = (req: Request, res: Response, next: NextFunction) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;

    findOrderById(fanId, orderId)
    .then((order) => {
        res.status(200).send({order});
    })
    .catch((error: CustomError) => {
        next(error);
    });
};


export const getAllOrders = (req: Request, res: Response, next: NextFunction) => {
    const fanId = req.params.fanId;
    
    findAllOrders(fanId)
    .then((orders) => {
        res.status(200).send({orders});
    })
    .catch((error: CustomError) => {
        next(error);
    });
};

export const postOrder = (req: Request, res: Response, next: NextFunction) => {
    const fanId = req.params.fanId;
    const newOrder = req.body;
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    

    addOrder(fanId, newOrder, token).then((order: NewOrder) => {
        res.status(201).send(order);
    })
    .catch((error: CustomError) => {
        next(error);
    })
}

export const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;

    removeOrder(fanId, orderId).then((order) => {
        res.status(204).send(order);
    })
    .catch((error: CustomError) => {
        next(error);
    })
}

export const patchOrder = (req: Request, res: Response, next: NextFunction) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;
    const updatedFields = req.body;

    editOrder(fanId, orderId, updatedFields).then((order) => {
        res.status(200).send(order);
    })
    .catch((error: CustomError) => {
        next(error);
    })
}