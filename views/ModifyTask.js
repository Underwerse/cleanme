import React, {useContext, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Text, Card} from '@rneui/themed';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {colorSchema, mediaUrl} from '../utils/variables';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModifyTask = ({navigation, route}) => {
  const {file} = route.params;
  console.log('file:', file);
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
    console.log('data', data);
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
      console.log('putMedia result: ', response);

      Alert.alert('Task update status status', response.message, [
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
    console.log('date.getFullYear()', date.getFullYear());
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
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
              errorMessage={errors.title && <Text>{errors.title.message}</Text>}
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
              errorMessage={
                errors.description && <Text>{errors.description.message}</Text>
              }
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
              errorMessage={
                errors.address && <Text>{errors.address.message}</Text>
              }
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
              errorMessage={
                errors.budget && <Text>{errors.budget.message}</Text>
              }
            />
          )}
          name="budget"
        />

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

        <Card.Image
          source={{uri: mediaUrl + file.filename}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />

        <Card.Divider />

        <Button
          buttonStyle={styles.btn}
          title="Apply changes"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
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
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
  },
});

ModifyTask.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyTask;
