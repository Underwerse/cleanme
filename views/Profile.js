import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Button, ListItem, Text} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import {colorSchema, mediaUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import Header from '../components/Header';
import Styles from '../utils/Styles';

const Profile = ({route, navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    route.avatarUri || 'https://placekitten.com/640'
  );
  const {getAvatar} = useUser();

  const fetchAvatar = async () => {
    try {
      const avatarRes = await getAvatar(user.user_id);
      if (avatarRes) {
        setAvatar(mediaUrl + avatarRes.filename);
      }
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
    <>
      <Header></Header>
      <Card.Title style={Styles.titleMain}>Account details</Card.Title>
      <ScrollView contentContainerStyle={Styles.container}>
        <View
          style={{
            alignSelf: 'center',
          }}
        >
          <Card.Image
            style={Styles.profileAvatar}
            source={{
              uri: avatar,
            }}
          />
        </View>
        <ListItem>
          <Text style={Styles.singleTextDetailsTitle}>Username: </Text>
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
          <Text style={Styles.singleTextDetailsTitle}>User ID: </Text>
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
          <Text style={Styles.singleTextDetailsTitle}>Email: </Text>
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
          <Text style={Styles.singleTextDetailsTitle}>Full name: </Text>
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
          buttonStyle={Styles.btnBase}
          title="Modify user"
          onPress={() => {
            navigation.navigate('ModifyUser');
          }}
        />
        <Button
          type="clear"
          titleStyle={{color: colorSchema.mainColor}}
          containerStyle={Styles.btnEmptyContainer}
          title="Logout"
          onPress={logout}
        />
      </ScrollView>
    </>
  );
};

Profile.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Profile;
