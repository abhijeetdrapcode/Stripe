const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer); // to get the clientSecret and customerId

router.get('/payment',customerController.renderAccountPage);// to render the ejs file

router.get('/financial-accounts/:customerId', customerController.getFinancialAccounts); //to get the bank details

module.exports = router;