import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Alert, ActivityIndicator, StyleSheet, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {mediaUrl} from '../utils/variables';

const ModifyFile = ({navigation, route}) => {
  const {file} = route.params;
  console.log('file:', file);
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia, loading} = useMedia();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: file.description,
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(token, data, file.file_id);
      setUpdate(!update);
      console.log('putMedia result: ', response);

      Alert.alert('Modifying status', response.message, [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.navigate('MyFiles');
            }, 1000);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Modifying status', error.message);
      // console.log('onSubmit postMedia error: ', error.message);
    }
  };

  return (
    <ScrollView>
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
                (errors.title?.type === 'minLength' && (
                  <Text>Min 3 chars!</Text>
                ))
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

        <Card.Image
          source={{uri: mediaUrl + file.filename}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />

        <Card.Divider />

        <Button
          title="Update media"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

ModifyFile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyFile;
