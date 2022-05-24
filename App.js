import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Login';
import Registro from './Registro';
import Mascota from './Mascota';
import Panel from './Panel';
import Home from './Home';
import Dispensador from './Dispensador';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Mascota" component={Mascota} />
        <Stack.Screen name="Panel" component={Panel} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Dispensador" component={Dispensador} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
