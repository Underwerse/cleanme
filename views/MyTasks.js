import React from 'react';
import List from '../components/List';
import {PropTypes} from 'prop-types';
import Header from '../components/Header';

const MyTasks = ({navigation}) => {
  return (
    <>
      <Header navigation={navigation} />
      <List navigation={navigation} myFilesOnly={true} />
    </>
  );
};

MyTasks.propTypes = {
  navigation: PropTypes.object,
};

export default MyTasks;
