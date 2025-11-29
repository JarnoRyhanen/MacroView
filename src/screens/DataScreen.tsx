import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchItemId, fetchItemData } from '../utils/utils';
import { FoodLabel } from '../components/foodLabel';
import * as SQLite from 'expo-sqlite';
import { fetchIdWithName, fetchItemFromDatabase, saveToDatabase } from '../utils/schema';

export default function DataScreen({ route, navigation }) {
    const params = route?.params || {};
    const item = params.result;
    const idFromParams = params.itemId || null;

    const parsedItem = item.split('(')[0].split(",")[0].trim();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showLongImageUrl, setShowLongImageUrl] = useState(false);

    const db = SQLite.openDatabaseSync('ingredientdb');

    const saveItem = () => {
        saveToDatabase(data, db)
            .catch(err => console.error('Save error:', err))
            .finally(() => db.closeSync());
        navigation.navigate('Main', { screen: 'Home' });
    }

    const fetchItem = async (id) => {
        if (!db) {
            console.error('DB not available');
            setError('Local database unavailable.');
            setLoading(false);
            return;
        }

        try {
            const data = await fetchItemFromDatabase(id, db);
            setData(data);
        } catch (err) {
            console.error('Local DB fetch error:', err);
            setError('Failed to load item from saved list.');
        } finally {
            setLoading(false);
            db.closeSync();
        }
    };

    async function processItem(parsedItem, db, isMounted) {
        try {
            const id = await fetchIdWithName(parsedItem, db);

            if (!id) {
                if (!isMounted) return;
                const _id = await fetchItemId(parsedItem);
                if (!isMounted) return;
                const itemData = await fetchItemData(_id);
                setData(itemData);
            } else {
                setShowLongImageUrl(true);
                fetchItem(id);
            }

        } catch (err) {
            console.error('fetchItemId error:', err);
            return null;
        }
    }

    useEffect(() => {

        if (!item) {
            setData(null);
            return;
        }

        let isMounted = true;

        const loadItemData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (idFromParams) {
                    fetchItem(idFromParams);
                    setShowLongImageUrl(true);
                    return;
                }
                processItem(parsedItem, db, isMounted);

            } catch (err) {
                console.error('Failed to load item data:', err);
                setError('Failed to load data. Please check your utilities.');
                setData(null);
            } finally {
                if (isMounted && !idFromParams) {
                    setLoading(false);
                }
            }
        };

        loadItemData();

        return () => { isMounted = false; };
    }, [parsedItem, idFromParams]);

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
                    {!idFromParams && <Button
                        title='Save'
                        onPress={() => saveItem()}
                    />}

                </>
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