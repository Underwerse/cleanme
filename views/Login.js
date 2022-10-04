import React, {useEffect, useState} from 'react';
import {StyleSheet, Keyboard, TouchableOpacity, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {useLogin} from '../hooks/ApiHooks';
import {LoginForm} from '../components/LoginForm';
import {RegisterForm} from '../components/RegisterForm';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = () => {
  const {checkToken} = useLogin();
  const [showRegForm, setShowRegForm] = useState(false);

  useEffect(() => {
    checkToken();
  });

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-between', alignItems: 'stretch'}}
    >
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <View>
          {showRegForm ? (
            <RegisterForm style={styles.inner} />
          ) : (
            <LoginForm style={styles.inner} />
          )}
          <Text
            onPress={() => {
              setShowRegForm(!showRegForm);
            }}
            style={{marginTop: 20, textAlign: 'center'}}
          >
            {showRegForm
              ? 'Already registered? Log in'
              : 'No account yet? Register a new account'}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
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

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;

/* const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('token: ', userToken);
      if (userToken != null) {
        const userData = await getUserByToken(userToken);
        console.log('user data: ', userData);
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      console.log('check token failed', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <View>
          {showRegForm ? (
            <RegisterForm style={styles.inner} />
          ) : (
            <LoginForm style={styles.inner} />
          )}
          <Button
            title={
              showRegForm
                ? 'Already registered? Log in'
                : 'No account yet? Register a new account'
            }
            onPress={() => {
              setShowRegForm(!showRegForm);
            }}
            style={{marginTop: 20}}
          ></Button>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -24,
  },
  inner: {
    // marginBottom: 15,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login; */
