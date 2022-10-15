import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {colorSchema} from '../utils/variables';

const OnboardingScreen = ({navigation}) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <LottieView
          autoPlay
          ref={animation}
          source={require('../assets/clean.json')}
        />
      </View>
      <View style={{marginBottom: 50}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => {
              navigation.replace('Login');
            }}
          >
            <Text style={{color: 'white'}}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startBtn: {
    height: 40,
    width: '50%',
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

OnboardingScreen.propTypes = {
  navigation: PropTypes.object,
};

export default OnboardingScreen;
