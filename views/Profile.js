import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {Avatar, Button, Card, Icon, ListItem, Text} from '@rneui/themed';
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
      <Card>
        <Card.Title>
          <Icon name="person" />
          <Text style={styles.textStyle}>{user.username}</Text>
        </Card.Title>
        <Card.Divider />

        <Card.Image
          style={{padding: 0, borderRadius: 20}}
          source={{
            uri: avatar,
          }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <ListItem>
          <Avatar
            avatarStyle={{borderRadius: 20}}
            icon={{
              name: 'contact-mail',
              type: 'material',
              color: 'black',
            }}
            containerStyle={{backgroundColor: '#aaa'}}
          />
          <Text style={styles.textStyle}>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>Full name: {user.full_name}</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>userId: {user.user_id}</Text>
        </ListItem>
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginTop: 5,
            marginBottom: 5,
          }}
          title={'MyFiles'}
          type="clear"
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginTop: 5,
            marginBottom: 5,
          }}
          title="Modify user"
          onPress={() => {
            navigation.navigate('Modify');
          }}
        />
        <Button
          buttonStyle={{
            borderRadius: 20,
            marginTop: 5,
            marginBottom: 5,
          }}
          title={'Logout'}
          type="clear"
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
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default Profile;
