import {StyleSheet} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import PropTypes from 'prop-types';
import AddButton from '../assets/add-btn.svg';
// import {useIsFocused} from '@react-navigation/native';
// import {useContext} from 'react';
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
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
