import React, {useContext, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {applicationTag, colorSchema} from '../utils/variables';
import Header from '../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {color} from '@rneui/base';

const Upload = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();

  const resetForm = () => {
    const tempDate = new Date();
    const currentDate = tempDate.toISOString().split('T')[0];
    setMediaFile(null);
    setMediaType(null);
    setValue('title', '');
    setValue('description', '');
    setValue('address', '');
    setValue('budget', '');
    setDate(tempDate);
    setValue('deadline', currentDate);
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
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      deadline: date.toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('deadline', data.deadline);
    formData.append('budget', data.budget);
    formData.append('address', data.address);
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
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    const date = new Date(selectedDate);
    setDate(selectedDate);
    setValue('deadline', date.toISOString().split('T')[0]);
    console.log('date.getFullYear()', date.getFullYear());
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
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
              placeholder="Title *"
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
              placeholder="Description *"
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
          rules={{
            required: true,
            minLength: 10,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Address *"
              errorMessage={
                errors.address && <Text>{errors.address.message}</Text>
              }
            />
          )}
          name="address"
        />
        {errors.address?.type === 'minLength' && <Text>Minimum 10 chars!</Text>}
        {errors.address?.type === 'required' && (
          <Text>This field is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 1,
            maxLength: 3,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Budget (EUR) *"
              errorMessage={
                errors.budget && <Text>{errors.budget.message}</Text>
              }
            />
          )}
          name="budget"
        />
        {errors.budget?.type === 'minLength' && <Text>Minimum 1 EUR!</Text>}
        {errors.budget?.type === 'maxLength' && <Text>Maximum 999 EUR!</Text>}
        {errors.budget?.type === 'required' && (
          <Text>This field is required.</Text>
        )}

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.deadlineWrap}>
              <Text style={styles.dateInput}>Deadline: </Text>
              <Text
                style={{...styles.dateInput, color: colorSchema.mainColor}}
                onPress={showDatepicker}
              >
                {value}
              </Text>
            </View>
          )}
          name="deadline"
        />
        {show && (
          <DateTimePicker onChange={onChangeDate} mode={'date'} value={date} />
        )}

        {mediaFile && (
          <Card.Image
            style={{resizeMode: 'contain', marginBottom: 20}}
            source={{uri: mediaFile}}
          />
        )}

        <Button
          buttonStyle={{
            borderColor: 'rgba(78, 116, 289, 1)',
          }}
          type="clear"
          titleStyle={{color: colorSchema.mainColor}}
          containerStyle={{
            marginHorizontal: 50,
            marginTop: -10,
            marginBottom: 20,
          }}
          title="Select media"
          onPress={pickImage}
        />

        <Button
          buttonStyle={{
            borderColor: 'rgba(78, 116, 289, 1)',
          }}
          type="clear"
          titleStyle={{color: colorSchema.mainColor}}
          containerStyle={{
            marginHorizontal: 50,
            marginTop: -10,
            marginBottom: 20,
          }}
          title="Reset form"
          onPress={resetForm}
        />

        <Button
          buttonStyle={styles.btn}
          title="Upload media"
          disabled={!mediaFile}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
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

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
