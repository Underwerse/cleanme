import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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
