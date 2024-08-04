"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchOrder = exports.deleteOrder = exports.postOrder = exports.getAllOrders = exports.getOrderById = void 0;
const ordersModel_1 = require("../models/ordersModel");
const getOrderById = (req, res, next) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;
    (0, ordersModel_1.findOrderById)(fanId, orderId)
        .then((order) => {
        res.status(200).send({ order });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getOrderById = getOrderById;
const getAllOrders = (req, res, next) => {
    const fanId = req.params.fanId;
    (0, ordersModel_1.findAllOrders)(fanId)
        .then((orders) => {
        res.status(200).send({ orders });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getAllOrders = getAllOrders;
const postOrder = (req, res, next) => {
    var _a, _b;
    const fanId = req.params.fanId;
    const newOrder = req.body;
    const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : '';
    (0, ordersModel_1.addOrder)(fanId, newOrder, token).then((order) => {
        res.status(201).send(order);
    })
        .catch((error) => {
        next(error);
    });
};
exports.postOrder = postOrder;
const deleteOrder = (req, res, next) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;
    (0, ordersModel_1.removeOrder)(fanId, orderId).then((order) => {
        res.status(204).send(order);
    })
        .catch((error) => {
        next(error);
    });
};
exports.deleteOrder = deleteOrder;
const patchOrder = (req, res, next) => {
    const fanId = req.params.fanId;
    const orderId = req.params.orderId;
    const updatedFields = req.body;
    (0, ordersModel_1.editOrder)(fanId, orderId, updatedFields).then((order) => {
        res.status(200).send(order);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchOrder = patchOrder;
