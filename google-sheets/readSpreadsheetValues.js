
const fs = require('fs-extra');
const { google } = require('googleapis');

const spreadsheetId = process.env.SPREADSHEET_ID;
const MIN_TIME_BETWEEN_READS_MILLIS = 60 * 60 * 1000; // one hour

const DATA_FILE_NAME = `${ __dirname }/tmp/data.json`;
const DEFAULT_DATA_VALUES = {
  cachedSpreadsheetValues: null,
  lastReadTimestampMillis: null,
};
let {
  cachedSpreadsheetValues,
  lastReadTimestampMillis,
} = readInitialDataFromFile() || DEFAULT_DATA_VALUES;

function readInitialDataFromFile() {
  let data = null;
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE_NAME, { encoding: 'utf-8' }, err => { throw err }));
    console.log(`Initial data file found. Loading initial data from ${ DATA_FILE_NAME }`);
    console.log(`lastReadTimestampMillis that will be read from ${ DATA_FILE_NAME }: ${ data.lastReadTimestampMillis }`);
  } catch (err) {
    // If file does not exist, it will be created later. Ignore ENOENT for now.
    if (err.code !== 'ENOENT') {
      console.error(`Error occurred while attempting to read initial data from file. err: ${ err }`);
    }
  }

  return data;
}

function formatSpreadsheetValues(values) {
  return values.map(v => ({
    date: v[0],
    description: v[1],
    amount: v[2], 
  }));
}

function writeDataToFile(data) {
  fs.outputFile(DATA_FILE_NAME, JSON.stringify(data), { encoding: 'utf-8' }, err => {
    if (err) {
      console.error(`Failed to write data to file after reading from Google Sheets. Error ${ JSON.stringify(err) }`);
    } else {
      console.log(`Update cached spreadsheet values succeeded (values written to file: ${ DATA_FILE_NAME }).`);
    }
  });
}

function getJwt() {
  const credentials = require("./credentials.json");
  return new google.auth.JWT(
    credentials.client_email, null, credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

function getApiKey() {
  const apiKeyFile = require("./api_key.json");
  return apiKeyFile.key;
}

const readSpreadsheetValues = () => new Promise((resolve, reject) => {
  const jwtClient = getJwt();
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Successfully connected!");
    }
   });

  const sheets = google.sheets({ version: 'v4' });
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Summary!F3:H1000',
    auth: jwtClient,
  }, (err, result) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log('Read request to Google Sheets succeeded, updating cached spreadsheet values.');
      const liveSpreadsheetValues = formatSpreadsheetValues(result.data.values);
      lastReadTimestampMillis = Date.now();
      writeDataToFile({
        cachedSpreadsheetValues: liveSpreadsheetValues,
        lastReadTimestampMillis,
      });

      resolve(liveSpreadsheetValues);
    }
  });
});

module.exports = () => new Promise(async resolve => {
  const currentTimeMillis = Date.now();
  const shouldServeCachedSpreadsheetValues = !!lastReadTimestampMillis && currentTimeMillis - lastReadTimestampMillis < MIN_TIME_BETWEEN_READS_MILLIS;

  console.log(`currentTimeMillis: ${ currentTimeMillis }`);
  console.log(`lastReadTimestampMillis: ${ lastReadTimestampMillis }`);
  console.log(`MIN_TIME_BETWEEN_READS_MILLIS: ${ MIN_TIME_BETWEEN_READS_MILLIS }`);
  console.log(`shouldServeCachedSpreadsheetValues: ${ shouldServeCachedSpreadsheetValues }`);

  let spreadsheetValues;
  if (shouldServeCachedSpreadsheetValues) {
    console.log('Serving cached spreadsheet values...');
    spreadsheetValues = cachedSpreadsheetValues;
  } else {
    console.log('Time since last request to Google Sheets exceeds minimum threshhold, executing request to Google Sheets and updating cache...');
    const liveSpreadsheetValues = await readSpreadsheetValues();
    spreadsheetValues = liveSpreadsheetValues;
  }

  resolve(spreadsheetValues);
});
