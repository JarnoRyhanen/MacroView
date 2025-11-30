import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { fetchItemData } from '../utils/utils';
import { FoodLabel } from '../components/foodLabel';
import { fetchIdWithNameFromDb, fetchItemFromDatabase, saveToDatabase } from '../utils/schema';

const db = SQLite.openDatabaseSync('ingredientdb');

export default function DataScreen({ route, navigation }) {
    const params = route?.params || {};
    const item = params.result;
    const idFromParams = params.itemId || null;
    const fetchFromApi = params.fetchFromApi;

    const parsedItem = item.split('(')[0].split(",")[0].trim();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idFromDb, setIdFromDb] = useState(null);
    const [showLongImageUrl, setShowLongImageUrl] = useState(false);

    const saveItem = useCallback(() => {
        if (!data) {
            Alert.alert('Error', 'No data to save.');
            return;
        }

        saveToDatabase(data, db)
            .then(() => {
                Alert.alert('Success', `${data.name} saved successfully!`);
            })
            .catch(err => {
                console.error('Save error:', err);
                Alert.alert('Error', 'Failed to save item to local database.');
            })
            .finally(() => {
                navigation.navigate('Main', { screen: 'Home' });
            });
    }, [data, navigation]);

    const fetchData = useCallback(async () => {
        if (!item) {
            setData(null);
            setError('No item information provided.');
            return;
        }

        setLoading(true);
        setError(null);

        const fetchFromDb = async (id) => {
            try {
                const itemData = await fetchItemFromDatabase(id, db);
                if (itemData) {
                    setData(itemData);
                    setShowLongImageUrl(true);
                } else {
                    throw new Error("Item not found in local database.");
                }
            } catch (err) {
                console.error('Local DB fetch error:', err);
                setError('Failed to load item from saved list.');
                setData(null);
                throw err;
            }
        };

        const fetchFromApi = async (id) => {
            try {
                const itemData = await fetchItemData(id);
                setData(itemData);
            } catch (err) {
                console.error('API fetch error:', err);
                setError('Failed to fetch item data from the external API.');
                setData(null);
                throw err;
            }
        }

        try {
            if (!fetchFromApi) {
                await fetchFromDb(idFromParams);
                return;
            }

            if (fetchFromApi) {
                const idFromDb = await fetchIdWithNameFromDb(parsedItem, db);
                setIdFromDb(idFromDb);

                // If item with idFromDb already exists in the database, load from there
                if (idFromDb) {
                    await fetchFromDb(idFromDb);
                    return;
                }

                // If item has id provided from params, but does not exist in database, fetch from api, uses 1 api call
                if (idFromParams) {
                    await fetchFromApi(idFromParams);
                    return;
                }
                setError('Could not find item data. Missing ID for API fetch.');
            }

        } catch (err) {
            console.log('Final data fetch failed.');
        } finally {
            setLoading(false);
        }
    }, [item, parsedItem, idFromParams, fetchFromApi]);

    useEffect(() => {
        let isCancelled = false;
        const runFetch = async () => {
            try {
                await fetchData();
            } catch (error) {
                if (isCancelled) return;
            }
        };

        runFetch();
        return () => {
            isCancelled = true;
        };

    }, [fetchData]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 10 }}>Loading details for "{parsedItem}"...</Text>
                </View>
            ) : error ? (
                <Text style={styles.errorText}>❌ {error}</Text>
            ) : data ? (
                <>
                    <FoodLabel itemData={data} showLongImageUrl={showLongImageUrl} />
                    {(fetchFromApi && !idFromDb) &&
                        <Button
                            title='Save Item'
                            onPress={saveItem}
                            color="#4CAF50"
                        />
                    }
                </>
            ) : (
                <Text>No item data is available.</Text>
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