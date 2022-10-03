import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {LoginForm} from '../components/LoginForm';
import {RegisterForm} from '../components/RegisterForm';
import {Card, ButtonGroup} from 'react-native-elements';
import LottieView from 'lottie-react-native';

const Login = ({navigation}) => {
  // AsyncStorage.setItem('userToken', null);
  const animation = React.createRef();
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [showRegForm, setShowRegForm] = useState(false);

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token value in async storage', userToken);
    if (!userToken) {
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      console.log('token', userToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkToken();
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
        <ScrollView contentContainerStyle={styles.container}>
          <Card>
            <Card.Image style={styles.fakeImage}>
              {/* <Logo /> */}
              <LottieView
                ref={animation}
                source={require('../assets/clean.json')}
                style={styles.animation}
                loop={true}
              />
            </Card.Image>
            <ButtonGroup
              onPress={() => setShowRegForm(!showRegForm)}
              selectedIndex={showRegForm ? 0 : 1}
              buttons={['Login', 'Register']}
            />
          </Card>
          {showRegForm ? (
            <Card>
              <Card.Title h4>Login</Card.Title>
              <Card.Divider />
              <LoginForm />
            </Card>
          ) : (
            <Card>
              <Card.Title h4>Register</Card.Title>
              <Card.Divider />
              <RegisterForm setShowRegForm={setShowRegForm} />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
