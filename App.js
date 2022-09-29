import {StatusBar} from 'expo-status-bar';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import List from './components/List';

const App = () => {
  return (
    <>
      <SafeAreaView style={styles.droidSafeArea}>
        <List />
        <StatusBar style="auto" />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    paddingTop: Platform.OS === 'android' ? 45 : 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default App;
