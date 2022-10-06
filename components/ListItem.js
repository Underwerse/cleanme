import {Alert} from 'react-native';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import {ListItem as RNEListItem, Avatar, ButtonGroup} from '@rneui/themed';
import {useMedia} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = ({navigation, singleMedia, myFilesOnly, favorites}) => {
  // console.log('myFilesOnly:', myFilesOnly);
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
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
  return (
    <RNEListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Avatar
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />
      <RNEListItem.Content>
        <RNEListItem.Title>{singleMedia.title}</RNEListItem.Title>
        <RNEListItem.Subtitle>{singleMedia.description}</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>
          Type: {singleMedia.media_type}
        </RNEListItem.Subtitle>
        {myFilesOnly && (
          <ButtonGroup
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('Modify', {file: singleMedia});
              } else {
                doDelete();
              }
            }}
            buttons={['Modify', 'Delete']}
            rounded
          />
        )}
      </RNEListItem.Content>
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
