
export const createDatabase = async (db) => {
    try {
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS ingredient (
                                id INTEGER PRIMARY KEY NOT NULL,
                                name TEXT,
                                amount REAL,
                                unitShort TEXT,
                                aisle TEXT,
                                image TEXT,
                                categoryPath TEXT
                            );`
        );

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS caloric_breakdown (
                                id INTEGER PRIMARY KEY NOT NULL,
                                ingredient_id INTEGER,
                                percentProtein REAL,
                                percentFat REAL,
                                percentCarbs REAL,
                                FOREIGN KEY(ingredient_id) REFERENCES ingredient(id)
                            );`
        );

        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS nutrient (
                                id INTEGER PRIMARY KEY NOT NULL,
                                ingredient_id INTEGER,
                                name TEXT,
                                amount REAL,
                                unit TEXT,
                                percentOfDailyNeeds REAL,
                                FOREIGN KEY(ingredient_id) REFERENCES ingredient(id)
                            );`
        );
    } catch (error) {
        console.error("Could not open database " + error);
    }
};

export const saveToDatabase = async (data, db) => {

    if (!data) throw new Error('No data provided to save');

    const name = data.name;
    const amount = data.amount;
    const unitShort = data.unitShort;
    const aisle = data.aisle;
    const image = data.image;
    const categoryPath = JSON.stringify(data.categoryPath ?? []);

    try {
        const insertResult = await db.runAsync(
            'INSERT INTO ingredient (name, amount, unitShort, aisle, image, categoryPath) VALUES (?, ?, ?, ?, ?, ?)',
            name, amount, unitShort, aisle, image, categoryPath
        );
        const ingredientId = insertResult.lastInsertRowId;
        if (!ingredientId) throw new Error('Could not determine inserted ingredient id');

        const cb = data.nutrition.caloricBreakdown;
        if (cb) {
            await db.runAsync(
                'INSERT INTO caloric_breakdown (ingredient_id, percentProtein, percentFat, percentCarbs) VALUES (?, ?, ?, ?)',
                ingredientId, cb.percentProtein, cb.percentFat, cb.percentCarbs
            );
        }

        const nutrients = data.nutrition.nutrients;
        for (const nutrient of nutrients) {
            await db.runAsync(
                'INSERT INTO nutrient (ingredient_id, name, amount, unit, percentOfDailyNeeds) VALUES (?, ?, ?, ?, ?)',
                ingredientId, nutrient.name, nutrient.amount, nutrient.unit, nutrient.percentOfDailyNeeds
            );
        }
        console.log("Data successfully stored in the database");
        
        return;
    } catch (error) {
        console.error("Could not add item, " + error);
    }

}