const axios = require("axios");
const deleteRecords = require("./deleteRecord");

const updateInvoice = async (req, res) => {
	try {
		const url = process.env.TIGERSHEET_API_UPDATE_URL;
		const headers = {
			Authorization: process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		};
		const sheetId = process.env.TIGERSHEET_ONDC_UPLOAD_INVOICE_SHEET_ID;
		const {
			invoiceDate,
			invoiceValue,
			purchaseOrderNumber,
			invoiceNumber,
			ondcContactPocId,
			ondcContactPocName,
			files,
			updateRecordId,
			serviceAcceptanceFile,
			selectedPoNumbers,
			selectedPOId,
		} = req.body;
		console.log("selectedPOId", selectedPOId);
		const recordId = updateRecordId;
		const subSheetId = process.env.TIGERSHEET_ONDC_INVOICE_UPLOAD_SUB_SHEET_ID;
		const parent_column_id = 245;
		const subSheetData = Array.isArray(selectedPoNumbers)
			? selectedPoNumbers.map((po, index) => ({
					246: {
						value: `{"reference_column_id":"${po.id}","value":"${po.number}"}`,
						record_id: -(index + 1),
					},
			  }))
			: [];
		const dataField = {
			56: { value: invoiceDate },
			58: { value: invoiceValue },
			57: { value: purchaseOrderNumber },
			78: { value: `{"reference_column_id":"${ondcContactPocId}","value":"${ondcContactPocName}"}` },
			55: { value: invoiceNumber },
			245: {
				value: subSheetData,
				sub_sheet_id: process.env.TIGERSHEET_ONDC_INVOICE_UPLOAD_SUB_SHEET_ID,
			},
		};
		const createFileData = (file) => ({
			name: file.name,
			uploaded_name: file.uploaded_name,
			path: file.path,
			size: file.size,
			status: file.status,
			filepath: file.uploaded_name,
			fullpath: file.path,
		});
		if (files && files.length > 0) {
			const formattedHouseImageData = files.map(createFileData);
			dataField["159"] = { value: JSON.stringify(formattedHouseImageData) };
		}
		if (serviceAcceptanceFile && serviceAcceptanceFile.length > 0) {
			const formattedServiceFile = serviceAcceptanceFile.map(createFileData);
			dataField["224"] = { value: JSON.stringify(formattedServiceFile) };
		}
		const data = JSON.stringify(dataField);
		const deleteRecord = await deleteRecords(
			process.env.TIGERSHEET_ONDC_INVOICE_UPLOAD_SUB_SHEET_ID,
			sheetId,
			updateRecordId,
			245,
			selectedPOId
		);
		const updateResponse = await getUpdate(url, headers, sheetId, recordId, data);
		if (!updateResponse || updateResponse.error) {
			return res.status(500).send({ error: "Something went wrong while updating the record." });
		}
		res.send({ msg: "Record Updated successfully", data: updateResponse });
	} catch (e) {
		console.log(e);
	}
};
async function getUpdate(url, headers, sheetId, recordId, data) {
	try {
		const payload = {
			sheet_id: sheetId,
			record_id: recordId,
			data: data,
		};

		const response = await axios.post(url, payload, { headers });
		return response.data;
	} catch (error) {
		console.error("Error updating record:", error.response ? error.response.data : error.message);
		return { error: "Failed to update record." };
	}
}

module.exports = updateInvoice;
