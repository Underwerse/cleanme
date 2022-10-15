import React, {useContext} from 'react';
import {Alert, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Styles from '../utils/Styles';

export const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useLogin();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const logIn = async (loginCredentials) => {
    try {
      const userData = await postLogin(loginCredentials);
      if (userData) {
        await AsyncStorage.setItem('userToken', userData.token);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setUser(userData.user);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Wrong login or password', 'Check your login/password', [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      }
    } catch (error) {
      console.error('Login - logIn', error);
      // TODO: nofify user about wrong username/password/net error?
    }
  };

  return (
    <>
      <Card.Title style={Styles.titleMain}>Login</Card.Title>
      <ScrollView>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="username"
              autoCapitalize="none"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="password"
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />

        <Button
          buttonStyle={Styles.btnBase}
          title="Sign in!"
          onPress={handleSubmit((data) => logIn(data))}
        />
      </ScrollView>
    </>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};
