import React from 'react';
import {Text, ScrollView, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Button, Card} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {colorSchema} from '../utils/variables';
import Styles from '../utils/Styles';

export const RegisterForm = ({navigation}) => {
  const {checkUsername, postUser} = useUser();

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      fullname: '',
    },
    mode: 'onBlur',
  });

  const register = async (data) => {
    const userData = {
      username: data.username,
      password: data.password,
      email: data.email,
      full_name: data.fullname,
    };
    try {
      const newUser = await postUser(userData);
      if (newUser) {
        Alert.alert('Success', 'User created successfully.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]);
      }
    } catch (error) {
      console.log('Register error: ', error);
    }
  };

  const openTerms = () => {
    Alert.alert('CleanMe! Terms', 'Terms to be added', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };

  const openPolicy = () => {
    Alert.alert('CleanMe! Privacy Policy', 'Policy to be added', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };

  return (
    <>
      <Card.Title style={Styles.titleMain}>Registration</Card.Title>
      <ScrollView>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
            validate: async (value) => {
              try {
                const available = await checkUsername(value);
                if (available) {
                  return true;
                } else {
                  return 'Username is already taken.';
                }
              } catch (error) {
                throw new Error(error.message);
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="username *"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 5,
              message: 'Password must be at least 5 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="password *"
              errorMessage={
                errors.password && <Text>{errors.password.message}</Text>
              }
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 5,
              message: 'Confirm password must be at least 5 characters.',
            },
            validate: (value) => {
              if (value === getValues('password')) {
                return true;
              } else {
                return 'Passwords are not the same';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="confirm password *"
              errorMessage={
                errors.passwordConfirm && (
                  <Text>{errors.passwordConfirm.message}</Text>
                )
              }
            />
          )}
          name="passwordConfirm"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'this is required'},
            pattern: {
              value:
                /^[a-z0-9\-\+]+(?:[a-z0-9\.\-\+]+)*@[a-z0-9\-\+]{2,20}?\.(?:[a-zA-Z]{2,10})$/i,
              message: 'must be a valid email!',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="email *"
              keyboardType="email-address"
              errorMessage={errors.email && <Text>{errors.email.message}</Text>}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="full name"
            />
          )}
          name="full_name"
        />

        <Button
          buttonStyle={Styles.btnBase}
          title="Register!"
          onPress={handleSubmit(register)}
        />
        <Text>
          By signing up on this application, you’re also agreeing to our&#x2007;
          <Text
            onPress={openTerms}
            style={{color: colorSchema.mainColor, fontWeight: 'bold'}}
          >
            Terms of Service
          </Text>{' '}
          and&#x2007;
          <Text
            onPress={openPolicy}
            style={{color: colorSchema.mainColor, fontWeight: 'bold'}}
          >
            Privacy Policy
          </Text>
        </Text>
      </ScrollView>
    </>
  );
};

RegisterForm.propTypes = {
  setFormToggle: PropTypes.func,
  navigation: PropTypes.object,
};
