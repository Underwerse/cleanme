import React from 'react';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import Header from '../components/Header';

const MyTasks = ({navigation}) => {
  return (
    <>
      <Header navigation={navigation} />
      <List
        navigation={navigation}
        myFilesOnly={true}
        myFavoritesOnly={false}
      />
    </>
  );
};

MyTasks.propTypes = {
  navigation: PropTypes.object,
};

export default MyTasks;
