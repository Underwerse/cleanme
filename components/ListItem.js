import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import PropTypes from 'prop-types';
import {
  ListItem as RNEListItem,
  Avatar,
  ButtonGroup,
  Text,
} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colorSchema, mediaUrl} from '../utils/variables';
import {useFavourite, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import LikeEmpty from '../assets/like_empty.svg';
import LikeFull from '../assets/like_full.svg';
import Styles from '../utils/Styles';

const ListCommentsItem = ({
  navigation,
  singleMedia,
  myFilesOnly,
  filterWord,
}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate, user} = useContext(MainContext);
  const [userLike, setUserLike] = useState(false);
  const [likes, setLikes] = useState([]);
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const {postFavourite, getFavouritesByFileId, deleteFavourite} =
    useFavourite();
  const {getAvatar} = useUser();

  const descriptionParsed = JSON.parse(singleMedia.description);

  const fetchLikes = async () => {
    try {
      const likesData = await getFavouritesByFileId(singleMedia.file_id);
      setLikes(likesData);
      likesData.forEach((like) => {
        if (like.user_id === user.user_id) {
          setUserLike(true);
          return;
        }
        // setUpdate(!update);
      });
    } catch (error) {
      console.error('fetchLikes() error', error);
    }
  };

  const createFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(singleMedia.file_id, token);
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
      const response = await deleteFavourite(singleMedia.file_id, token);
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
            const response = await deleteMedia(token, singleMedia.file_id);
            response && setUpdate(!update);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const fetchAvatar = async (singleMedia) => {
    try {
      const avatarRes = await getAvatar(singleMedia.user_id);
      avatarRes && setAvatar(mediaUrl + avatarRes.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [update, userLike]);

  useEffect(() => {
    fetchAvatar(singleMedia);
  }, []);

  return (
    <RNEListItem
      style={Styles.listItemContainer}
      onPress={() => {
        navigation.navigate('SingleTask', {
          file: singleMedia,
          name: singleMedia.title,
        });
      }}
    >
      <Avatar
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />
      <RNEListItem.Content style={Styles.listDescription}>
        <RNEListItem.Title
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colorSchema.mainColor,
          }}
        >
          {singleMedia.title}
        </RNEListItem.Title>
        {descriptionParsed.description.length < 60 ? (
          <RNEListItem.Subtitle>
            {descriptionParsed.description}
          </RNEListItem.Subtitle>
        ) : (
          <RNEListItem.Subtitle>
            {descriptionParsed.description.substr(0, 60)}
            <Text style={{color: colorSchema.mainColor, fontWeight: 'bold'}}>
              {' '}
              ...view more{' '}
            </Text>
          </RNEListItem.Subtitle>
        )}
        {myFilesOnly && (
          <ButtonGroup
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('ModifyTask', {file: singleMedia});
              } else {
                doDelete();
              }
            }}
            buttons={['Modify', 'Delete']}
            rounded
          />
        )}
        <RNEListItem.Subtitle style={Styles.creatorAvatar}>
          <Avatar source={{uri: avatar}} rounded />
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
      <RNEListItem.Content
        style={{
          alignSelf: 'flex-start',
        }}
      >
        <RNEListItem.Subtitle style={Styles.listPrice}>
          {descriptionParsed.budget} {'\u20AC'}
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
      {!userLike ? (
        <LikeEmpty
          style={{...Styles.like, top: 60, right: 35}}
          height={35}
          width={35}
          onPress={() => {
            createFavourite();
          }}
        />
      ) : (
        <LikeFull
          style={{...Styles.like, top: 60, right: 35}}
          height={35}
          width={35}
          onPress={() => {
            removeFavourite();
          }}
        />
      )}
      <Text style={{...Styles.likeQty, top: 80, right: 30}}>
        {likes.length}
      </Text>
    </RNEListItem>
  );
};

ListCommentsItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  filterWord: PropTypes.string,
};

export default ListCommentsItem;
