import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Input, Button, Card} from '@rneui/themed';

export const RegisterForm = () => {
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
      console.log('posted user: ', newUser);
    } catch (error) {
      console.log('Register error: ', error);
      // TODO: notify user when wrong login/pass
    }
  };

  return (
    <Card>
      <Card.Title>Registration form</Card.Title>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
          validate: async (value) => {
            return await checkUsername(value);
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="username"
          />
        )}
        name="username"
      />
      {errors.username?.type === 'required' && <Text>This is required.</Text>}
      {errors.username?.type === 'minLength' && <Text>Minimum 3 chars!</Text>}
      {errors.username?.type === 'validate' && (
        <Text>Username is already taken</Text>
        // <Text>{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 5,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="password"
          />
        )}
        name="password"
      />
      {errors.password?.type === 'minLength' && <Text>Minimum 5 chars!</Text>}
      {errors.password?.type === 'required' && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 5,
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            } else {
              return 'passwords are not the same';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="confirm password"
            errorMessage={
              errors.passwordConfirm && (
                <Text>{errors.passwordConfirm.message}</Text>
              )
            }
          />
        )}
        name="passwordConfirm"
      />
      {errors.password?.type === 'minLength' && <Text>Minimum 5 chars!</Text>}
      {errors.password?.type === 'required' && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'this is required'},
          pattern: {
            value: /^[a-z0-9.]{1,20}@[a-z0-9.]{2,20}[.][a-z0-9.]{2,10}/i,
            message: 'must be a valid email!',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="email"
            keyboardType="email-address"
            errorMessage={errors.email && <Text>{errors.email.message}</Text>}
          />
        )}
        name="email"
      />
      {/* {errors.email?.type === 'required' && <Text>This field is required</Text>}
      {errors.email?.type === 'keyboardType' && (
        <Text>This should be an email!</Text>
      )} */}

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

      <Button title="Sign up" onPress={handleSubmit(register)} />
    </Card>
  );
};
