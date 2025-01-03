const cheerio = require('cheerio');

const _ = require('lodash');

const { StatusCodes } = require("http-status-codes");

const { fetchGSTINDetails } = require('../services');
const { isValidGSTIN } = require('../utils');


module.exports.gstinInfo = async (req, res) => {

    const { gstin = "" } = req.params || {};

    try {

        const isValid = isValidGSTIN(gstin);

        if (!isValid) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid GSTIN!"
            })
        }

        const htmlContent = await fetchGSTINDetails(gstin);

        // Parse the HTML content with Cheerio
        const $ = cheerio.load(htmlContent);

        // Strip out comments and DOCTYPE (just in case)
        const bodyContent = $('body').html(); // Only get the content inside <body> tag

        const body$ = cheerio.load(bodyContent); // Loading the body content into a new Cheerio instance

        const isNotExists = body$('div.container h3.gstN:contains("Invalid GSTIN / UID")').text().trim();

        if (_.isEmpty(isNotExists)) {

            let gstinDetails = {
                generatedEinvoices: body$('div.row.custom_row_with_sahadow p:contains("Generated e-invoices")').text().replace("Generated e-invoices -", "").trim(),
                enabledEinvoices: body$('div.row.custom_row_with_sahadow p:contains("Enabled for e-invoices")').text().replace("Enabled for e-invoices -", "").trim(),
                gstin: body$('div.row.custom_row_with_border p:contains("GSTIN/UIN")').text().replace("GSTIN/UIN -", "").trim(),
                registrationDate: body$('div.row.custom_row_with_border p:contains("Date of Registration")').text().replace("Date of Registration -", "").trim(),
                taxpayerType: body$('div.row.custom_row_with_border p:contains("Taxpayer Type")').text().replace("Taxpayer Type -", "").trim(),
                gstinStatus: body$('div.row.custom_row_with_border p:contains("GSTIN / UIN Status")').text().replace("GSTIN / UIN Status -", "").trim(),
                cancellationDate: body$('div.row.custom_row_with_border p:contains("Date of Cancellation")').text().replace("Date of Cancellation -", "").trim(),
                businessConstitution: body$('div.row.custom_row_with_border p:contains("Constitution of Business")').text().replace("Constitution of Business -", "").trim(),
                legalName: body$('div.row.custom_row_with_border p:contains("Legal Name of Business")').text().replace("Legal Name of Business -", "").trim(),
                centerJurisdiction: body$('div.row.custom_row_with_border p:contains("Centre Jurisdiction")').text().replace("Centre Jurisdiction -", "").trim(),
                stateJurisdiction: body$('div.row.custom_row_with_border p:contains("State Jurisdiction")').text().replace("State Jurisdiction -", "").trim(),
                tradeName: body$('div.row.custom_row_with_border p:contains("Trade Name")').text().replace("Trade Name -", "").trim(),
                businessNature: body$('div.row.custom_row_with_border p:contains("Nature of Business Activities")').text().replace("Nature of Business Activities -", "").trim(),
                principalPlaceOfBusiness: body$('div.row.custom_row_with_border p:contains("Principal Place of Business")').text().replace("Principal Place of Business -", "").trim(),
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "GSTIN Verified!",
                gstinDetails
            })

        }
        else {

            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Invalid GSTIN"
            });

        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "ERROR WHILE FETCHING GSTIN INFROMATION",
            status: false,
            error: error.message
        });
    }
}