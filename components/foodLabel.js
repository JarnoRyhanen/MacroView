import { View, Text, Image, StyleSheet } from 'react-native';

export function FoodLabel({ itemData }) {
    if (!itemData) {
        return <Text>No item data to display on label.</Text>;
    }

    const {
        name,
        originalName,
        amount,
        unitShort,
        aisle,
        image,
        nutrition,
        categoryPath
    } = itemData;

    const nutrients = nutrition?.nutrients || [];
    const caloricBreakdown = nutrition?.caloricBreakdown;
    const weightPerServing = nutrition?.weightPerServing;

    const NutrientRow = ({ label, value, unit, dailyPercent = null, bold = false }) => (
        <View style={styles.nutrientRow}>
            <Text style={[styles.nutrientLabel, bold && styles.boldText]}>{label}</Text>
            <View style={styles.nutrientValues}>
                <Text style={[styles.nutrientValue, bold && styles.boldText]}>
                    {value} {unit}
                </Text>
                {dailyPercent !== null && dailyPercent !== undefined && (
                    <Text style={[styles.nutrientDailyPercent, bold && styles.boldText]}>
                        {dailyPercent.toFixed(0)}%
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.foodLabelContainer}>
            <Text style={styles.labelHeader}>Nutrition Facts</Text>
            <View style={styles.separator} />

            {image && (
                <Image
                    source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${image}` }}
                    style={styles.itemImage}
                    resizeMode="contain"
                    onError={(e) => console.warn('Image load error:', e.nativeEvent?.error)}
                />
            )}

            <Text style={styles.itemName}>{name || originalName}</Text>
            {categoryPath && categoryPath.length > 0 && (
                <Text style={styles.categoryText}>Category: {categoryPath.join(', ')}</Text>
            )}

            <View style={styles.servingInfo}>
                <Text style={styles.servingSize}>Serving Size: {weightPerServing?.amount} {weightPerServing?.unit || unitShort}</Text>
            </View>
            <View style={styles.doubleSeparator} />

            <View style={styles.amountPerServing}>
                <Text style={styles.sectionHeader}>Amount Per Serving</Text>
                <NutrientRow
                    label="Calories"
                    value={nutrients.find(n => n.name === 'Calories')?.amount || 'N/A'}
                    unit="kcal"
                    bold={true}
                />
            </View>
            <View style={styles.separator} />

            <Text style={styles.dailyValueText}>% Daily Value*</Text>

            {nutrients.map((nutrient, index) => {
                if (nutrient.name === 'Calories') return null;

                return (
                    <NutrientRow
                        key={index}
                        label={nutrient.name}
                        value={nutrient.amount.toFixed(1)}
                        unit={nutrient.unit}
                        dailyPercent={nutrient.percentOfDailyNeeds}
                        bold={nutrient.name.includes('Fat') || nutrient.name.includes('Sodium') || nutrient.name.includes('Carbohydrate')}
                    />
                );
            })}
            <View style={styles.separator} />

            {caloricBreakdown && (
                <View style={styles.caloricBreakdown}>
                    <Text style={styles.sectionHeader}>Caloric Breakdown:</Text>
                    <Text>
                        Protein: {caloricBreakdown.percentProtein.toFixed(1)}% |
                        Fat: {caloricBreakdown.percentFat.toFixed(1)}% |
                        Carbs: {caloricBreakdown.percentCarbs.toFixed(1)}%
                    </Text>
                </View>
            )}
            <View style={styles.separator} />

            <Text style={styles.footerText}>
                * Percent Daily Values are based on a 2,000 calorie diet.
            </Text>
            <Text style={styles.footerText}>
                Aisle: {aisle || 'N/A'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    foodLabelContainer: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 8,
        padding: 15,
        margin: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    labelHeader: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 5,
        color: '#000',
        borderBottomWidth: 10,
        borderBottomColor: '#000',
        paddingBottom: 5,
    },
    itemName: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
        color: '#333',
    },
    categoryText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: '#666',
        fontStyle: 'italic',
    },
    itemImage: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    servingInfo: {
        alignItems: 'center',
        marginVertical: 10,
    },
    servingSize: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    doubleSeparator: {
        borderBottomColor: '#000',
        borderBottomWidth: 8,
        marginVertical: 5,
    },
    separator: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 5,
    },
    amountPerServing: {
        marginVertical: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    nutrientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    nutrientLabel: {
        fontSize: 16,
        color: '#333',
        flex: 2,
    },
    nutrientValues: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
    },
    nutrientValue: {
        fontSize: 16,
        color: '#333',
        minWidth: 50,
        textAlign: 'right',
    },
    nutrientDailyPercent: {
        fontSize: 16,
        color: '#333',
        minWidth: 40,
        textAlign: 'right',
        marginLeft: 10,
    },
    dailyValueText: {
        fontSize: 14,
        textAlign: 'right',
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
    },
    caloricBreakdown: {
        marginTop: 10,
        paddingBottom: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        lineHeight: 18,
    },
});