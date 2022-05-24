import { StatusBar } from "expo-status-bar";
import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ErrorMessage from './ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends React.Component {
  state={
    email: 'crashding@gmail.com',
    password: 'qwerty',
    loginError: '',
  };
  render(){


    const {navigate} = this.props.navigation;    
    const onLogin = async () => {
      try {
        if (this.state.email !== '' && this.state.password !== '') {
          fetch('http://192.168.100.20/dispensador/Login.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
      
              email: this.state.email,
              password: this.state.password
       
            })}).then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson[0].id);
                  AsyncStorage.setItem('@id', responseJson[0].id);
                  ToastAndroid.show('¡Bienvenido!', ToastAndroid.SHORT);
                }).then(()=> navigate("Mascota"))
                .catch((error) => {
                  this.setState({
                    loginError: 'El usuario no existe en nuestra base de datos'
                  });
                });
        }else{
          this.setState({
            loginError: '¡Debes llenar todos los campos!'
          });
        }
      } catch (error) {
        if(error.message == 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).')
          this.setState({
            loginError: 'El usuario no existe en nuestra base de datos'
          });
        console.log(error.message);
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>INICIAR SESIÓN</Text>
        <LottieView
          style={{
            width: "110%",
            height: 200,
            backgroundColor: "#00A4D6",
          }}
          speed={1}
          autoPlay
          loop={true}
          source={require("./recursos/nubes.json")}
        />
        <LottieView
          style={{
            width: 400,
            height: 100,
            backgroundColor: "#00A4D6",
          }}
          speed={1}
          autoPlay
          loop={true}
          source={require("./recursos/perro.json")}
        />
        <StatusBar style="auto" />
        <View>
          <View>
            <Ionicons
              name={"mail"}
              size={28}
              color={"rgba(255,255,255,0.7)"}
              style={{ top: 35, left: 35 }}
            />
            <TextInput
              style={styles.mail}
              placeholder={"Correo electrónico"}
              textContentType='emailAddress'
              keyboardType='email-address'
              value={this.state.email}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
              onChangeText={text => this.setState({email: text,})}
            />
          </View>
          <View>
            <Ionicons
              name={"key"}
              size={28}

              color={"rgba(255,255,255,0.7)"}
              style={{ top: 15, left: 35 }}
            />
            <TextInput
              style={styles.pass}
              placeholder={"Contraseña"}
              textContentType ={'password'}
              value ={this.state.password}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              onChangeText={text => this.setState({password: text,})}
              secureTextEntry={true}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.botonInicio}
              onPress={onLogin}>
              <Text style={{ color: "white" }}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.botonRegistrarse}
              onPress={() => navigate("Registro")}>
              <Text style={{ color: "white" }}>Registrarme</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        <View style ={{top: 200}}>
          {this.state.loginError ? <ErrorMessage error={this.state.loginError} visible={true} /> : null}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A4D6",
    alignItems: "center",
  },
  mail: {
    width: Dimensions.get("window").width - 55,
    height: 40,
    borderRadius: 30,
    borderColor: "rgba(255,255,255,1.0)",
    fontSize: 18,
    paddingLeft: 45,

    backgroundColor: "rgba(0,0,0,0.1)",
    color: "rgba(255,255,255,0.7)",
    marginHorizontal: 25,
  },
  botonInicio: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    width: Dimensions.get("window").width - 55,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    borderRadius: 30,
    top: 30,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  botonRegistrarse: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    width: Dimensions.get("window").width - 55,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    borderRadius: 30,
    top: 85,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  pass: {
    position: "absolute",
    width: Dimensions.get("window").width - 55,
    borderRadius: 30,
    fontSize: 18,
    height: 40,
    top: 10,
    paddingLeft: 45,
    backgroundColor: "rgba(0,0,0,0.1)",
    color: "rgba(255,255,255,0.7)",
    marginHorizontal: 25,
  },
  titulo: {
    position: "absolute",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 50,
    top: 50,
    zIndex: 1,
    fontFamily: "sans-serif-thin",
  },
});
