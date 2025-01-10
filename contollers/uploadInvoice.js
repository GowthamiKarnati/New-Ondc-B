const postRecords = require('./postFunction')
const uploadInvoice = async (req, res) => {
    try {
      const url = process.env.TIGERSHEET_API_ONDC_CREATE_URL;
      const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      const sheetId = process.env.TIGERSHEET_ONDC_UPLOAD_INVOICE_SHEET_ID;
      const {
        vendorPanNumber,
        vendorName,
        invoiceDate,
        invoiceValue,
        record_id,
        purchaseOrderNumber,
        invoiceNumber,
        ondcContactPocId,
        ondcContactPocName,
        files,
        } = req.body;
        console.log(req.body);
      const dataField = {
        "158": { "value": vendorPanNumber },
        "60": { "value": `{"reference_column_id":"${record_id}","value":"${vendorName}"}` },
        "56": { "value": invoiceDate },
        "58": {"value": invoiceValue},
        "57": {"value": purchaseOrderNumber},
        "78": { "value": `{"reference_column_id":"${ondcContactPocId}","value":"${ondcContactPocName}"}` },
        "55": {"value" : invoiceNumber},
      };
      const createFileData = (file) => ({
        name: file.name,
        uploaded_name: file.uploaded_name,
        path: file.path,
        size: file.size,
        status: file.status,
        filepath: file.uploaded_name,
        fullpath: file.path
      });
      if (files && files.length > 0) {
        const formattedPancardData = files.map(createFileData);
        dataField["159"] = { "value": JSON.stringify(formattedPancardData) };
      }
      const data = JSON.stringify(dataField);
      const tyreData = await postRecords(url, headers, sheetId, data);
      console.log('TyreData:', tyreData);
      res.send({ data: tyreData });
      } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
      }
  }
  module.exports = uploadInvoice;