const getRecord = require('./fetchRecord');
const getData = require('./function')

const getInvoiceData = async(req, res)=>{
   try {
      const url = process.env.TIGERSHEET_API_ONDC;
      const headers = {
          'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      const sheetId = process.env.TIGERSHEET_ONDC_UPLOAD_INVOICE_SHEET_ID;
      const invoiceNumber = req.query.number || '';
      const companyName = req.query.companyName || '';
      const criteria = `sheet_${sheetId}.column_55="${invoiceNumber}" AND sheet_${sheetId}.column_60="${companyName}"`;
      const limit = 1;
      // const columns = 'column_74, column_75';

      const invoiceData = await getData(url, headers, sheetId, criteria, limit);
      if (Array.isArray(invoiceData) && invoiceData.length > 0) {
        const recordId = invoiceData[0].record_id;
        const data = await getRecord(sheetId, recordId);
        res.send({ data: data });
      } else {
        res.status(200).send({ data: {} });
      }
  } catch (err) {
      console.error('Error in fetching data:', err.message);
      res.status(500).send('Internal Server Error');
  }
}
module.exports= getInvoiceData;