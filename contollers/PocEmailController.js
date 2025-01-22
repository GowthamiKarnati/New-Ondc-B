const getRecords = require('../contollers/function')
const pocName= async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_ONDC;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_ONDC_POC_SHEET_ID;
        const email = req.query.verifyValue || '';
        const criteria = `sheet_${sheetId}.column_75="${email}"`;
        const limit = 0;
        const columns = 'column_74, column_75';

        const customersRecords = await getRecords(url, headers, sheetId, criteria, limit, columns);
        res.send({ data: customersRecords });
  
    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
  };
  module.exports = pocName;