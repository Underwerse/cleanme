import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {Button, Card, ListItem, Text} from '@rneui/themed';
import {ScrollView, ActivityIndicator} from 'react-native';

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
    <ScrollView>
      <Card
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card.Title style={{fontWeight: '900', fontSize: 28}}>
          Account details
        </Card.Title>
        <Card.Divider />

        <Card.Image
          style={{
            padding: 0,
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
          <Text style={{color: 'blue', textAlign: 'center'}}>
            {user.username}
          </Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>User ID: </Text>
          <Text style={{color: 'blue', textAlign: 'center'}}>
            {user.user_id}
          </Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>Email: </Text>
          <Text style={{color: 'blue', textAlign: 'center'}}>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>Full name: </Text>
          <Text style={{color: 'blue', textAlign: 'center'}}>
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
      </Card>
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  text: {
    marginBottom: 10,
    color: 'black',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Profile;
