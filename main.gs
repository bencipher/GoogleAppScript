function generateUniqueId () {
  return new Date ().getTime () + '-' + Math.floor (Math.random () * 10000);
}

function getOrCreateResponseSpreadsheet(formTitle) {
  console.log(formTitle)
  var spreadsheets = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    var existingSpreadsheet = null;

    console.log(spreadsheets)
    console.log('Has file: ', spreadsheets.hasNext())
    while (spreadsheets.hasNext())
    {
        var file = spreadsheets.next();
        if (file.getName() === formTitle)
        {
            existingSpreadsheet = SpreadsheetApp.openById(file.getId());
            break;
        }
    }

    // If no existing spreadsheet found, create a new one
    if (!existingSpreadsheet)
    {
        existingSpreadsheet = SpreadsheetApp.create(formTitle);
    }

    var sheet = existingSpreadsheet.getActiveSheet();
  
  if (!sheet.getRange(1, 1).getValue()) {
    var headers = [
      'id', 'full_name', 'mobile', 'email', 'attending',
      'num_to_expect', 'special_request', 'subscribe_for_marketing', 'date_registered'
    ];
    var types = ['text', 'text', 'text', 'text', 'text', 'number', 'text', 'boolean', 'date'];
    for (var i = 0; i < headers.length; i++) {
      sheet.getRange(1, i + 1).setValue(headers[i]);
      var column = sheet.getRange(2, i + 1, sheet.getMaxRows() - 1);
      if (types[i] === 'boolean') {
        column.setNumberFormat('@STRING@');
      } else if (types[i] === 'number') {
        column.setNumberFormat('0');
      } else if (types[i] === 'date') {
        column.setNumberFormat('yyyy-mm-dd');
      }
    }
  }
  return existingSpreadsheet;
}

function AddRecordToSheet(spreadsheet, rowData) {
  var sheet = spreadsheet.getSheetByName('Sheet1');
  rowData.push(new Date());
  sheet.appendRow(rowData);
}

function onSubmitForm(event) {
  var existingForm = FormApp.getActiveForm();
  var formResponses = existingForm.getResponses();
  console.log(existingForm.getTitle())
  var spreadsheet = getOrCreateResponseSpreadsheet(existingForm.getTitle());

  if (formResponses.length > 0) {
    var formResponse = formResponses[formResponses.length - 1];
    var itemResponses = formResponse.getItemResponses();

    var uniqueId = generateUniqueId(); 
    var full_name = itemResponses[0].getResponse();
    var mobileNo = itemResponses[1].getResponse();
    var userEmail = itemResponses[2].getResponse();
    var attending = itemResponses[3].getResponse();
    var numToExpect = itemResponses[4].getResponse();
    var specialRequest = itemResponses[5].getResponse();
    var subscribeForMarketing = itemResponses[6].getResponse();
    
    var data = [uniqueId, full_name, mobileNo, userEmail, attending, numToExpect, specialRequest, subscribeForMarketing];
    AddRecordToSheet(spreadsheet, data);
  }
}
