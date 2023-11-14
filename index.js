const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("flowerData.json");
// const router = jsonServer.router("userData.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001
const fs = require('fs');
const axios = require('axios');

const server2 = jsonServer.create();
const router2 = jsonServer.router("userData.json"); // Change to the correct file path
const middlewares2 = jsonServer.defaults();
const port2 = process.env.PORT2 || 3001;

server.use(middlewares);
server.use(router);

server.listen(port);
async function getUserData() {
    try {
        // Read the JSON file
        const jsonData = fs.readFileSync('usersData.json');
        const data = JSON.parse(jsonData);
        console.log("data", data);

        // Retrieve user data
        for (const user of data.users) {
            try {
                console.log('User Data:', user);
            } catch (error) {
                console.error(`Error retrieving data for user ${user.name}:`, error);
            }
        }

        console.log('User data retrieval complete.');
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}

getUserData()



server2.use(middlewares2);
server2.use(router2);

server2.listen(port2);
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
        const uniqueNamesMap = new Map();

        // Iterate over the flowers in the JSON data and add unique entries to the map
        data.flowers.forEach((flower) => {
            const name = flower.name;
            if (!uniqueNamesMap.has(name)) {
                uniqueNamesMap.set(name, flower);
            }
        });
        data.flowers.forEach((flower, index) => {
            flower.id = index + 1;
        });

        // Create an array from the map values to get unique entries
        data.flowers = Array.from(uniqueNamesMap.values());

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
