
const fs = require('fs-extra');
const { google } = require('googleapis');
const getEnvVarIfDefined = require('@hunterhod/env-var-not-defined');

const SPREADSHEET_ID = getEnvVarIfDefined('SPREADSHEET_ID');
const GOOGLE_API_CLIENT_EMAIL = getEnvVarIfDefined('GOOGLE_API_CLIENT_EMAIL');
const GOOGLE_API_PRIVATE_KEY = JSON.parse(`{ "key": "${ getEnvVarIfDefined('GOOGLE_API_PRIVATE_KEY') }" }`).key;

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
  return new google.auth.JWT(
    GOOGLE_API_CLIENT_EMAIL, null, GOOGLE_API_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

const getSpreadsheetRange = (range, jwtClient) => new Promise((resolve, reject) => {
  const sheets = google.sheets({ version: 'v4' });
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
    auth: jwtClient,
  }, (err, result) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log(`Reading ${ range } from Google sheet...`);
      resolve(result.data.values);
    }
  });
});

const readSpreadsheetValues = () => new Promise(async (resolve, reject) => {
  const jwtClient = getJwt();
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Successfully connected!");
    }
  });

  const dayRemaining = await getSpreadsheetRange('Summary!B1', jwtClient);
  const daySpent = await getSpreadsheetRange('Summary!B2', jwtClient);
  const daySummary = await getSpreadsheetRange('Summary!A3:B1000', jwtClient);
  const weekRemaining = await getSpreadsheetRange('Summary!E1', jwtClient);
  const weekSpent = await getSpreadsheetRange('Summary!E2', jwtClient);
  const weekSummary = await getSpreadsheetRange('Summary!C3:E1000', jwtClient);
  const monthRemaining = await getSpreadsheetRange('Summary!H1', jwtClient);
  const monthSpent = await getSpreadsheetRange('Summary!H2', jwtClient);
  const monthSummary = await getSpreadsheetRange('Summary!F3:H1000', jwtClient);

  console.log('All read requests to Google Sheets succeeded, updating cached spreadsheet values.');

  const liveSpreadsheetValues = {
    daySummary: {
      dayRemaining,
      daySpent,
      transactions: daySummary.map(v => ({
        description: v[0],
        amount: v[1], 
      })),
    },
    weekSummary: {
      weekRemaining,
      weekSpent,
      transactions: formatSpreadsheetValues(weekSummary),
    },
    monthSummary: {
      monthRemaining,
      monthSpent,
      transactions: formatSpreadsheetValues(monthSummary),
    },
  };

  lastReadTimestampMillis = Date.now();
  cachedSpreadsheetValues = liveSpreadsheetValues;
  writeDataToFile({
    cachedSpreadsheetValues: liveSpreadsheetValues,
    lastReadTimestampMillis,
  });

  resolve(liveSpreadsheetValues);
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
