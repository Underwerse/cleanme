import {SafeAreaView, StyleSheet} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import PropTypes from 'prop-types';
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
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <List navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(33,32,40,255)',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
