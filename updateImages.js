const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Read the existing JSON data
const jsonData = fs.readFileSync('flowerData.json');
const data = JSON.parse(jsonData);
console.table(data);

// Function to extract image URLs from the internet
async function extractImageURLs() {
    for (let i = 0; i < data.length; i++) {
        const product = data[i];

        // Make a request to the website
        const response = await axios.get(product.images[0]);

        // Parse the HTML content
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract the image URL
        const imageURL = $('images').attr('src');

        // Update the image URL in the data
        product.images[0] = imageURL;
    }

    // Write the updated data to the JSON file
    const updatedJsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('flowerData.json', updatedJsonData);
    console.log('Image URLs updated successfully!');
}

// Call the function to extract and update image URLs
extractImageURLs().catch((error) => {
    console.log('An error occurred:', error.message);
});
