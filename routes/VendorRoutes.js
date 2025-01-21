const express = require('express');
const router = express.Router();
const VendorData = require('../contollers/VendorDataController')
const pocName = require('../contollers/PocEmailController')
const createVendor = require('../contollers/CreateVendor')
const uploadInvoice = require('../contollers/uploadInvoice')
const fileUpload = require('../contollers/fileUpload')
const getInvoiceData = require('../contollers/getInvoiceData')
const updateInvoice = require('../contollers/UpdateInvoice');
const getPocEmail = require('../contollers/getPoc');
const getPoNumbers = require('../contollers/getPoNumber');


router.route('/vendor-info').get(VendorData);
router.route('/poc-name').get(pocName);
router.route('/create').post(createVendor);
router.route('/upload-invoice').post(uploadInvoice);
router.route('/file-upload').post(fileUpload);
router.route('/get-invoice-data').get(getInvoiceData);
router.route('/update-invoice').post(updateInvoice)
router.route('/get-poc-email').get(getPocEmail);
router.route('/get-po-numbers').get(getPoNumbers)

module.exports = router;
