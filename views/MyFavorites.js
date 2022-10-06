import React from 'react';
import List from '../components/List';
import {PropTypes} from 'prop-types';

const MyFavourites = ({navigation}) => {
  return <List navigation={navigation} myFilesOnly={true} />;
};

MyFavourites.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavourites;
