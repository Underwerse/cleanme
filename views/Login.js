import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {useLogin} from '../hooks/ApiHooks';
import {LoginForm} from '../components/LoginForm';
import {RegisterForm} from '../components/RegisterForm';
import Header from '../components/Header';
import {colorSchema} from '../utils/variables';

const Login = ({navigation}) => {
  const {checkToken} = useLogin();
  const [showRegForm, setShowRegForm] = useState(false);

  useEffect(() => {
    checkToken();
  });

  return (
    <>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        {showRegForm ? <RegisterForm /> : <LoginForm />}
        <Text
          onPress={() => {
            setShowRegForm(!showRegForm);
          }}
          style={{marginTop: 20, textAlign: 'center'}}
        >
          {showRegForm ? (
            <>
              <Text>Already registered? </Text>
              <Text style={{color: colorSchema.mainColor, fontWeight: 'bold'}}>
                Log in
              </Text>
            </>
          ) : (
            <>
              <Text>No account yet? </Text>
              <Text style={{color: colorSchema.mainColor, fontWeight: 'bold'}}>
                Register
              </Text>
            </>
          )}
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    paddingLeft: 20,
    paddingRight: 20,
  },
  FlexGrowOne: {
    flexGrow: 1,
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
