import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import Profile from '../views/Profile';
import SingleTask from '../views/SingleTask';
import Login from '../views/Login';
import AddTask from '../views/AddTask';
import MyTasks from '../views/MyTasks';
import ModifyTask from '../views/ModifyTask';
import OnboardingScreen from '../views/OnboardingScreen';
import {colorSchema} from '../utils/variables';
import MyFavorites from '../views/MyFavorites';
import ModifyUser from '../views/ModifyUser';
import AddButton from '../assets/add-btn_v2.svg';
import Styles from '../utils/Styles';
import {useLogin} from '../hooks/ApiHooks';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color}) => <Icon name="home" color={color} />,
            tabBarActiveTintColor: colorSchema.mainColor,
            bottomTab: {
              iconInsets: {top: 0, left: 0, bottom: 0, right: 0},
            },
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
          name="AddTask"
          component={AddTask}
          options={{
            tabBarItemStyle: {display: 'none'},
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
          name="ModifyUser"
          component={ModifyUser}
          options={{
            tabBarItemStyle: {display: 'none'},
          }}
        />
        <Tab.Screen
          name="ModifyTask"
          component={ModifyTask}
          options={{
            tabBarItemStyle: {display: 'none'},
          }}
        />
        <Tab.Screen
          name="SingleTask"
          component={SingleTask}
          options={{
            tabBarItemStyle: {display: 'none'},
          }}
        />
      </Tab.Navigator>
      <AddButton
        style={Styles.btnAddTask}
        height={'8%'}
        width={'16%'}
        onPress={() => {
          navigation.navigate('AddTask');
        }}
      />
    </>
  );
};

const StackScreen = ({navigation, isLoggedIn}) => {
  return (
    <Stack.Navigator navigation={navigation} isLoggedIn={isLoggedIn}>
      {isLoggedIn ? (
        <Stack.Screen
          name="Tabs"
          component={TabScreen}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{headerShown: false}}
          />
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
  const {checkToken} = useLogin();
  const {isLoggedIn} = useContext(MainContext);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <StackScreen isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

TabScreen.propTypes = {
  navigation: PropTypes.object,
};

StackScreen.propTypes = {
  navigation: PropTypes.object,
  isLoggedIn: PropTypes.bool,
};

export default Navigator;
