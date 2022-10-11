import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colorSchema} from '../utils/variables';

const OnboardingScreen = ({navigation}) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          source={require('../assets/clean.json')}
        />
      </View>
      <View style={{marginBottom: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            style={[styles.startBtn]}
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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  animationContainer: {
    flex: 1,
  },
  startBtn: {
    // flex: 1,
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
