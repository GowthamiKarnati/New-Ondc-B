const axios = require('axios');
const updateInvoice = async(req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_UPDATE_URL;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_ONDC_UPLOAD_INVOICE_SHEET_ID
        const {invoiceDate, invoiceValue, purchaseOrderNumber, invoiceNumber, ondcContactPocId, ondcContactPocName, files, record_id, updateRecordId} = req.body;
        console.log('invoiceValue', invoiceValue)
        const recordId = updateRecordId;
        const dataField = {
       // "158": { "value": vendorPanNumber },
        //"60": { "value": `{"reference_column_id":"${record_id}","value":"${vendorName}"}` },
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
            const formattedHouseImageData = files.map(createFileData);
            dataField["159"] = { "value": JSON.stringify(formattedHouseImageData) };
        }
        const data = JSON.stringify(dataField);
        //console.log(data);
        const PhotoData = await getUpdate(url, headers, sheetId, recordId, data);
        //console.log('PhotoData:', PhotoData);
        res.send({ msg: "Files updated successfully" });

    }catch(e){
        console.log(e)
    }

}
async function getUpdate(url, headers, sheetId, recordId, data) {
    const payload = {
      'sheet_id': sheetId,
      'record_id': recordId,
      'data': data
    };
   // console.log("payload  ......",payload);
    const response = await axios.post(url, payload, { headers });
    return response.data;
  }

module.exports = updateInvoice
