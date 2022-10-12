import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from '@rneui/base';
import {colorSchema, mediaUrl} from '../utils/variables';
import {ListItem as RNEListItem, Avatar} from '@rneui/themed';
import {useUser} from '../hooks/ApiHooks';

const ListCommentsItem = ({singleMedia, navigation}) => {
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const {getAvatar} = useUser();

  const fetchAvatar = async (singleMedia) => {
    try {
      const avatarRes = await getAvatar(singleMedia.user_id);
      avatarRes && setAvatar(mediaUrl + avatarRes.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar(singleMedia);
  }, []);

  return (
    <RNEListItem style={styles.listItemContainer}>
      <Avatar source={{uri: avatar}} rounded />
      <RNEListItem.Content style={styles.comment}>
        <Text style={styles.creationDate}>
          {singleMedia.time_added.split('T')[0]} at{' '}
          {singleMedia.time_added.split('T')[1].split('.0')[0]}
        </Text>
        <RNEListItem.Subtitle style={styles.comment}>
          {singleMedia.comment}
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 5,
    marginRight: -20,
  },
  comment: {
    fontSize: 20,
    color: colorSchema.mainColor,
  },
  creationDate: {
    fontSize: 15,
  },
  creatorAvatar: {
    position: 'absolute',
    top: 50,
    right: -40,
  },
});

ListCommentsItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListCommentsItem;
