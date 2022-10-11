import React from 'react';
import {Text, ScrollView, StyleSheet, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Input, Button, Card} from '@rneui/themed';
import {colorSchema} from '../utils/variables';
import PropTypes from 'prop-types';

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
      <ScrollView style={styles.container}>
        <Card.Title style={{fontSize: 26, color: colorSchema.mainColor}}>
          Registration
        </Card.Title>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
            validate: async (value) => {
              return await checkUsername(value);
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="username *"
            />
          )}
          name="username"
        />
        {/* {errors.username?.type === 'required' && <Text>This is required.</Text>}
        {errors.username?.type === 'minLength' && <Text>Minimum 3 chars!</Text>} */}
        {errors.username?.type === 'validate' && (
          <Text style={styles.checkUsername}>Username is already taken</Text>
        )}

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
        {/* {errors.password?.type === 'minLength' && <Text>Minimum 5 chars!</Text>}
        {errors.password?.type === 'required' && <Text>This is required.</Text>} */}

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
        {/* {errors.password?.type === 'minLength' && <Text>Minimum 5 chars!</Text>}
        {errors.password?.type === 'required' && <Text>This is required.</Text>} */}

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
              placeholder="email *"
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

        <Button
          buttonStyle={styles.btn}
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
  checkUsername: {
    color: colorSchema.red,
    marginLeft: 10,
    marginTop: -20,
  },
  btn: {
    marginBottom: 20,
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
  },
});

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};
