import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export function IngredientCard({ item, onDelete = null, navigation, fetchFromApi = false }) {

    const {
        id,
        name,
        amount,
        unitShort,
        aisle,
        categoryPath = "",
        image = ""
    } = item || {};

    const handleDeletePress = () => {
        onDelete(id);
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => {
            navigation.navigate('DataScreen', { result: name, itemId: id, fetchFromApi: fetchFromApi })
        }
        }>
            {amount == "undefined" || unitShort == "undefined" || aisle == "undefined" || !categoryPath ? (
                <View style={styles.cardFull}>
                    <Image source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/` + image }} style={styles.image} />
                    <Text style={styles.title}>{name}</Text>
                </View>
            ) : (
                <>
                    <Image source={{ uri: image }} style={styles.image} />
                    <View style={styles.info}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>{amount} {unitShort}</Text>
                        <Text style={styles.subtitle}>{aisle}</Text>
                        <Text style={styles.subtitle}>Category: {JSON.parse(categoryPath)[0]}</Text>
                    </View>
                    <Text
                        style={styles.delete}
                        onPress={handleDeletePress}>
                        Delete
                    </Text>
                </>
            )
            }
        </TouchableOpacity >
    )
}


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#f7f7f8',
        borderRadius: 10,
        elevation: 1,
        zIndex: 10
    },
    cardFull: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f8',
        borderRadius: 8,
        marginVertical: 10,
        width: '90%'
    },
    info: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222'
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    },
    delete: {
        color: '#d32f2f',
        fontWeight: '600',
        paddingLeft: 12
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#eee'
    },
})