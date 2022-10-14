import React, {useContext, useEffect, useState, createRef} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {SearchBar} from '@rneui/themed';
import Header from '../components/Header';
import List from '../components/List';
import {colorSchema} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';

const Home = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);

  const [filterWord, setFilterWord] = useState('');
  const input = createRef();

  useEffect(() => {
    setTimeout(() => {
      setUpdate(!update);
    }, 1000);
  }, [filterWord]);

  useEffect(() => {
    // setUpdate(!update);
  }, []);

  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.searchInput}>
        <SearchBar
          ref={input}
          placeholder="Type to filter list"
          onChangeText={(value) => {
            setFilterWord(value);
          }}
          value={filterWord}
          inputStyle={{
            backgroundColor: colorSchema.bgrColor,
            color: colorSchema.mainColor,
          }}
          containerStyle={{
            backgroundColor: colorSchema.bgrColor,
            borderBottomColor: colorSchema.mainColor,
            borderTopWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: colorSchema.bgrColor,
            height: 25,
          }}
          searchIcon={{
            size: 30,
            color: colorSchema.mainColor,
          }}
          clearIcon={{
            size: 30,
            color: colorSchema.mainColor,
          }}
        ></SearchBar>
      </View>
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={false}
        filterWord={filterWord.toLowerCase()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  likeEmpty: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  searchInput: {
    backgroundColor: colorSchema.bgrColor,
    width: '100%',
    alignSelf: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
