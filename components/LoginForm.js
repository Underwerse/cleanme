import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useLogin} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {Input, Button, Text, Card} from '@rneui/themed';

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
      // console.log('Button pressed', isLoggedIn);
      const userData = await postLogin(loginCredentials);
      console.log('User data: ', userData);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login - logIn', error);
      // TODO: nofify user about wrong username/password/net error?
    }
  };

  return (
    <Card>
      <Card.Title>Login</Card.Title>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
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
          required: true,
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

      <Button title="Sign in!" onPress={handleSubmit((data) => logIn(data))} />
    </Card>
  );
};

/* const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
}); */
