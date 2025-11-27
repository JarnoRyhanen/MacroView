// --- utils.js ---

const mockItemData = {
    "id": 9150,
    "original": "lemons",
    "originalName": "lemons",
    "name": "lemon",
    "amount": 100.0,
    "unit": "grams",
    "unitShort": "g",
    "unitLong": "grams",
    "possibleUnits": [ /* ... */ ],
    "estimatedCost": { /* ... */ },
    "consistency": "solid",
    "shoppingListUnits": [ /* ... */ ],
    "aisle": "Produce",
    "image": "https://spoonacular.com/cdn/ingredients_100x100/lemon.jpg", // <--- CHANGED THIS LINE
    "meta": [],
    "nutrition": {
        "caloricBreakdown": {
            "percentProtein": 9.91,
            "percentFat": 6.08,
            "percentCarbs": 84.01
        },
        "weightPerServing": {
            "amount": 100,
            "unit": "g"
        },
        // Let's add some mock nutrients for a more complete label look
        "nutrients": [
            { "name": "Calories", "amount": 29, "unit": "kcal", "percentOfDailyNeeds": 1.45 },
            { "name": "Vitamin C", "amount": 53, "unit": "mg", "percentOfDailyNeeds": 88.33 },
            { "name": "Potassium", "amount": 138, "unit": "mg", "percentOfDailyNeeds": 3.94 },
            { "name": "Fiber", "amount": 2.8, "unit": "g", "percentOfDailyNeeds": 11.2 },
            { "name": "Sugar", "amount": 2.5, "unit": "g", "percentOfDailyNeeds": 2.78 }
        ]
    },
    "categoryPath": ["citrus fruit", "fruit"]
};

/**
 * For this mock, it just returns a fixed ID or handles different inputs.
 * @param {string} itemQuery - The item identifier passed from the previous screen.
 * @returns {Promise<number>} - A promise that resolves with the mock item ID.
 */
export async function fetchItemId(itemQuery) {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // In a real app, you'd use itemQuery to search the API.
    // Here, we just return the ID corresponding to the mock data.
    if (String(itemQuery).toLowerCase().includes('lemon') || itemQuery === 9150) {
        return mockItemData.id;
    }
    // Simulate an error for an unknown item
    if (itemQuery === 'fail') {
        throw new Error('Item ID lookup failed.');
    }
    return 9150; // Default to the lemon ID
}

/**
 * Mocks the API call to fetch detailed data using the ID.
 * @param {number} id - The ID retrieved from fetchItemId.
 * @returns {Promise<object>} - A promise that resolves with the detailed item data.
 */
export async function fetchItemData(id) {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For the mock, if the ID matches 9150, return the mock data.
    if (id === 9150) {
        return mockItemData;
    } 
    
    // Simulate a scenario where the final data fetch fails
    if (id === 'fail') {
        throw new Error(`Data fetch failed for ID: ${id}`);
    }

    // Default return or handle other IDs if needed
    return { name: `Unknown Item ID: ${id}`, details: 'No details available.' };
}