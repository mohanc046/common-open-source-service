const _ = require('lodash');

const isValidGSTIN = (gstin) => {
    // Regular expression to validate the GSTIN format
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/gm;

    // Clean up the GSTIN (trim whitespace and convert to uppercase using Lodash)
    gstin = _.trim(gstin).toUpperCase();

    // Validate the GSTIN using RegExp
    return gstinPattern.test(gstin);  // This is the key for matching the pattern
}

module.exports = { isValidGSTIN };
