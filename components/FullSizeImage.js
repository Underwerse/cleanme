import {useState} from 'react';
import {Image} from 'react-native';
import {PropTypes} from 'prop-types';
import {Card} from '@rneui/themed';

const FullSizeImage = ({style, ...props}) => {
  const [ratio, setRatio] = useState(1);
  try {
    Image.getSize(
      props.source.uri,
      (width, height) => height && setRatio(width / height)
    );
  } catch (error) {
    console.error(error.message);
  }
  return (
    <Card.Image
      {...props}
      style={{
        width: '100%',
        height: undefined,
        aspectRatio: ratio,
        ...style,
      }}
    />
  );
};

FullSizeImage.propTypes = {
  style: PropTypes.object,
  source: PropTypes.object,
};

export default FullSizeImage;
