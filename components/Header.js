import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {colorSchema} from '../utils/variables';
import LogoSvg from '../assets/logo.svg';
import TitleSvg from '../assets/title.svg';

const Header = ({navigation}) => {
  return (
    <View style={styles.header}>
      <LogoSvg height={'100%'} width={'25%'} />
      <TitleSvg height={'80%'} width={'60%'} />
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
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colorSchema.bgrColor,
  },
});

export default Header;
