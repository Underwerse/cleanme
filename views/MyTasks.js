import React from 'react';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import {Card} from '@rneui/themed';
import {colorSchema} from '../utils/variables';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';

const MyTasks = ({navigation}) => {
  return (
    <>
      <Header></Header>
      <View style={styles.container}>
        <Card.Title
          style={{
            fontWeight: '900',
            fontSize: 30,
            color: colorSchema.primaryTextColor,
            paddingTop: 20,
          }}
        >
          My Tasks
        </Card.Title>
      </View>
      <List
        navigation={navigation}
        myFilesOnly={true}
        myFavoritesOnly={false}
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

MyTasks.propTypes = {
  navigation: PropTypes.object,
};

export default MyTasks;
