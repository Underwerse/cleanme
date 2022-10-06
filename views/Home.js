import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import PropTypes from 'prop-types';
import AddButton from '../assets/add-btn.svg';
// import {MainContext} from '../contexts/MainContext';
// import {useContext, useLayoutEffect} from 'react';

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
      <View>
        <List navigation={navigation} />
        <AddButton
          style={styles.addBtn}
          height={'16%'}
          width={'16%'}
          onPress={() => {
            navigation.navigate('Upload');
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 80,
    left: '42%',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
