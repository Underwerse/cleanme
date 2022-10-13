import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Button, ListItem, Text} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import {colorSchema, mediaUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('https://placekitten.com/640');
  const {getAvatar} = useUser();

  const fetchAvatar = async () => {
    try {
      const avatarRes = await getAvatar(user.user_id);
      avatarRes && setAvatar(mediaUrl + avatarRes.filename);
      console.log(avatar);
    } catch (error) {
      console.error(error.message);
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
          color: colorSchema.primaryTextColor,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        Account details
      </Card.Title>
      <View
        style={{
          alignSelf: 'center',
        }}
      >
        <Card.Image
          style={{
            borderRadius: 100,
            resizeMode: 'contain',
            height: 200,
            width: 200,
          }}
          source={{
            uri: avatar,
          }}
        />
      </View>
      <ListItem>
        <Text style={styles.textStyle}>Username: </Text>
        <Text
          style={{
            color: colorSchema.mainColor,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          {user.username}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>User ID: </Text>
        <Text
          style={{
            color: colorSchema.mainColor,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          {user.user_id}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>Email: </Text>
        <Text
          style={{
            color: colorSchema.mainColor,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          {user.email}
        </Text>
      </ListItem>
      <ListItem>
        <Text style={styles.textStyle}>Full name: </Text>
        <Text
          style={{
            color: colorSchema.mainColor,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          {user.full_name}
        </Text>
      </ListItem>

      <Button
        buttonStyle={styles.btn}
        title="Modify user"
        onPress={() => {
          navigation.navigate('ModifyUser');
        }}
      />
      <Button buttonStyle={styles.btn} title={'Logout'} onPress={logout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSchema.bgrColor,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textStyle: {
    color: colorSchema.primaryTextColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  btn: {
    backgroundColor: colorSchema.mainColor,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
