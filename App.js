import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <Navigator></Navigator>
      </MainProvider>
    </SafeAreaProvider>
  );
};

export default App;
