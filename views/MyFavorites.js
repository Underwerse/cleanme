import React from 'react';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import {StyleSheet, View} from 'react-native';
import {Card} from '@rneui/themed';
import {colorSchema} from '../utils/variables';

const MyFavorites = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <Card.Title
          style={{
            fontWeight: '900',
            fontSize: 30,
            color: colorSchema.primaryTextColor,
            paddingTop: 20,
          }}
        >
          My Favorites
        </Card.Title>
      </View>
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

MyFavorites.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavorites;
