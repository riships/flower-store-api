const fs = require('fs');
const axios = require('axios');

// Flower names array
const flowerNames = [
    "Rose(Rosa)",
    "Sunflower(Helianthus annuus)",
    "Tulip(Tulipa)",
    "Orchid(Orchidaceae)",
    "Lily(Lilium)",
    "Daffodil(Narcissus)",
    "Iris(Iris)",
    "Carnation(Dianthus caryophyllus)",
    "Pansy(Viola tricolor)",
    "Geranium(Pelargonium)",
    "Daisy(Bellis perennis)",
    "Lavender(Lavandula)",
    "Marigold(Tagetes)",
    "Poppy(Papaver)",
    "Jasmine(Jasminum)",
    "Hibiscus(Hibiscus)",
    "Hydrangea(Hydrangea)",
    "Peony(Paeonia)",
    "Snapdragon(Antirrhinum)",
    "Petunia(Petunia)",
    "Zinnia(Zinnia)",
    "Chrysanthemum(Chrysanthemum)",
    "Azalea(Rhododendron)",
    "Freesia(Freesia)",
    "Cosmos(Cosmos bipinnatus)",
    "Crocus(Crocus)",
    "Gerbera Daisy(Gerbera)",
    "Foxglove(Digitalis purpurea)",
    "Morning Glory(Ipomoea)",
    "Hollyhock(Alcea rosea)",
    "Anemone(Anemone)",
    "Gladiolus(Gladiolus)",
    "Peacock Flower(Caesalpinia pulcherrima)",
    "Bird of Paradise(Strelitzia reginae)",
    "Bleeding Heart(Dicentra)",
    "Columbine(Aquilegia)",
    "Black - eyed Susan(Rudbeckia hirta)",
    "Canterbury Bells(Campanula medium)",
    "Delphinium(Delphinium)",
    "Sweet Pea(Lathyrus odoratus)",
    "Wisteria(Wisteria)",
    "Magnolia(Magnolia)",
    "Buttercup(Ranunculus)",
    "Snapdragon(Antirrhinum)",
    "Iceland Poppy(Papaver nudicaule)",
    "Monkshood(Aconitum)",
    "Gladiolus(Gladiolus)",
    "Snowdrop(Galanthus)",
    "Cornflower(Centaurea cyanus)",
    "Violet(Viola odorata)",
    // Add more flower names here
];
// Set the query parameters to fetch flower data
const filterNotFound = true; // Exclude plants not found in the database
const filterImages = true; // Only fetch plants with images

async function fetchFlowerData(flowerName) {
    const url = `https://trefle.io/api/v1/plants?token=qzaqUfzjAwbHBOq6dICDtiPq1xvMVcu7frVVaon95Wk&q=${encodeURIComponent(flowerName)}&filter_not_found=false&filter_images=false`;
    try {
        const response = await axios.get(url);
        const flowerData = response.data.data[0];
        return flowerData;
    } catch (error) {
        console.error(`Error retrieving data for flower ${flowerName}:`, error);
        return null;
    }
}

async function fetchAllFlowerData() {
    const allFlowerData = [];
    for (const flowerName of flowerNames) {
        const flowerData = await fetchFlowerData(flowerName);
        if (flowerData) {
            const formattedData = {
                id: flowerData.id,
                name: flowerData.common_name,
                description: flowerData.family_common_name,
                price: 0,
                images: flowerData.images ? flowerData.images.map(image => ({ url: image.url })) : [],
                category: flowerData.family,
                sub_category: flowerData.genus,
                type: "",
                color: flowerData.main_species?.flower?.color || "",
                quantity: 0,
                availability: "",
                featured: false,
                ratings: 0
            };
            allFlowerData.push(formattedData);
        }
    }
    return allFlowerData;
}

fetchAllFlowerData().then((flowerDataList) => {
    const jsonData = JSON.stringify(flowerDataList, null, 2);
    fs.writeFileSync('flower_data.json', jsonData);
    console.log('Data saved to flower_data.json successfully.');
}).catch((error) => {
    console.error('Error fetching flower data:', error);
});