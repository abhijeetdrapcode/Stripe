
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


router.get('/', customerController.createCustomer);

router.get('/testing', customerController.renderTestPage,);

router.get('/payment',customerController.renderPaymentPage);

router.get('/pay',customerController.renderTestingPage);

router.get('/success',customerController.renderSuccessPage);

router.post('/create-payment-intent', customerController.createPayment);

module.exports = router;