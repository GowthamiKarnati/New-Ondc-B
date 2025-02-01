const axios =  require('axios');
async function getRecord(sheetId, recordId) {
    const url = process.env.TIGERSHEET_API_ONDC_FETCH_RECORD
    const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    const payload = {
        'sheet_id': sheetId,
        'record_id': recordId,
    };
    const response = await axios.post(url, payload, { headers });
    return response.data.data;
  }
  module.exports = getRecord;