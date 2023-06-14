const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('flowerData.json');
const data = JSON.parse(jsonData);

// Create a map to track unique names
const uniqueNamesMap = new Map();

// Iterate over the flowers in the JSON data and add unique entries to the map
data.flowers.forEach((flower) => {
    const name = flower.name;
    if (!uniqueNamesMap.has(name)) {
        uniqueNamesMap.set(name, flower);
    }
});

// Create an array from the map values to get unique entries
data.flowers = Array.from(uniqueNamesMap.values());

// Write the updated JSON data back to the file
const updatedJsonData = JSON.stringify(data, null, 2);
fs.writeFileSync('flowerData.json', updatedJsonData);

console.log('Duplicate entries removed and JSON file updated successfully.');
