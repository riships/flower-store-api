const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("flowerData.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001
const fs = require('fs');
const axios = require('axios');

server.use(middlewares);
server.use(router);

server.listen(port);

async function updateFlowerData() {
    try {
        // Read the JSON file
        const jsonData = fs.readFileSync('flowerData.json');
        const data = JSON.parse(jsonData);

        // Iterate over the flowers in the JSON data
        for (const flower of data.flowers) {
            try {
                // Perform an image search for the flower's name
                const response = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(flower.name)}&client_id=Z8MzZyse6X95Bzx8LehPcP_dbrODh-n7vb7r7g5OV9w`);
                const responseData = response.data;

                // Extract the image URLs from the search results
                const imageUrls = responseData.results.map(result => result.urls.regular);

                // Update the flower object with the retrieved image URLs
                flower.images = imageUrls.map(url => ({ url }));

            } catch (error) {
                console.error(`Error retrieving images for flower ${flower.name}:`, error);
            }
        }

        // Write the updated JSON data back to the file
        const updatedJsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('flowerData.json', updatedJsonData);

        console.log('Image URLs updated successfully.');
    } catch (error) {
        console.error('Error updating image URLs:', error);
    }
}

// Call the async function to update the flower data
updateFlowerData();
