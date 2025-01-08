const postRecords = require('./postFunction')
const createVendor = async(req, res)=>{
    console.log(req.body);
    try{
    const url = process.env.TIGERSHEET_API_ONDC_CREATE_URL;
      const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_ONDC_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      const sheetId = process.env.TIGERSHEET_ONDC_VENDOR_CREATE_SHEET_ID;
      const {legalEntityName,
        contactPersonName,
        designation,
        contactNumber,
        emailId,
        address,
        state,
        pinCode,
        panCardNumber,
        typeOfEntity,
        isMsme,
        udyamFiles,
        isGst,
        gstFiles,
        gstNumber,
        bankName,
        beneficiaryName,
        accountNumber,
        ifscCode,
        cancelledFiles,
        interested, 
        notinterested,
        tradeName,
        cinNo,
        CoiFile,
        msmeNumber,
        panCard
        } = req.body;
      const dataField = {
        "28":{"value": legalEntityName},
        "150": {"value": contactPersonName},
        "151": {"value": designation},
        "157": {"value": contactNumber},
        "38": {"value": emailId},
        "152": {"value": address},
        "153": {"value": state},
        "156": {"value": pinCode},
        "155": {"value": panCardNumber},
        "31": {"value": typeOfEntity},
        "36": {"value": isMsme},
        "178": {"value": isGst},
        //"179": {"value": gstFiles},
        "30": {"value": gstNumber},
        "32": {"value": bankName},
        "35": {"value": beneficiaryName},
        "34": {"value": accountNumber},
        "33": {"value": ifscCode},
        //"180": {"value": cancelledFiles},
        "41": {"value": interested},
        "40": {"value": notinterested},
        "187": {"value": tradeName},
        "188": {"value": cinNo},
        "190": {"value": msmeNumber}
      }
      const createFileData = (file) => ({
        name: file.name,
        uploaded_name: file.uploaded_name,
        path: file.path,
        size: file.size,
        status: file.status,
        filepath: file.uploaded_name,
        fullpath: file.path
      });
    
      // Add pancard data if available
      if (udyamFiles && udyamFiles.length > 0) {
        const formattedUdyamData = udyamFiles.map(createFileData);
        dataField["37"] = { "value": JSON.stringify(formattedUdyamData) };
      }
      if (gstFiles && gstFiles.length > 0) {
        const formattedGstData =gstFiles.map(createFileData);
        dataField["179"] = { "value": JSON.stringify(formattedGstData) };
      }
      if (cancelledFiles && cancelledFiles.length > 0) {
        const singleFile = cancelledFiles[0];
        const formattedChequeData = createFileData(singleFile);
        dataField["180"] = { "value": JSON.stringify([formattedChequeData]) };
      }
      if (CoiFile && CoiFile.length > 0) {
        const formattedCoiFile =
          CoiFile.length === 1
            ? [createFileData(CoiFile[0])] 
            : CoiFile.map(createFileData); 
        dataField["189"] = { "value": JSON.stringify(formattedCoiFile) };
      }
      if(panCard && panCard.length > 0){
        const formattedPanFile =
          panCard.length === 1
            ? [createFileData(panCard[0])] 
            : panCard.map(createFileData); 
        dataField["29"] = { "value": JSON.stringify(formattedPanFile) };
      }
      const data = JSON.stringify(dataField);
      const tyreData = await postRecords(url, headers, sheetId, data);
      console.log('TyreData:', tyreData);
      res.send({ data: tyreData });  
      }catch(err){
        console.log(err);
      }    
}

module.exports = createVendor;
