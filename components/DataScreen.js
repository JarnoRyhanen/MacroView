import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchItemId as mockFetchItemId, fetchItemData as mockFetchItemData } from '../mockUtils';
import { fetchItemId, fetchItemData } from '../utils';
import { FoodLabel } from './foodLabel';
import * as SQLite from 'expo-sqlite';
import { saveToDatabase } from '../schema';

export default function DataScreen({ route }) {
    const params = route?.params || {};
    const useApi = params.useApi;
    const item = params.result;
    const parsedItem = item.split('(')[0].split(",")[0].trim();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const db = SQLite.openDatabaseSync('ingredientdb');
    const saveItem = () => {
        saveToDatabase(data, db)
            .catch(err => console.error('Save error:', err));
    }

    useEffect(() => {
        if (!item) {
            setData(null);
            return;
        }

        let isMounted = true;

        const loadItemData = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log("useApi: " + useApi);
                console.log("Item: " + item);
                
                if (!useApi) {
                    const id = await mockFetchItemId(parsedItem);
                    if (!isMounted) return;
                    const itemData = await mockFetchItemData(id);
                    if (!isMounted) return;
                    setData(itemData);
                } else {
                    const id = await fetchItemId(parsedItem);
                    if (!isMounted) return;
                    const itemData = await fetchItemData(id);
                    if (!isMounted) return;
                    setData(itemData);
                }
            } catch (err) {
                console.error('Failed to load item data:', err);
                setError('Failed to load data. Please check your mock utilities.');
                setData(null);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadItemData();

        return () => { isMounted = false; };
    }, [parsedItem]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 10 }}>Loading details for "{String(parsedItem)}"...</Text>
                </View>
            ) : error ? (
                <Text style={styles.errorText}>❌ {error}</Text>
            ) : data ? (
                <>
                    <FoodLabel itemData={data} />
                    <Button
                        title='Save'
                        onPress={() => saveItem()}
                    />
                </>
            ) : parsedItem ? (
                <Text>No data loaded for "{String(parsedItem)}".</Text>
            ) : (
                <Text>No item provided.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 20,
    },
});