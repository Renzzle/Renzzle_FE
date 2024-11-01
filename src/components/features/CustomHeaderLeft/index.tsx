import React from 'react';
import { Image, StyleSheet } from 'react-native';

function CustomHeaderLeft() {
  return (
    <Image
      source={require('../../../assets/images/logo-small.png')}
      style={styles.headerImage}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
});

export default CustomHeaderLeft;
