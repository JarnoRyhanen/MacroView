import { FlatList, StyleSheet, Text, View, Image, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from 'react';

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

  const deleteItem = (id) => {
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
    <TouchableOpacity style={styles.card} onPress={() => {
      navigation.navigate('DataScreen', { result: item.name, useApi: false })
    }
    }>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.amount} {item.unitShort}</Text>
        <Text style={styles.subtitle}>{item.aisle}</Text>
        <Text style={styles.subtitle}>Category: {JSON.parse(item.categoryPath)[0]}</Text>
      </View>
      <Text style={styles.delete} onPress={() => deleteItem(item.id)}>Delete</Text>
    </TouchableOpacity>
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
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee'
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
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
});

