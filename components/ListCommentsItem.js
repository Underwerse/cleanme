import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text} from '@rneui/base';
import {mediaUrl} from '../utils/variables';
import {ListItem as RNEListItem, Avatar} from '@rneui/themed';
import {useUser} from '../hooks/ApiHooks';
import Styles from '../utils/Styles';

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
    <RNEListItem style={Styles.listItemContainer}>
      <Avatar source={{uri: avatar}} rounded />
      <RNEListItem.Content style={Styles.singleTextDetailsValue}>
        <Text
          style={{
            fontSize: 15,
          }}
        >
          {singleMedia.time_added.split('T')[0]} at{' '}
          {singleMedia.time_added.split('T')[1].split('.0')[0]}
        </Text>
        <RNEListItem.Subtitle style={Styles.singleTextDetailsValue}>
          {singleMedia.comment}
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
    </RNEListItem>
  );
};

ListCommentsItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListCommentsItem;
