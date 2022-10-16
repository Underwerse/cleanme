import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {ButtonGroup, Icon, Input} from '@rneui/themed';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colorSchema, mediaUrl} from '../utils/variables';
import {useComment, useFavourite, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import LikeEmpty from '../assets/like_empty.svg';
import LikeFull from '../assets/like_full.svg';
import ListComments from '../components/ListComments';
import Header from '../components/Header';
import Styles from '../utils/Styles';
import FullSizeImage from '../components/FullSizeImage';

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

  const fetchOwner = async (file) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getOwner(file.user_id, token);
      setOwner(userData);
    } catch (error) {
      // TODO: how should user be notified?
      console.error('fetch owner error', error);
      setOwner({username: '[not available]'});
    }
  };

  const fetchAvatar = async (file) => {
    try {
      const avatarRes = await getAvatar(file.user_id);
      if (avatarRes) {
        setAvatar(mediaUrl + avatarRes.filename);
      }
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
    if (comment !== '') {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await postComment(commentData, token);
        if (response) {
          setAddComment('');
          addCommentInput.current.clear();
        }
      } catch (error) {
        console.error('createFavourite error', error);
      }
    } else {
      Alert.alert('Empty comment', 'Please write your comment before send', [
        {text: 'OK'},
      ]);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsByFile(file.file_id);
      if (response) {
        setFileComments(response);
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
            const response = await deleteMedia(token, file.file_id);
            response && setUpdate(!update);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
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
      <Header></Header>
      <Card.Title style={Styles.titleMain}>{file.title}</Card.Title>
      <ScrollView contentContainerStyle={Styles.container}>
        <ListItem>
          <Text style={Styles.text}>{descriptionParsed.description}</Text>
        </ListItem>
        {file.media_type === 'image' ? (
          <FullSizeImage
            source={{uri: mediaUrl + file.filename}}
            style={Styles.image}
          />
        ) : (
          <Video
            ref={videoRef}
            style={Styles.singleImage}
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
        <ListItem style={Styles.textItem}>
          <Text style={Styles.singleTextDetailsTitle}>Customer: </Text>
          <Avatar source={{uri: avatar}} rounded />
          <Text style={Styles.singleTextDetailsValue}>
            {owner.full_name != '' ? owner.full_name : 'No name set up'}
          </Text>
        </ListItem>
        <ListItem style={Styles.textItem}>
          <Text style={Styles.singleTextDetailsTitle}>
            Task creation date:{' '}
          </Text>
          <Text style={Styles.singleTextDetailsValue}>
            {file.time_added.split('T')[0]}
          </Text>
        </ListItem>
        <ListItem style={Styles.textItem}>
          <Text style={Styles.singleTextDetailsTitle}>Task deadline: </Text>
          <Text style={Styles.singleTextDetailsValue}>
            {descriptionParsed.deadline}
          </Text>
        </ListItem>
        <ListItem style={Styles.textItem}>
          <Text style={Styles.singleTextDetailsTitle}>Task budget: </Text>
          <Text style={{...Styles.singleTextDetailsValue, fontWeight: 'bold'}}>
            {descriptionParsed.budget} {'\u20AC'}
          </Text>
        </ListItem>
        <ListItem style={Styles.textItem}>
          <Text style={Styles.singleTextDetailsTitle}>Address: </Text>
          <Text style={Styles.singleTextDetailsValue}>
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
            buttonStyle={Styles.btnGreen}
            title="I'm ready to do that!"
            onPress={() => {
              Alert.alert(
                'Job request',
                'Would you like to send your proposal to the Customer?',
                [{text: 'Cancel'}, {text: 'OK'}]
              );
            }}
          />
        )}
        <Card.Title style={{fontSize: 22, marginBottom: 20}}>
          Comments
        </Card.Title>
        <View style={Styles.textItem}>
          <Input
            placeholder="Type your comment"
            leftIcon={Styles.commentIcon}
            containerStyle={{paddingRight: 55}}
            ref={addCommentInput}
            onChangeText={(value) => setAddComment(value)}
          />
          <View style={Styles.btnSendComment}>
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
        <ListComments
          commentsArray={fileComments}
          navigation={navigation}
          containerStyle={{marginBottom: 30, paddingBottom: 30}}
        ></ListComments>
      </ScrollView>
      {!userLike ? (
        <LikeEmpty
          style={Styles.like}
          height={35}
          width={35}
          onPress={() => {
            createFavourite();
          }}
        />
      ) : (
        <LikeFull
          style={Styles.like}
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

SingleTask.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleTask;
