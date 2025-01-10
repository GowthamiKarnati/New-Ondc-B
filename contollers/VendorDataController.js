const getRecords = require('./function')
const VendorData = async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_ONDC;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = 21205795;

        const cleanedValue = req.query.cleanedValue || '';
        console.log('cleanedValue', cleanedValue)
        // Construct the criteria string
        const criteria = `sheet_${sheetId}.column_155="${cleanedValue}"`;

        const customersRecords = await getRecords(url, headers, sheetId, criteria);
        res.send({ data: customersRecords });

    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

  module.exports = VendorData;