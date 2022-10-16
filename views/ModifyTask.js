import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Input, Button, Text, Card} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm, Controller} from 'react-hook-form';
import {useMedia} from '../hooks/ApiHooks';
import {Alert, ScrollView, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {colorSchema, mediaUrl} from '../utils/variables';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import Styles from '../utils/Styles';
import FullSizeImage from '../components/FullSizeImage';

const ModifyTask = ({navigation, route}) => {
  const {file} = route.params;
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia, loading} = useMedia();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const descriptionParsed = JSON.parse(file.description);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: descriptionParsed.description,
      address: descriptionParsed.address,
      budget: descriptionParsed.budget,
      deadline: date.toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    const descriptionUnited = {...data, projectLabel: 'cleanme'};
    delete descriptionUnited.title;
    data = {
      title: data.title,
      description: JSON.stringify(descriptionUnited),
    };

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(token, data, file.file_id);
      setUpdate(!update);

      Alert.alert('Task update status status', 'Task has been updated', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.navigate('MyTasks');
            }, 1000);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Modifying status', error.message);
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
      <Header></Header>
      <Card.Title style={Styles.titleMain}>
        Edit task &quot;
        <Text style={{fontWeight: 'bold', color: colorSchema.mainColor}}>
          {file.title.trim()}
        </Text>
        &quot;
      </Card.Title>
      <ScrollView contentContainerStyle={Styles.container}>
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
            <>
              <Text style={Styles.textField}>Title:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Title *"
                autoCapitalize="sentences"
                errorMessage={
                  errors.title && <Text>{errors.title.message}</Text>
                }
              />
            </>
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
            <>
              <Text style={Styles.textField}>Description:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Description *"
                errorMessage={
                  errors.description && (
                    <Text>{errors.description.message}</Text>
                  )
                }
              />
            </>
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
            <>
              <Text style={Styles.textField}>Address:</Text>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Address *"
                errorMessage={
                  errors.address && <Text>{errors.address.message}</Text>
                }
              />
            </>
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
            <>
              <Text style={Styles.textField}>Budget:</Text>
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
            </>
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

        <FullSizeImage
          source={{uri: mediaUrl + file.filename}}
          style={Styles.image}
        />

        <Button
          buttonStyle={Styles.btnBase}
          title="Apply changes"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </>
  );
};

ModifyTask.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyTask;
