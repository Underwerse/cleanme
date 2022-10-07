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
          <Text style={styles.A}>UsernameGoesHere</Text>
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
            style={styles.avatarStyle}
            icon={{
              name: 'contact-mail',
              type: 'material',
              color: 'black',
            }}
            containerStyle={{backgroundColor: '#aaa'}}
          />
          <Text style={styles.textStyle}>emailGoesHere</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>Full name: FullnameGoesHere</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.textStyle}>userId: userIdGoesHere</Text>
        </ListItem>
        <Button
          style={styles.buttonStyle}
          title={'MyFiles'}
          type="clear"
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
        <Button
          style={styles.buttonStyle}
          title="Modify user"
          onPress={() => {
            navigation.navigate('Modify');
          }}
        />
        <Button
          style={styles.buttonStyle}
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
  buttonStyle: {
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    color: 'red',
  },
  avatarStyle: {
    borderRadius: 12,
  },
});

export default Profile;
