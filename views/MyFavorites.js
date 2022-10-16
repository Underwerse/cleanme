import React from 'react';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import {Card} from '@rneui/themed';
import Header from '../components/Header';
import Styles from '../utils/Styles';

const MyFavorites = ({navigation}) => {
  return (
    <>
      <Header></Header>
      <Card.Title style={Styles.titleMain}>My Favorites</Card.Title>
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={true}
      />
    </>
  );
};

MyFavorites.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavorites;
