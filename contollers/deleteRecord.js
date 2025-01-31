const axios = require('axios');
const FormData = require('form-data');

async function deleteRecords(subSheetId, sheetId, recordId, parent_column_id, selectedPOId) {
    const url = process.env.TIGERSHEET_API_ONDC_DELETE_RECORDS;
    if (!selectedPOId || selectedPOId.length === 0) {
        console.error("No records to delete.");
        return;
    }
    const deleteRecordIds = selectedPOId.join(",");
    const formData = new FormData();
    formData.append("sheet_id", subSheetId);
    formData.append("delete_record_ids", deleteRecordIds);
    formData.append("parent_sheet_id", sheetId);
    formData.append("parent_record_id", recordId || "");
    formData.append("parent_column_id", parent_column_id || "");
    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
                ...formData.getHeaders()
            }
        });
        return response.data.success;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error.message;
    }
}

module.exports = deleteRecords;
