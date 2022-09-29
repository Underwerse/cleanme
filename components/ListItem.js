import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

const ListItem = (props) => {
  return (
    <TouchableOpacity style={styles.flexContainer}>
      <Image
        style={{width: 100, height: 100, marginLeft: 10}}
        source={{uri: props.singleMedia.thumbnails.w160}}
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
