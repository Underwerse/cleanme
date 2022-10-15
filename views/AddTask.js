import React, {useContext, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import {applicationTag, colorSchema} from '../utils/variables';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Header from '../components/Header';
import Styles from '../utils/Styles';

const AddTask = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();

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
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.cancelled) {
      setMediaFile(result.uri);
      setMediaType(result.type);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    const descriptionUnited = {
      description: data.description,
      deadline: data.deadline,
      address: data.address,
      budget: data.budget,
      projectLabel: 'cleanme',
    };
    formData.append('description', JSON.stringify(descriptionUnited));
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

      const tag = {file_id: mediaResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);

      Alert.alert('Add Task status', 'Task has been added successfully', [
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
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <Header navigation={navigation} />
      <Card.Title style={Styles.titleMain}>Add new task</Card.Title>
      <ScrollView style={Styles.container}>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 5,
              message: 'Title must be at least 5 characters',
            },
            maxLength: {
              value: 20,
              message: 'Title must be maximum 20 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Title *"
              autoCapitalize="sentences"
              errorMessage={errors.title && errors.title.message}
            />
          )}
          name="title"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 20,
              message: 'Description must be at least 20 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description *"
              errorMessage={errors.description && errors.description.message}
            />
          )}
          name="description"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 5,
              message: 'Address must be at least 5 characters',
            },
            maxLength: {
              value: 50,
              message: 'Address must be maximum 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Address *"
              errorMessage={errors.address && errors.address.message}
            />
          )}
          name="address"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 1,
              message: 'Minimum amount 1 EUR',
            },
            maxLength: {
              value: 3,
              message: 'Maximum amount 999 EUR',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Budget (EUR) *"
              errorMessage={errors.budget && errors.budget.message}
            />
          )}
          name="budget"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={Styles.deadlineWrap}>
              <Text style={Styles.dateInput}>Deadline: </Text>
              <Text
                style={{...Styles.dateInput, color: colorSchema.mainColor}}
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
          <View style={Styles.imageContainer}>
            <Card.Image
              source={{uri: mediaFile}}
              containerStyle={Styles.singleImage}
            />
          </View>
        )}

        <Button
          type="clear"
          titleStyle={{color: colorSchema.mainColor}}
          containerStyle={Styles.btnEmptyContainer}
          title="Select media"
          onPress={pickImage}
        />

        <Button
          type="clear"
          titleStyle={Styles.btnEmptyTitle}
          containerStyle={Styles.btnEmptyContainer}
          title="Reset form"
          onPress={resetForm}
        />

        <Button
          buttonStyle={Styles.btnBase}
          title="Add new task"
          disabled={!mediaFile}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </>
  );
};

AddTask.propTypes = {
  navigation: PropTypes.object,
};

export default AddTask;
