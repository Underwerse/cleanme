import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import PropTypes from 'prop-types';
import AddButton from '../assets/add-btn.svg';

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
      <TouchableOpacity>
        <List navigation={navigation} />
        <AddButton
          style={styles.addBtn}
          height={'16%'}
          width={'16%'}
          onPress={() => {
            navigation.navigate('AddTask');
          }}
        />
      </TouchableOpacity>
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
