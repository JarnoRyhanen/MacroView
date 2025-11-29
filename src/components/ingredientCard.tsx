import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export function IngredientCard({ item, onDelete, navigation }) {

    const handleDeletePress = () => {
        onDelete(item.id);
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => {
            navigation.navigate('DataScreen', { result: item.name, itemId: item.id })
        }
        }>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.amount} {item.unitShort}</Text>
                <Text style={styles.subtitle}>{item.aisle}</Text>
                <Text style={styles.subtitle}>Category: {JSON.parse(item.categoryPath)[0]}</Text>
            </View>
            <Text
                style={styles.delete}
                onPress={handleDeletePress}>
                Delete
            </Text>
        </TouchableOpacity>
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
    }, info: {
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