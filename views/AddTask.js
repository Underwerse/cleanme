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
import Header from '../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';

const Upload = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();

  const resetForm = () => {
    setMediaFile(null);
    setMediaType(null);
    setValue('title', '');
    setValue('description', '');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setMediaFile(result.uri);
      setMediaType(result.type);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: 'asdf',
      description: 'lkjh',
      deadline: '2022',
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
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(watch('dateInput'));
  console.log('startDate', typeof startDate);

  const onChangeDate = (event, selectedDate) => {
    setStartDate(selectedDate);
    const date = new Date(selectedDate);
    setValue('deadline', date.toString());
    console.log('date.getFullYear()', date.getFullYear());
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <Header navigation={navigation} />
      <Card>
        <Card.Title style={{fontSize: 26}}>Add new task</Card.Title>
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
              placeholder="Title"
              autoCapitalize="sentences"
              errorMessage={errors.title && <Text>{errors.title.message}</Text>}
            />
          )}
          name="title"
        />
        {errors.title?.type === 'minLength' && <Text>Minimum 5 chars!</Text>}
        {errors.title?.type === 'required' && (
          <Text>This field is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 20,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description"
              errorMessage={
                errors.description && <Text>{errors.description.message}</Text>
              }
            />
          )}
          name="description"
        />
        {errors.description?.type === 'minLength' && (
          <Text>Minimum 20 chars! Describe your task, don`&#39`t be lazy!</Text>
        )}
        {errors.description?.type === 'required' && (
          <Text>This field is required.</Text>
        )}

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              placeholder="Deadline"
              errorMessage={
                errors.deadline && <Text>{errors.deadline.message}</Text>
              }
            />
          )}
          name="deadline"
        />
        <Button onPress={showDatepicker} title={'Pick date'} />
        {show && (
          <DateTimePicker
            onChange={onChangeDate}
            mode={'date'}
            is24Hour={true}
            value={startDate}
          />
        )}

        {mediaFile && (
          <Card.Image
            style={{resizeMode: 'contain', marginBottom: 20}}
            source={{uri: mediaFile}}
          />
        )}

        <Button title="Select media" onPress={pickImage} />

        <Button title="Reset form" onPress={resetForm} />

        <Button
          title="Upload media"
          disabled={!mediaFile}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>
    </>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
