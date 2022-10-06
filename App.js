import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={[styles.container]}>
      <MainProvider>
        <Navigator />
      </MainProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
