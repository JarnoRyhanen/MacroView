import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { fetchItemId, fetchItemData } from '../utils';

export default function DataScreen({ route }) {
    const params = route?.params || {};
    const item = params.result ?? null;
    const [data, setData] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (!item) return;

        (async () => {
            try {
                const id = await fetchItemId(item);
                if (!mounted) return;

                const itemData = await fetchItemData(id);
                if (!mounted) return;
                setData(itemData);
            } catch (error) {
                console.error('Failed to load item data:', error);
            }
        })();

        return () => { mounted = false; };
    }, [item]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {data ? (
                <View>
                    <Text style={styles.title}>{data.name ?? 'Item details'}</Text>
                    <Text style={styles.json}>{JSON.stringify(data, null, 2)}</Text>
                </View>
            ) : item ? (
                <Text>Loading details for "{String(item)}"...</Text>
            ) : (
                <Text>No item provided.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    json: { fontFamily: 'monospace' },
});