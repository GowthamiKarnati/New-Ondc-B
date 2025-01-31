const fs = require('fs');
const FormData = require("form-data");
const axios = require('axios');
const fileUpload = async (req, res) => {
    try {
      const url = process.env.TIGERSHEET_API_ONDC_FILE_UPLOAD_URL;
      const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
        'Content-Type': 'multipart/form-data',
      };
      const base64Data = req.body.base64Data;
      const fileType = req.body.mimeType;
      let fileExtension;
      let mimeType;
      if (fileType.startsWith('image/')) {
        fileExtension = fileType.split('/')[1];
        mimeType = fileType;
      } else if (fileType === 'application/pdf') {
        fileExtension = 'pdf';
        mimeType = 'application/pdf';
      } else {
        throw new Error('Unsupported file type: ' + fileType);
      }
      const buffer = Buffer.from(base64Data.replace(/^data:.*;base64,/, ''), 'base64');
      //fs.writeFileSync('test_upload.png', buffer);
      const fileName = `uploaded_file.${fileExtension}`;
      const formData = new FormData();
      formData.append('Filedata[]', buffer, {
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
      console.error('File upload error:', err);

      if (err.response) {
          // Axios received a response with an error status
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          return res.status(err.response.status).json({ error: err.response.data });
      } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          return res.status(500).json({ error: 'No response received from server' });
      } else {
          // Something else went wrong
          console.error('Error message:', err.message);
          return res.status(500).json({ error: err.message });
      }
  }
}
module.exports = fileUpload;