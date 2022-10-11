import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import PropTypes from 'prop-types';
import AddButton from '../assets/add-btn.svg';
import {Input} from '@rneui/themed';
import {colorSchema} from '../utils/variables';
// import {useIsFocused} from '@react-navigation/native';
// import {useContext, useEffect} from 'react';
// import {MainContext} from '../contexts/MainContext';

const Home = ({navigation}) => {
  // const {update, setUpdate} = useContext(MainContext);
  // setUpdate(!update);

  // useLayoutEffect(() => {
  // setUpdate(!update);
  //   console.log('update value:', update);
  // });

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
        />
      </View>
      <List
        navigation={navigation}
        myFilesOnly={false}
        myFavoritesOnly={false}
      />
      <AddButton
        style={styles.addBtn}
        height={'12%'}
        width={'12%'}
        onPress={() => {
          navigation.navigate('AddTask');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 0,
    left: '44%',
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
