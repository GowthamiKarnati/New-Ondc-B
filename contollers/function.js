const axios =  require('axios');
async function getRecords(url, headers, sheetId, criteria, limit = null, columns = null) {
    const payload = {
        'sheet_id': sheetId,
        'criteria': criteria,
    };
    if (limit !== null) {
      payload.limit = limit;
    }
    if (columns !== null) {
      payload.showFields = columns;
    }
    const response = await axios.post(url, payload, { headers });
    //console.log('All Records from Tigersheet Backend for Customers', response.data);
  
    return response.data.data;
  }
  module.exports = getRecords;