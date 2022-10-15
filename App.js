import {SafeAreaView} from 'react-native-safe-area-context';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <MainProvider>
        <Navigator />
      </MainProvider>
    </SafeAreaView>
  );
};

export default App;
