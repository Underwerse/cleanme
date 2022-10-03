import React, {useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

const Start = ({navigation}) => {
  const animation = React.createRef();

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styles.FlexGrowOne}
      >
        <LottieView
          ref={animation}
          source={require('../assets/clean.json')}
          style={styles.animation}
          loop={true}
        />
        
      </KeyboardAvoidingView>
      <Button
        title={'Start'}
        type="clear"
        onPress={navigation.navigate('Login')}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  FlexGrowOne: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  animation: {
    justifyContent: 'center',
    flex: 1,
  },
  fakeImage: {
    backgroundColor: '#fff',
  },
});

Start.propTypes = {
  navigation: PropTypes.object,
};

export default Start;
