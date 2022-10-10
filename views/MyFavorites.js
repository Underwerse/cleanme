import React from 'react';
import List from '../components/List';
import {PropTypes} from 'prop-types';
import Header from '../components/Header';

const MyFavourites = ({navigation}) => {
  return (
    <>
      <Header navigation={navigation} />
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={true}
      />
    </>
  );
};

MyFavourites.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavourites;
