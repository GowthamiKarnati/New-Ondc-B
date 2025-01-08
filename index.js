require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const cors = require('cors');
const FormData = require('form-data');
const vendorRoutes = require('./routes/VendorRoutes')
const fs = require('fs');

app.use(express.json({ limit: '200mb' }));
app.use(express.raw({ limit: '200mb', type: 'application/octet-stream' }));
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('uploads'));
app.use(cors({origin: '*'}));

app.use('/api/vendor', vendorRoutes);

// app.post('/vendorfileUpload', async (req, res) => {
//     try {
//       const url = process.env.TIGERSHEET_API_ONDC_FILE_UPLOAD_URL;
//       const headers = {
//         'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
//         'Content-Type': 'multipart/form-data',
//       };
//     console.log(req.body);
//       const base64Data = req.body.base64Data;
//       const fileType = req.body.mimeType;
  
//       // Determine file extension and MIME type
//       let fileExtension;
//       let mimeType;
  
//       if (fileType.startsWith('image/')) {
//         fileExtension = fileType.split('/')[1];
//         mimeType = fileType;
//       } else if (fileType === 'application/pdf') {
//         fileExtension = 'pdf';
//         mimeType = 'application/pdf';
//       } else {
//         return res.status(400).json({ error: 'Unsupported file type' });
//       }
  
//       const buffer = Buffer.from(base64Data.replace(/^data:.*;base64,/, ''), 'base64');
//       fs.writeFileSync('test_upload.png', buffer);
//       const fileName = `uploaded_file.${fileExtension}`;
//       console.log('fileName', fileName)
//       const formData = new FormData();
//       console.log('formData', formData)
//       formData.append('Filedata[]', buffer, {
//         filename: fileName,
//         contentType: mimeType,
//         knownLength: buffer.length,
//       });
  
//       const fileresponse = await axios.post(url, formData, {
//         headers: {
//           ...headers,
//           ...formData.getHeaders(), // Include FormData headers
//         },
//       });
  
//       console.log(fileresponse.data);
//       return res.json({ msg: fileresponse.data });
//     } catch (err) {
//       console.error('Error uploading file:', err);
//       res.status(500).send('Internal Server Error');
//     }
//   });

app.listen(port, ()=>{
    console.log(`server is running in http://localhost:${port}`)
})