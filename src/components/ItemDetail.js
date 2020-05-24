import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native';


const ItemDetail = () => {
  const route = useRoute();
  const { title, image } = route.params;
  return (
    <View>
      <View>
        <Text>{title}</Text>
      </View>
      <View>
        <Image
          style={styles.logo}
          source={{
            uri: image
          }}
        />
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  }
});

export default ItemDetail;
