import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import LogoSvg from '../assets/logo.svg';
import TitleSvg from '../assets/title.svg';
import Styles from '../utils/Styles';

const Header = ({navigation}) => {
  return (
    <View style={Styles.header}>
      <LogoSvg height={'100%'} width={'25%'} />
      <TitleSvg height={'80%'} width={'60%'} />
    </View>
  );
};

Header.propTypes = {
  navigation: PropTypes.object,
};

export default Header;
