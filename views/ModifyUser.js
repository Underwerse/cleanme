import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {Input, Button} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import {Card, Text} from '@rneui/themed';
import Header from '../components/Header';
import Styles from '../utils/Styles';
import {mediaUrl} from '../utils/variables';

const ModifyUser = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {checkUsername, putUser, getAvatar} = useUser();
  const {postTag} = useTag();
  const {postMedia} = useMedia();
  const [avatar, setAvatar] = useState('https://placekitten.com/640');
  const [mediaFile, setMediaFile] = useState(null);
  const [avatarId, setAvatarId] = useState(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      password: '',
      confirmPassword: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      const token = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, token);
      if (userData) {
        Alert.alert(
          'User data change status',
          'User data has been successfully updated'
        );
        delete data.password;
        setUser({...data, user_id: user.user_id});
        navigation.navigate('Profile', {
          avatarUri: avatar || 'https://placekitten.com/640',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarRes = await getAvatar(user.user_id);
      if (avatarRes) {
        setAvatar(mediaUrl + avatarRes.filename);
        setAvatarId(avatarRes.file_id);
        console.log('avatarRes', avatarRes);
        console.log('avatar', avatar);
        console.log('avatarId', avatarId);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateAvatar = async (avatarUri) => {
    const formData = new FormData();
    formData.append('title', '');
    formData.append('description', '');
    const fileName = avatarUri.split('/').pop();
    let fileExtension = avatarUri.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: avatarUri,
      name: fileName,
      type: 'image' + '/' + fileExtension,
    });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const mediaResponse = await postMedia(token, formData);

      if (mediaResponse) {
        setAvatar(avatarUri);
        const tag = {
          file_id: mediaResponse.file_id,
          tag: 'avatar_' + user.user_id,
        };
        const tagResponse = await postTag(token, tag);
        console.log('tagResponse', tagResponse);

        Alert.alert(
          'Change avatar status',
          'Avatar has been changed successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Profile', {
                  avatarUri: avatarUri || 'https://placekitten.com/640',
                });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Change avatar status',
          "Avatar hasn't been updated for some reason",
          [
            {
              text: 'OK',
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Change avatar status', error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    if (!result.cancelled) {
      Alert.alert(
        'Avatar update confirmation',
        'Do you really want to change your avatar to chosen one?',
        [
          {text: 'Cancel'},
          {
            text: 'OK',
            onPress: () => {
              console.log('result', result);
              updateAvatar(result.uri);
              setMediaFile(result.uri);
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatar, avatarId, mediaFile]);

  return (
    <>
      <Header></Header>
      <Card.Title style={Styles.titleMain}>Modify account details</Card.Title>
      <ScrollView contentContainerStyle={Styles.container}>
        <View
          style={{
            alignSelf: 'center',
          }}
        >
          <Card.Image
            style={{...Styles.profileAvatar, marginBottom: 20}}
            source={{
              uri: !avatar ? avatar : avatar,
            }}
          />
          <Text style={Styles.changeAvatarLink} onPress={pickImage}>
            change avatar
          </Text>
        </View>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters.',
            },
            validate: async (value) => {
              try {
                const available = await checkUsername(value);
                if (available || user.username === value) {
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
            <>
              <Text style={Styles.textField}>Username:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Username"
                errorMessage={errors.username && errors.username.message}
              />
            </>
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            minLength: {
              value: 5,
              message: 'Password must be at least 5 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text style={Styles.textField}>Password:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholder="Password"
                errorMessage={errors.password && errors.password.message}
              />
            </>
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            validate: (value) => {
              const {password} = getValues();
              if (value === password) {
                return true;
              } else {
                return 'passwords do not match.';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text style={Styles.textField}>Confirm password:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholder="Confirm Password"
                errorMessage={
                  errors.confirmPassword && errors.confirmPassword.message
                }
              />
            </>
          )}
          name="confirmPassword"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value:
                /^[a-z0-9\-\+]+(?:[a-z0-9\.\-\+]+)*@[a-z0-9\-\+]{2,20}?\.(?:[a-zA-Z]{2,10})$/,
              message: 'must be valid email.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text style={Styles.textField}>Email:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Email"
                errorMessage={errors.email && errors.email.message}
              />
            </>
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'full name must be at least 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text style={Styles.textField}>Full name:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
                placeholder="Full name"
                errorMessage={errors.full_name && errors.full_name.message}
              />
            </>
          )}
          name="full_name"
        />

        <Button
          buttonStyle={Styles.btnBase}
          title="Apply changes"
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </>
  );
};

ModifyUser.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyUser;
