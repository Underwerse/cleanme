import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import LogoSvg from '../assets/logo.svg';
import TitleSvg from '../assets/title.svg';

const Header = ({navigation}) => {
  return (
    <View style={styles.header}>
      <LogoSvg height={'80%'} width={'25%'} />
      <TitleSvg height={'80%'} width={'60%'} />
      {/* <ImageBackground
        source={require('../assets/rabbit.jpg')}
        style={styles.logo}
        imageStyle={styles.logoImg}
      >
        <Text
          style={styles.slogan}
          onPress={() => console.log('Main logo clicked')}
        >
          Slogan koko sovellukselle
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
        >
          <Image
            style={styles.settings}
            source={require('../assets/burgerMenu.png')}
          />
        </TouchableOpacity>
      </ImageBackground> */}
    </View>
  );
};

Header.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  header: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    backgroundColor: 'white',
  },
  // slogan: {
  //   backgroundColor: 'rgba(33,32,40,0.7)',
  //   color: 'white',
  //   paddingLeft: 10,
  //   paddingRight: 10,
  //   lineHeight: 40,
  //   position: 'absolute',
  //   bottom: 15,
  //   left: 15,
  //   borderBottomRightRadius: 20,
  //   borderTopLeftRadius: 20,
  // },
  // logo: {
  //   height: '100%',
  //   width: '100%',
  //   backgroundColor: 'white',
  // },
  // logoImg: {
  //   resizeMode: 'cover',
  //   borderBottomRightRadius: 50,
  //   borderTopLeftRadius: 50,
  // },
  // settings: {
  //   position: 'absolute',
  //   top: 20,
  //   right: 20,
  //   width: 40,
  //   height: 40,
  // },
});

export default Header;
