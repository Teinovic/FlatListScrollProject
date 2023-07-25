import React, {useState, useEffect, JSXElementConstructor} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Linking,
} from 'react-native';

interface Character {
  created: string;
  name: string;
  image: string;
  url: string;
  id: number;
}

function App(): JSX.Element {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charIdsToFetch, setCharIdsToFetch] = useState<{
    startId: number;
    endId: number;
  }>({startId: 1, endId: 20});
  const [loading, setLoading] = useState<boolean>(false);

  const incrementStartAndEndId: number = 20;

  async function fetchRickAndMortyChars(characterIdsToFetch: {
    startId: number;
    endId: number;
  }) {
    try {
      // I want to get an array like [1, 2, 3..., 9, 10] here by a loop,
      // as Rick n Morty endpoint fetches 1st 10 ids by doing https://rickandmortyapi.com/api/character/[1, 2, 3..., 9, 10]
      let characterIds: Array<number> = [];
      for (
        let i: number = characterIdsToFetch.startId;
        i <= characterIdsToFetch.endId;
        i++
      ) {
        characterIds.push(i);
      }
      setLoading(true);
      const resp = await fetch(
        `https://rickandmortyapi.com/api/character/${characterIds}`,
      );
      const json: [] = await resp.json();

      setCharacters(prevState => {
        return [...prevState, ...json];
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRickAndMortyChars(charIdsToFetch);
  }, []);

  function loadingSpinner() {
    return loading ? (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  }

  return (
    <SafeAreaView>
      <FlatList
        style={styles.list}
        data={characters}
        onEndReached={() => {
          setCharIdsToFetch(prev => {
            return {
              startId: prev.startId + incrementStartAndEndId,
              endId: prev.endId + incrementStartAndEndId,
            };
          });
          return fetchRickAndMortyChars({
            startId: charIdsToFetch.startId + incrementStartAndEndId,
            endId: charIdsToFetch.endId + incrementStartAndEndId,
          });
        }}
        ListFooterComponent={loadingSpinner}
        keyExtractor={item => item.name.toString() + item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.itemContainer} key={item.name.toString()}>
            <View>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.createdDate}>
                {new Date(item.created).toDateString()}
              </Text>
              <Text
                style={styles.url}
                onPress={() => Linking.openURL(`${item.url}`)}>
                {item.url}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  infoContainer: {
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    paddingBottom: 10,
  },
  createdDate: {
    fontSize: 10,
  },
  url: {
    fontSize: 12,
  },
  spinner: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default App;
