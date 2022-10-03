import React, {useContext, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {mediaUrl} from '../utils/variables';

const ModifyFile = ({navigation, route}) => {
  const {file} = route.params;
  console.log('file:', file);
  const [isLoading, setIsLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia} = useMedia();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      c
      const response = await putMedia(token, data, file.file_id);
      setUpdate(!update);
      console.log('putMedia result: ', response);

      Alert.alert('Modifying status', response.message, [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              // navigation.navigate('MyFiles');
            }, 1000);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Modifying status', error.message);
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
      {file && (
        <Card.Image source={{uri: mediaUrl + 'uploads/' + file.filename}} />
      )}

      <Button
        title="Update media"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </Card>
  );
};

ModifyFile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyFile;
