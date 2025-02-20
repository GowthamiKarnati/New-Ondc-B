const postRecords = require('./postFunction');
const postSubSheetData = require('./postSubSheetData');
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
        //purchaseOrderNumber,
        invoiceNumber,
        ondcContactPocId,
        ondcContactPocName,
        files,
        serviceAcceptanceFile,
        selectedPoNumbers
        } = req.body;
        const subSheetData = selectedPoNumbers.map((po, index) => ({
          "246": {
            "value": `{"reference_column_id":"${po.id}","value":"${po.number}"}`,
            "record_id": -(index + 1)
          },
        }));       
        const dataField = {
          "158": { "value": vendorPanNumber },
          "60": { "value": `{"reference_column_id":"${record_id}","value":"${vendorName}"}` },
          "56": { "value": invoiceDate },
          "58": {"value": invoiceValue},
          "78": { "value": `{"reference_column_id":"${ondcContactPocId}","value":"${ondcContactPocName}"}` },
          "55": {"value" : invoiceNumber},
          "245": {
            "value": subSheetData,
            "sub_sheet_id": process.env.TIGERSHEET_ONDC_INVOICE_UPLOAD_SUB_SHEET_ID
          }
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
        if(serviceAcceptanceFile && serviceAcceptanceFile.length > 0){
          const formattedServiceFile = serviceAcceptanceFile.map(createFileData);
          dataField["224"] = { "value": JSON.stringify(formattedServiceFile) };
        }
        const data = JSON.stringify(dataField);
        const tyreData = await postRecords(url, headers, sheetId, data);
        res.send({ data: tyreData });
        } catch (err) {
          console.error('Error in fetching data:', err.message);
          res.status(500).send('Internal Server Error');
        }
  }
  module.exports = uploadInvoice;