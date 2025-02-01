const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const fileUpload = async (req, res) => {
	try {
		const url = process.env.TIGERSHEET_API_ONDC_FILE_UPLOAD_URL;
		const headers = {
			Authorization: process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
			"Content-Type": "multipart/form-data",
		};
		const base64Data = req.body.base64Data;
		const fileType = req.body.mimeType;
    if (!base64Data || !fileType) {
			return res.status(400).json({ error: "Missing file data or file type" });
		}
		let fileExtension;
		let mimeType;
		if (fileType.startsWith("image/")) {
			fileExtension = fileType.split("/")[1];
			mimeType = fileType;
		} else if (fileType === "application/pdf") {
			fileExtension = "pdf";
			mimeType = "application/pdf";
		} else {
			return res.status(415).json({ error: "Unsupported file type: " + fileType });
		}
		const buffer = Buffer.from(base64Data.replace(/^data:.*;base64,/, ""), "base64");
		//fs.writeFileSync('test_upload.png', buffer);
		const fileName = `uploaded_file.${fileExtension}`;
		const formData = new FormData();
		formData.append("Filedata[]", buffer, {
			filename: fileName,
			contentType: mimeType,
			knownLength: buffer.length,
		});
		const fileresponse = await axios.post(url, formData, {
			headers: {
				...headers,
				...formData.getHeaders(), // Include FormData headers
			},
		});
		return res.json({ msg: fileresponse.data });
	} catch (err) {
		console.error("Unexpected Error:", err.message);
		return res.status(500).json({ error: "File upload failed due to server error" });
	}
};
module.exports = fileUpload;
