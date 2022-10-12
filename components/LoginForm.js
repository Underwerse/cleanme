import React, {useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {colorSchema} from '../utils/variables';

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
  });

  const logIn = async (loginCredentials) => {
    try {
      const userData = await postLogin(loginCredentials);
      await AsyncStorage.setItem('userToken', userData.token);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login - logIn', error);
      // TODO: nofify user about wrong username/password/net error?
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card.Title style={{fontSize: 26, color: colorSchema.mainColor}}>
          Login
        </Card.Title>
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
              placeholder="Username"
              autoCapitalize="none"
              errorMessage={
                (errors.username?.type === 'required' && (
                  <Text>This is required.</Text>
                )) ||
                (errors.username?.type === 'minLength' && (
                  <Text>Min 3 chars!</Text>
                ))
              }
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
              placeholder="Password"
              errorMessage={errors.password && <Text>This is required.</Text>}
            />
          )}
          name="password"
        />

        <Button
          buttonStyle={styles.btn}
          title="Sign in!"
          onPress={handleSubmit((data) => logIn(data))}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  dateInput: {
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  deadlineWrap: {
    flexDirection: 'row',
  },
  btn: {
    marginBottom: 20,
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
  },
});

LoginForm.propTypes = {
  navigation: PropTypes.object,
};
