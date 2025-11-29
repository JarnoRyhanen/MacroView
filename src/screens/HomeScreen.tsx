import { FlatList, StyleSheet, Text, View, Image, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from 'react';
import { IngredientCard } from '../components/ingredientCard';

export default function HomeScreen({ navigation }) {

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = SQLite.openDatabaseSync('ingredientdb');

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * FROM ingredient;');
      setData(list);
    } catch (error) {
      console.error('Could not get items', error);
      setData([]);
    }
  }

  const deleteItem = (id: number) => {

    Alert.alert(
      'Delete item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await db.runAsync('DELETE FROM ingredient WHERE id = ?', id);
              updateList();
            } catch (err) {
              console.error('Delete failed', err);
            }
          }
        }
      ]
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await updateList();
    setRefreshing(false);
  }

  const renderItem = ({ item }) => (
    <IngredientCard
      item={item}
      onDelete={deleteItem}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        data={data}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No saved ingredients yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
});

