import {Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {colorSchema, mediaUrl} from '../utils/variables';
import {ListItem as RNEListItem, Avatar, ButtonGroup} from '@rneui/themed';
import {useMedia} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LikeEmpty from '../assets/like_empty.svg';

const ListItem = ({navigation, singleMedia, myFilesOnly, favorites}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const descriptionParsed = JSON.parse(singleMedia.description);
  console.log(
    '%cListItem.js line:15 descriptionParsed',
    'color: white; color: #26bfa5;',
    descriptionParsed
  );

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
        {descriptionParsed.description.length < 70 ? (
          <RNEListItem.Subtitle>
            {descriptionParsed.description}
          </RNEListItem.Subtitle>
        ) : (
          <RNEListItem.Subtitle>
            {descriptionParsed.description.substr(0, 70) + '...'}
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
      <RNEListItem.Content style={styles.borders}>
        <RNEListItem.Subtitle style={styles.listPrice}>
          {descriptionParsed.budget} EUR
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
      <LikeEmpty
        style={styles.likeEmpty}
        height={35}
        width={35}
        onPress={() => {
          navigation.navigate('AddTask');
        }}
      />
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 5,
    // borderWidth: 2,
    // borderColor: 'red',
    marginRight: -20,
    // height: 150,
  },
  listDescription: {
    alignSelf: 'flex-start',
    width: '70%',
    flexGrow: 3,
    // borderWidth: 2,
    // borderColor: 'red',
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
  borders: {
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
