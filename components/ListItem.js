import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

const ListItem = (props) => {
  const mediaUrl = 'https://media.mw.metropolia.fi/wbma/uploads/';
  const thumbnailUrl =
    mediaUrl + props.singleMedia.filename.split('.')[0] + '-tn160.png';
  return (
    <TouchableOpacity style={styles.flexContainer}>
      <Image
        style={{width: 100, height: 100, marginLeft: 10}}
        source={{uri: thumbnailUrl}}
      />
      <View style={styles.textBlock}>
        <Text style={{fontWeight: 'bold'}}>{props.singleMedia.title}</Text>
        <Text style={{maxWidth: '85%'}}>{props.singleMedia.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
};

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bebe',
    marginBottom: 10,
  },
  textBlock: {
    margin: 10,
  },
});

export default ListItem;
