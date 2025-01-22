const getRecords = require('../contollers/function')
const getPoNumbers= async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_ONDC;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_ONDC_PO_SHEET_ID;
        const vendorName = req.query.vendorName || '';
        const poStatus = 'Open';
        const criteria = `sheet_${sheetId}.column_207="${vendorName}" AND sheet_${sheetId}.column_218="${poStatus}"`;
        const limit = 0;
        const columns = 'column_207,column_208';
       

        const poNumbers = await getRecords(url, headers, sheetId, criteria, limit, columns);
        res.send({ data: poNumbers });
  
    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
  };
  module.exports = getPoNumbers;