import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/searchBar';
import { IngredientCard } from '../components/ingredientCard';
import { useState, useEffect } from 'react';
import { fetchItemId } from '../utils/utils';


export default function SearchScreen({ route, navigation }) {
  const params = route?.params || {};
  const searchQueryFromCamera = params?.result ?? null;

  const [data, setData] = useState([]);

  const searchItem = async (query) => {
    const items = await fetchItemId(query, 50);
    setData(items);
  }

  useEffect(() => {
    if (searchQueryFromCamera) {
      const parsedItem = searchQueryFromCamera.split('(')[0].split(",")[0].trim();
      if (parsedItem) searchItem(parsedItem);
    }
  }, [searchQueryFromCamera]);

  const renderItem = ({ item }) => (
    <IngredientCard
      item={item}
      navigation={navigation}
      fetchFromApi={true}
    />
  );

  return (
    <>
      <SearchBar searchItem={searchItem} />
      <View style={styles.container}>
        <FlatList
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          data={data}
          ListEmptyComponent={<Text style={styles.empty}>No ingredients searched yet.</Text>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
});

