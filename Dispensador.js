import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import BluetoothSerial from "react-native-bluetooth-serial-next";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";

export default class Dispensador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      raciones:5500,
      disable: false,
      comando: '',
      status: "🔄️ Actualizando estado...",
      connectionOptions: {
        DELIMITER: "9",
      },
      MAC_ADDRESS: ""
    };
    this.darComida = this.darComida.bind(this);
  }
  
  darComida = async () => {
    try {   
      const cadena = "1" + this.state.raciones.toString();
      await BluetoothSerial.write(cadena);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };
  pedirEstado = async () =>{
    try {   
      await BluetoothSerial.write("s");
      const data = await BluetoothSerial.readOnce("\r\n");
      console.log("Recibido: "+ data);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

  cargarMascota = async()=>{
    const uid =await AsyncStorage.getItem('@id');
    console.log("ui usuario: " + await AsyncStorage.getItem('@id'));
    fetch('http://192.168.166.81/dispensador/BuscarMascota.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: await AsyncStorage.getItem('@id'),
      })}).then((response) => response.json())
          .then((responseJson) => {
            console.log("Raciones"+ responseJson[0].raciones);
            this.setState({nombre: responseJson[0].nombre, raciones: parseInt(responseJson[0].raciones)
          });
          })
          .catch((error) => {
            ToastAndroid.show('Agregar mascota activado', ToastAndroid.SHORT);
          });
  }
  componentDidMount() {
      this.cargarMascota();
  }

  render() {
    const {navigate} = this.props.navigation;  
    return (
      <View style={styles.container}>

        <Text style={styles.titulo}>Dispensador PRO 5000</Text>
        <View
          style={{
            backgroundColor: "rgba(40, 110, 156,0.7)",
            position: "absolute",
            top: 180,
            left: 35,
            right: 35,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <View style={{display:'flex'}}>
            <Text>            <Ionicons
              name={"paw"}
              size={15}
              color={"white"}
              style={{ top: 0, left: 0 }}
            /> Alimentar a mi amigo {this.state.nombre}</Text>
          </View>
          <LottieView
          style={{
            width: "110%",
            height: 200,
            backgroundColor: "#00A4D6",
          }}
          speed={1}
          autoPlay
          loop={true}
          source={require("./recursos/collie.json")}
        />
          
        </View>
        <TouchableOpacity
        onPress={()=>this.darComida()}
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            alignItems: "center",
            borderRadius: 15,
            position: "absolute",
            top: 500,
            left: 35,
            right: 35,
          }}
        >
          <Image
            style={{ width: 250, height: 250, borderRadius: 15 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2221/2221877.png",
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: "Roboto",
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            Dar alimento
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              paddingTop: 15,
              paddingBottom: 15,
              fontFamily: "Roboto",
            }}
          >
            Dispensador al: {this.state.status} %
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>this.pedirEstado()}
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            alignItems: "center",
            borderRadius: 15,
            position: "absolute",
            top: 500,
            left: 35,
            right: 35,
          }}
        >

          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: "Roboto",
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            Actualizar estado
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9232DB",
  },
  mail: {
    width: Dimensions.get("window").width - 55,
    height: 40,
    borderRadius: 30,
    borderColor: "rgba(255,255,255,1.0)",
    fontSize: 18,
    paddingLeft: 75,

    backgroundColor: "rgba(0,0,0,0.0)",
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
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 15,
    position: "absolute",
    color: "#FFFFFF",
    textShadowColor: "#585858",
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 10,
    left: 35,
    fontSize: 50,
    top: 50,
    zIndex: 1,
    fontFamily: "sans-serif-thin",
  },
  imagen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
});
