import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, ScrollView } from 'react-native'
import { Container } from 'native-base';
import faker from 'faker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ItemDetail from './src/components/ItemDetail'
import { confirmAction } from './src/services/confirmActionSvc';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();


const items = new Array(20).fill(' ').map(() => ({
  id: Math.random(),
  title: faker.name.findName(),
  subtitle: faker.hacker.phrase(),
  image: faker.image.avatar()
}));

const AnatomyExample = ({ navigation }) => {
  return (
    <Container>
      <ScrollView style={styles.listContainer}>
        {items.map(itm => <Card key={itm.id} {...itm} navigation={navigation} />)}
      </ScrollView>
    </Container>
  );
};

const Card = ({title, subtitle, image, navigation }) => {
  const onCardPressHandler = (event) => {
    navigation.navigate('ItemDetail', {
      title, subtitle, image, navigation
    });
  }
  const onCardLongPressHandler = () => {
    confirmAction()
  }

  return (
    <TouchableHighlight onPress={onCardPressHandler} onLongPress={onCardLongPressHandler} underlayColor="green" style={styles.cardContainer}>
      <View>
        <View style={styles.cardContent}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: image
            }}
          />
          <View style={styles.textContainer}>
            <Text>
              {title}
            </Text>
            <Text>
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 8
  },
  tinyLogo: {
    width: 50,
    height: 50,
    margin: 4
  },
  textContainer: {
    margin: 4
  },
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    margin: 8
  },
  cardContent: {
    flexDirection: 'row',
    margin: 8
  }
});


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={AnatomyExample} />
        <Stack.Screen name="ItemDetail" component={ItemDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
