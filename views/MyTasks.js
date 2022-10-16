import React from 'react';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import {Card} from '@rneui/themed';
import {View} from 'react-native';
import Header from '../components/Header';
import Styles from '../utils/Styles';

const MyTasks = ({navigation}) => {
  return (
    <>
      <Header></Header>
      <Card.Title style={Styles.titleMain}>My Tasks</Card.Title>
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
