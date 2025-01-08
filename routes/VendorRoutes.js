const express = require('express');
const router = express.Router();
const VendorData = require('../contollers/VendorDataController')
const pocName = require('../contollers/PocEmailController')
const createVendor = require('../contollers/CreateVendor')
const uploadInvoice = require('../contollers/uploadInvoice')
const fileUpload = require('../contollers/fileUpload')

router.route('/vendor-info').get(VendorData);
router.route('/poc-name').get(pocName);
router.route('/create').post(createVendor);
router.route('/upload-invoice').post(uploadInvoice);
router.route('/file-upload').post(fileUpload);

module.exports = router;
