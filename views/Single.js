import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {colorSchema, mediaUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {Video} from 'expo-av';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  const {file} = route.params;
  console.log('file: ', file);
  const videoRef = useRef(null);
  // const {getUserById} = useUser();
  // const {getFilesByTag} = useTag();
  const {postFavourite, getFavouritesByFileId, deleteFavourite} =
    useFavourite();
  const {getOwner, getAvatar} = useUser();
  const [owner, setOwner] = useState({username: 'fetching...'});
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const [likes, setLikes] = useState([]);
  const [userLike, setUserLike] = useState(false);
  const {update, setUpdate, user} = useContext(MainContext);

  const descriptionParsed = JSON.parse(file.description);

  const fetchOwner = async (file) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getOwner(file.user_id, token);
      setOwner(userData);
      console.log('Owner: ', userData);
    } catch (error) {
      // TODO: how should user be notified?
      console.error('fetch owner error', error);
      setOwner({username: '[not available]'});
    }
  };

  const fetchAvatar = async (file) => {
    try {
      const avatarRes = await getAvatar(file.user_id);
      avatarRes && setAvatar(mediaUrl + avatarRes.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchLikes = async () => {
    try {
      const likesData = await getFavouritesByFileId(file.file_id);
      setLikes(likesData);
      // TODO: check if user id of of logged in user is included in data and
      // set state userLike accordingly
      likesData.forEach((like) => {
        like.user_id === user.user_id && setUserLike(true);
      });
    } catch (error) {
      // TODO: how should user be notified?
      console.error('fetchLikes() error', error);
    }
  };

  const createFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      response && setUserLike(true);
      setUpdate(!update);
    } catch (error) {
      // TODO: what to do if user has liked this image already?
      console.error('createFavourite error', error);
    }
  };

  const removeFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavourite(file.file_id, token);
      response && setUserLike(false);
      setUpdate(!update);
    } catch (error) {
      // TODO: what to do if user has not liked this image already?
      console.error('removeFavourite error', error);
    }
  };

  useEffect(() => {
    fetchOwner(file);
    fetchAvatar(file);
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  return (
    <ScrollView style={styles.container}>
      <Card.Title style={{fontSize: 26}}>{file.title}</Card.Title>
      <ListItem>
        <Text style={styles.text}>{descriptionParsed.description}</Text>
      </ListItem>
      {file.media_type === 'image' ? (
        <View
          style={{
            alignSelf: 'center',
          }}
        >
          <Card.Image
            source={{uri: mediaUrl + file.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      ) : (
        <Video
          ref={videoRef}
          style={styles.image}
          source={{
            uri: mediaUrl + file.filename,
          }}
          usePoster
          posterSource={{
            uri: mediaUrl + file.screenshot,
          }}
          useNativeControls={true}
          isLooping
          resizeMode="contain"
          onError={(error) => {
            console.error('<Video> error', error);
          }}
        ></Video>
      )}
      <ListItem style={styles.listItem}>
        <Text style={styles.textDetailsTitle}>Customer: </Text>
        <Avatar source={{uri: avatar}} />
        <Text style={styles.textDetailsValue}>
          {owner.full_name != '' ? owner.full_name : 'No name set up'}
        </Text>
      </ListItem>
      <ListItem style={styles.listItem}>
        <Text style={styles.textDetailsTitle}>Task creation date: </Text>
        <Text style={styles.textDetailsValue}>
          {file.time_added.split('T')[0]}
        </Text>
      </ListItem>
      <ListItem style={styles.listItem}>
        <Text style={styles.textDetailsTitle}>Task deadline: </Text>
        <Text style={styles.textDetailsValue}>
          {descriptionParsed.deadline}
        </Text>
      </ListItem>
      <ListItem style={styles.listItem}>
        <Text style={styles.textDetailsTitle}>Task budget: </Text>
        <Text style={styles.textDetailsValue}>
          {descriptionParsed.budget} {'\u20AC'}
        </Text>
      </ListItem>
      <ListItem style={styles.listItem}>
        <Text style={styles.textDetailsTitle}>Address: </Text>
        <Text style={styles.textDetailsValue}>{descriptionParsed.address}</Text>
      </ListItem>
      <ListItem>
        <Text>Likes count: {likes.length}</Text>
        <Button
          disabled={userLike}
          title="Like"
          onPress={() => {
            createFavourite();
          }}
        ></Button>
        <Button
          disabled={!userLike}
          title="Unlike"
          onPress={() => {
            removeFavourite();
          }}
        ></Button>
      </ListItem>
    </ScrollView>
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
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 30,
    // alignSelf: 'center',
  },
  description: {
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: -10,
    marginRight: -10,
  },
  listItem: {
    fontSize: 20,
    marginTop: -20,
    marginLeft: -10,
    marginRight: -10,
  },
  textDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textDetailsValue: {
    fontSize: 20,
    color: colorSchema.mainColor,
  },
  btn: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: colorSchema.mainColor,
    borderRadius: 40,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
