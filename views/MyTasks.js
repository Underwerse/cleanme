import React from 'react';
import List from '../components/List';
import {PropTypes} from 'prop-types';
import Header from '../components/Header';

const MyFiles = ({navigation}) => {
  return (
    <>
      <Header navigation={navigation} />
      <List navigation={navigation} myFilesOnly={true} />
    </>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
