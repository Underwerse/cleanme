import {Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {colorSchema, mediaUrl} from '../utils/variables';
import {ListItem as RNEListItem, Avatar, ButtonGroup} from '@rneui/themed';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LikeEmpty from '../assets/like_empty.svg';
import LikeFull from '../assets/like_full.svg';
import {Text} from '@rneui/base';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate, user} = useContext(MainContext);
  const [userLike, setUserLike] = useState(false);
  const [likes, setLikes] = useState([]);

  const descriptionParsed = JSON.parse(singleMedia.description);
  const {postFavourite, getFavouritesByFileId, deleteFavourite} =
    useFavourite();

  const fetchLikes = async () => {
    try {
      const likesData = await getFavouritesByFileId(singleMedia.file_id);
      setLikes(likesData);
      likesData.forEach((like) => {
        if (like.user_id === user.user_id) {
          setUserLike(true);
        }
      });
    } catch (error) {
      console.error('fetchLikes() error', error);
    }
  };

  const createFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(singleMedia.file_id, token);
      response && setUserLike(true);
      setUpdate(!update);
    } catch (error) {
      console.error('createFavourite error', error);
    }
  };

  const removeFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavourite(singleMedia.file_id, token);
      response && setUserLike(false);
      setUpdate(!update);
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
            response && setUpdate(update + 1);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchLikes();
  }, [update]);

  return (
    <RNEListItem
      style={styles.listItemContainer}
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Avatar
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />
      <RNEListItem.Content style={styles.listDescription}>
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
                navigation.navigate('ModifyFile', {file: singleMedia});
              } else {
                doDelete();
              }
            }}
            buttons={['Modify', 'Delete']}
            rounded
          />
        )}
      </RNEListItem.Content>
      <RNEListItem.Content style={styles.budget}>
        <RNEListItem.Subtitle style={styles.listPrice}>
          {descriptionParsed.budget} EUR
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
      {!userLike ? (
        <LikeEmpty
          style={styles.likeEmpty}
          height={35}
          width={35}
          onPress={() => {
            createFavourite();
            // setIsLiked((isLiked) => !isLiked);
          }}
        />
      ) : (
        <LikeFull
          style={styles.likeEmpty}
          height={35}
          width={35}
          onPress={() => {
            removeFavourite();
            // setIsLiked((isLiked) => !isLiked);
          }}
        />
      )}
      <Text style={styles.likeQty}>{likes.length}</Text>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 5,
    marginRight: -20,
    // height: 150,
  },
  listDescription: {
    alignSelf: 'flex-start',
    width: '70%',
    flexGrow: 3,
  },
  listPrice: {
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -20,
  },
  likeEmpty: {
    position: 'absolute',
    top: 60,
    right: 35,
  },
  likeQty: {
    position: 'absolute',
    top: 80,
    right: 30,
  },
  budget: {
    alignSelf: 'flex-start',
    // borderWidth: 2,
    // borderColor: 'red',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
