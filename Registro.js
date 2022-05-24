import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import ErrorMessage  from "./ErrorMessage";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { render } from "react-dom";
export default class Registro extends React.Component {
  state = {
    initializing: true,
    ErrorRegistro: "",
    email: "",
    password: "",
    userName: "",
    name: "",
    id: "",
  };

  render() {
    const {navigate} = this.props.navigation;  

    const saveData =async ()=> {
      fetch('http://192.168.166.81/dispensador/AgregarUsuario.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
 
        nombre: this.state.name,
        username: this.state.userName,
        email: this.state.email,
        password: this.state.password
 
      })}).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            ToastAndroid.show('¡Registro exitoso!', ToastAndroid.SHORT);
          }).then(()=> navigate("Login"))
          .catch((error) => {
            console.error(error);
          });
    };
    const onHandleSignup = async () => {
      try {
        if (
          this.state.email !== "" &&
          this.state.password !== "" &&
          this.state.name !== "" &&
          this.state.userName !== ""
        ){
          saveData();
        } else {
          this.setState({
            ErrorRegistro: "¡Todos los campos deben ser llenados!",
          });
        }
      } catch (error) {
        if(error.message == 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).'){
          this.setState({
            ErrorRegistro: '¡Este correo ya está en uso!',
          });
        }
        if(error.message == 'Firebase: Password should be at least 6 characters (auth/weak-password).'){
          this.setState({
            ErrorRegistro: '¡La contraseña debe tener al menos 6 caracteres!',
          });
        }
        console.log(error.message);
      }
    };
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>REGISTRARSE</Text>
        <LottieView
          style={{
            width: "110%",
            height: 200,
            backgroundColor: "#c91897",
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
            backgroundColor: "#c91897",
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
              name={"body"}
              size={28}
              color={"rgba(255,255,255,0.7)"}
              style={{ top: 35, left: 35 }}
            />
            <TextInput
              style={styles.mail}
              placeholder={"Nombre de usuario"}
              onChangeText={(text) => this.setState({ userName: text })}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
            />
          </View>
          <View>
            <Ionicons
              name={"create-outline"}
              size={28}
              color={"rgba(255,255,255,0.7)"}
              style={{ top: 15, left: 35 }}
            />
            <TextInput
              style={styles.pass}
              placeholder={"Nombre completo"}
              onChangeText={(text) => this.setState({ name: text })}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
            />
          </View>
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
              textContentType="emailAddress"
              keyboardType="email-address"
              onChangeText={(text) => this.setState({ email: text })}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
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
              style={[styles.mail, {top: -20}]}
              placeholder={"Contraseña"}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              underlineColorAndroid={"rgba(255,255,255,0.0)"}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.botonInicio}
              onPress={onHandleSignup}
            >
              <Text style={{ color: "white" }}>Crear mi cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style ={{top: 0}}>
          {this.state.ErrorRegistro ? <ErrorMessage error={this.state.ErrorRegistro} visible={true} /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c91897",
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
