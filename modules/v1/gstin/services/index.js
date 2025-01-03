const axios = require('axios'); // Import Axios

const fetchGSTINDetails = async (gstin) => {

    const url = `https://irisgst.com/gstin-filing-detail/?gstinno=${gstin}`;

    const response = await axios.get(url);

    return response.data

}

module.exports = { fetchGSTINDetails }