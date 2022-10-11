import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useTag} from '../hooks/ApiHooks';
import {colorSchema, mediaUrl} from '../utils/variables';
import {Button, ListItem, Text} from '@rneui/themed';
import {ScrollView, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-elements';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('https://placekitten.com/640');
  const {getFilesByTag} = useTag();

  const fetchAvatar = async () => {
    try {
      const resultArray = await getFilesByTag('avatar_' + user.user_id);
      const avatarFile = resultArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
    } catch (error) {
      console.log('fetchAvatar error: ', error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  });

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Profile - logout', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card.Title
        style={{
          fontWeight: '900',
          fontSize: 30,
          color: colorSchema.mainColor,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        Account details
      </Card.Title>
      <Card.Image
        style={{
          padding: 20,
          borderRadius: 100,
          resizeMode: 'contain',
          alignSelf: 'center',
          width: 200,
        }}
        source={{
          uri: avatar,
        }}
        PlaceholderContent={<ActivityIndicator />}
      />
      <ListItem>
        <Text style={styles.textStyle}>Username: </Text>
        <Text style={{color: 'blue', fontSize: 20, textAlign: 'center'}}>
          {user.username}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>User ID: </Text>
        <Text style={{color: 'blue', fontSize: 20, textAlign: 'center'}}>
          {user.user_id}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>Email: </Text>
        <Text style={{color: 'blue', fontSize: 20, textAlign: 'center'}}>
          {user.email}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>Full name: </Text>
        <Text style={{color: 'blue', fontSize: 20, textAlign: 'center'}}>
          {user.full_name}
        </Text>
      </ListItem>

      <Button
        buttonStyle={{
          borderRadius: 20,
          marginTop: 5,
          marginBottom: 5,
        }}
        title="Modify user"
        onPress={() => {
          navigation.navigate('ModifyUser');
        }}
      />
      <Button
        buttonStyle={{
          borderRadius: 20,
          marginTop: 5,
          marginBottom: 5,
        }}
        title={'Logout'}
        onPress={logout}
      />
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    /* justifyContent: 'center',
    alignItems: 'center',*/
    paddingLeft: 20,
    paddingRight: 20,
  },
  textStyle: {
    color: colorSchema.mainColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Profile;
