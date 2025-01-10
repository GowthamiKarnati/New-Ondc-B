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
        return res.status(400).json({ error: 'Unsupported file type' });
      }
      const buffer = Buffer.from(base64Data.replace(/^data:.*;base64,/, ''), 'base64');
      fs.writeFileSync('test_upload.png', buffer);
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
      //console.log(fileresponse.data);
      return res.json({ msg: fileresponse.data });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Internal Server Error');
    }
}
module.exports = fileUpload;