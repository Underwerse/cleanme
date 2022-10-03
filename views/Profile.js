import React, {useContext, useEffect, useState} from 'react';
// import {StyleSheet, SafeAreaView, Text, Button, Image} from 'react-native';
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
  }, []);

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
          <Text>
            {user.username} (id: {user.user_id})
          </Text>
        </Card.Title>
        <Card.Divider />

        <Card.Image
          style={{padding: 0}}
          source={{
            uri: avatar,
          }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <ListItem>
          <Avatar
            icon={{
              name: 'contact-mail',
              type: 'material',
              color: 'black',
            }}
            containerStyle={{backgroundColor: '#aaa'}}
          />
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Text>Full name: {user.fullname}</Text>
        </ListItem>
        <Button
          title={'MyFiles'}
          type="clear"
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
        <Button
          title="Modify user"
          onPress={() => {
            navigation.navigate('Modify');
          }}
        />
        <Button title={'Logout'} type="clear" onPress={logout} />
      </Card>
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

/* const styles = StyleSheet.create({
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
}); */

export default Profile;
