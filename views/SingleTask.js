import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {colorSchema, mediaUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {Video} from 'expo-av';
import {useComment, useFavourite, useMedia, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {ButtonGroup, Icon, Input} from '@rneui/themed';
import LikeEmpty from '../assets/like_empty.svg';
import LikeFull from '../assets/like_full.svg';

const SingleTask = ({navigation, route}) => {
  const {file} = route.params;
  const videoRef = useRef(null);
  const {deleteMedia} = useMedia();
  const {postFavourite, getFavouritesByFileId, deleteFavourite} =
    useFavourite();
  const {getOwner, getAvatar} = useUser();
  const {postComment, getCommentsByFile} = useComment();
  const [owner, setOwner] = useState({username: 'fetching...'});
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const [likes, setLikes] = useState([]);
  const [userLike, setUserLike] = useState(false);
  const [addComment, setAddComment] = useState('');
  const [fileComments, setFileComments] = useState([]);
  const {update, setUpdate, user} = useContext(MainContext);
  const addCommentInput = useRef();

  const descriptionParsed = JSON.parse(file.description);

  console.log('file: ', file);

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

  const createComment = async (comment) => {
    const commentData = {file_id: file.file_id, comment: comment};
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postComment(commentData, token);
      if (response) {
        console.log('Post Comment response: ', response);
        setAddComment('');
        addCommentInput.current.clear();
      }
    } catch (error) {
      console.error('createFavourite error', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsByFile(file.file_id);
      if (response) {
        // setFileComments(response);
        console.log('comments arr:', response);
      }
    } catch (error) {
      console.error('fetchLikes() error', error);
    }
  };

  const createFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      if (response) {
        setUpdate(!update);
        setUserLike(true);
      }
    } catch (error) {
      console.error('createFavourite error', error);
    }
  };

  const removeFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavourite(file.file_id, token);
      if (response) {
        setUpdate(!update);
        setUserLike(false);
      }
    } catch (error) {
      console.error('removeFavourite error', error.message);
    }
  };

  const doDelete = () => {
    Alert.alert('Delete', 'Delete this file permanently?', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('token for delete file:', token);
            const response = await deleteMedia(token, singleMedia.file_id);
            response && setUpdate(!update);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    console.log('useEffect run');
    fetchLikes();
  }, [update, userLike]);

  useEffect(() => {
    fetchComments();
    fetchOwner(file);
    fetchAvatar(file);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [addComment]);

  return (
    <>
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
          <Text style={{...styles.textDetailsValue, fontWeight: 'bold'}}>
            {descriptionParsed.budget} {'\u20AC'}
          </Text>
        </ListItem>
        <ListItem style={styles.listItem}>
          <Text style={styles.textDetailsTitle}>Address: </Text>
          <Text style={styles.textDetailsValue}>
            {descriptionParsed.address}
          </Text>
        </ListItem>
        {user.user_id === file.user_id ? (
          <ButtonGroup
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('ModifyTask', {file: file});
              } else {
                doDelete();
              }
            }}
            buttons={['Modify', 'Delete']}
            rounded
            containerStyle={{
              marginBottom: 20,
              borderRadius: 20,
            }}
            buttonStyle={{
              backgroundColor: colorSchema.mainColor,
            }}
            textStyle={{
              color: colorSchema.bgrColor,
            }}
          />
        ) : (
          <Button
            buttonStyle={styles.btn}
            title="I'm ready to do that!"
            // onPress={handleSubmit(onSubmit)}
          />
        )}
        <Card.Title style={{fontSize: 22, marginBottom: 20}}>
          Comments
        </Card.Title>
        <View style={styles.listItem}>
          <Input
            placeholder="Comment"
            leftIcon={{
              type: 'font-awesome',
              name: 'comment',
              color: colorSchema.mainColor,
            }}
            containerStyle={{paddingRight: 65}}
            ref={addCommentInput}
            onChangeText={(value) => setAddComment(value)}
          />
          <View
            style={{
              position: 'absolute',
              right: 20,
              top: 5,
            }}
          >
            <Icon
              name="sc-telegram"
              type="evilicon"
              color={colorSchema.mainColor}
              size={50}
              onPress={() => {
                createComment(addComment);
              }}
            />
          </View>
        </View>
        <ListItem style={styles.listItem}>
          <Text style={styles.textDetailsValue}>
            {/* {descriptionParsed.address} */}
          </Text>
        </ListItem>
      </ScrollView>
      {!userLike ? (
        <LikeEmpty
          style={styles.likeEmpty}
          height={35}
          width={35}
          onPress={() => {
            createFavourite();
          }}
        />
      ) : (
        <LikeFull
          style={styles.likeEmpty}
          height={35}
          width={35}
          onPress={() => {
            removeFavourite();
          }}
        />
      )}
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
    marginTop: -15,
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
    backgroundColor: colorSchema.green,
    borderRadius: 40,
  },
  likeEmpty: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  likeQty: {
    position: 'absolute',
    top: 80,
    right: 30,
  },
});

SingleTask.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleTask;
