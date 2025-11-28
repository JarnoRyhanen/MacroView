import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchItemId, fetchItemData } from '../utils';
import { FoodLabel } from './foodLabel';
import * as SQLite from 'expo-sqlite';
import { fetchItemFromDatabase, saveToDatabase } from '../schema';

export default function DataScreen({ route, navigation }) {
    const params = route?.params || {};
    const item = params.result;
    const itemId = params.itemId || null;

    const parsedItem = item.split('(')[0].split(",")[0].trim();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const db = SQLite.openDatabaseSync('ingredientdb');

    const saveItem = () => {
        saveToDatabase(data, db)
            .catch(err => console.error('Save error:', err))
            .finally(db.closeSync());
        navigation.navigate('Main', { screen: 'Home' });
    }

    const fetchItem = async () => {
        if (!db) {
            console.error('DB not available');
            setError('Local database unavailable.');
            setLoading(false);
            return;
        }
        try {
            const data = await fetchItemFromDatabase(itemId, db);
            setData(data);
        } catch (err) {
            console.error('Local DB fetch error:', err);
            setError('Failed to load item from saved list.');
        } finally {
            setLoading(false);
            db.closeSync();
        }
    };

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
                if (itemId) {
                    fetchItem();
                    return;
                }
                const id = await fetchItemId(parsedItem);
                if (!isMounted) return;
                const itemData = await fetchItemData(id);
                if (!isMounted) return;
                setData(itemData);

            } catch (err) {
                console.error('Failed to load item data:', err);
                setError('Failed to load data. Please check your utilities.');
                setData(null);
            } finally {
                if (isMounted && !itemId) {
                    setLoading(false);
                }
            }
        };

        loadItemData();

        return () => { isMounted = false; };
    }, [parsedItem, itemId]);

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
                    <FoodLabel itemData={data} id={itemId}/>
                    {!itemId && <Button
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