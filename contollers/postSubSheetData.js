const axios = require('axios');
async function postSubSheetData(url, headers, subSheet_id, data1, parent_sheet_id, parent_record_id, parent_column_id) {
    const payload = {
      'sheet_id': subSheet_id,
      'value': JSON.stringify(data1),
      'parent_sheet_id': parent_sheet_id,
      'parent_record_id': parent_record_id,
      'parent_column_id': parent_column_id,
    }
    const response = await axios.post(url, payload, { headers });
    //console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data;
  }
  module.exports = postSubSheetData;