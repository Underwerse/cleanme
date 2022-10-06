import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {Icon} from '@rneui/themed';
import AddTask from '../views/AddTask';
import MyTasks from '../views/MyTasks';
import ModifyFile from '../views/ModifyFile';
import Modify from '../views/Modify';
import OnboardingScreen from '../views/OnboardingScreen';
import {colorSchema} from '../utils/variables';
import MyFavorites from '../views/MyFavorites';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" color={color} />,
          tabBarActiveTintColor: colorSchema.mainColor,
        }}
      />
      <Tab.Screen
        name="MyTasks"
        component={MyTasks}
        options={{
          tabBarIcon: ({color}) => <Icon name="fact-check" color={color} />,
          tabBarActiveTintColor: colorSchema.mainColor,
        }}
      />
      <Tab.Screen
        name="MyFavorites"
        component={MyFavorites}
        options={{
          tabBarIcon: ({color}) => <Icon name="favorite" color={color} />,
          tabBarActiveTintColor: colorSchema.mainColor,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color}) => <Icon name="person" color={color} />,
          tabBarActiveTintColor: colorSchema.mainColor,
        }}
      />
      <Tab.Screen
        name="AddTask"
        component={AddTask}
        options={{
          tabBarItemStyle: {display: 'none'},
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="MyTasks" component={MyTasks} />
          <Stack.Screen name="ModifyFile" component={ModifyFile} />
          <Stack.Screen name="Modify" component={Modify} />
          <Stack.Screen name="AddTask" component={AddTask} />
        </>
      ) : (
        <>
          {/* <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
