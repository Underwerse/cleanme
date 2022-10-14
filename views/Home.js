import React, {useContext, useEffect, useState, createRef} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Input} from '@rneui/themed';
import Header from '../components/Header';
import List from '../components/List';
import AddButton from '../assets/add-btn.svg';
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

  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.searchInput}>
        <Input
          leftIcon={{
            type: 'font-awesome',
            name: 'search',
            color: colorSchema.mainColor,
          }}
          placeholder="Type to filter list"
          inputStyle={{
            backgroundColor: colorSchema.bgrColor,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          containerStyle={{backgroundColor: colorSchema.bgrColor}}
          ref={input}
          onChangeText={(value) => {
            setFilterWord(value.toLowerCase());
          }}
        />
      </View>
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={false}
        filterWord={filterWord}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: -40,
    left: '42%',
  },
  likeEmpty: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  searchInput: {
    width: '100%',
    alignSelf: 'center',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
