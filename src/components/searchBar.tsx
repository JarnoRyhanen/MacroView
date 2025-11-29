import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export function SearchBar({ searchItem }) {
    const [query, setQuery] = useState("");

    return (
        <View style={styles.wrapper}>
            <TextInput
                style={styles.searchBarText}
                placeholder="Search..."
                onChangeText={text => setQuery(text)}
                value={query}
            />
            <TouchableOpacity onPress={() => searchItem(query)} style={styles.iconButton}>
                <Ionicons
                    name="search"
                    size={32}
                    color="black"
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 16,
        margin: 4,
        backgroundColor: '#ffffffff',

    },
    searchBarText: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        paddingVertical: 8,
        margin: 3,
        width: '85%',
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    }
});