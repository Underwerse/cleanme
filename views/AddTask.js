import React, {useContext, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {applicationTag} from '../utils/variables';

const Upload = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const resetForm = () => {
    setMediaFile(null);
    setMediaType(null);
    setValue('title', '');
    setValue('description', '');
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.7,
    });

    // console.log('pick image result: ', result);

    if (!result.cancelled) {
      setMediaFile(result.uri);
      setMediaType(result.type);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (!mediaFile) {
      Alert.alert('Check image', 'No image selected!');
      return;
    }
    const fileName = mediaFile.split('/').pop();
    let fileExtension = mediaFile.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: mediaFile,
      name: fileName,
      type: mediaType + '/' + fileExtension,
    });
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const mediaResponse = await postMedia(token, formData);
      setUpdate(!update);
      console.log('postMedia result: ', mediaResponse);

      const tag = {file_id: mediaResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);
      console.log('postTag result:', tagResponse);

      Alert.alert('Uploading status', mediaResponse.message, [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            setTimeout(() => {
              navigation.navigate('Home');
            }, 1000);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Uploading status', error.message);
      // console.log('onSubmit postMedia error: ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
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
            placeholder="Title"
            autoCapitalize="words"
            errorMessage={
              (errors.title?.type === 'required' && (
                <Text>This is required.</Text>
              )) ||
              (errors.title?.type === 'minLength' && <Text>Min 3 chars!</Text>)
            }
          />
        )}
        name="title"
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Description"
          />
        )}
        name="description"
      />
      {mediaFile && <Card.Image source={{uri: mediaFile}} />}

      <Button title="Select media" onPress={pickImage} />

      <Button title="Reset form" onPress={resetForm} />

      <Button
        title="Upload media"
        disabled={!mediaFile}
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </Card>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
