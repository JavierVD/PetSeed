import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import AndroidOpenSettings from 'react-native-android-open-settings';
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";
import BluetoothSerial, { disable } from "react-native-bluetooth-serial-next";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      disable: true,
      status: "🔄️ Buscando dispositivo",
      foodlevel: "Vacío",
      connectionOptions: {
        DELIMITER: "9",
      },
      MAC_ADDRESS: "00:18:E4:40:00:06",
      bluetoothColor: "rgba(255,255,255,1.0)",
      estadoBT: "Bluetooth encendido",
    };
    this.deshabilitarBT = this.deshabilitarBT.bind(this);
  }

  connect = async () => {
    try {
      console.log("Conectando a HC-06");
      const device = await BluetoothSerial.connect(this.state.MAC_ADDRESS);
      const isConnected = await BluetoothSerial.isConnected();
      if (isConnected) {
        this.setState({ status: "🟢 Conectado" });
      }
      await BluetoothSerial.stopScanning();
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };
  continueDiscovery = async () =>{
    const isConnected = await BluetoothSerial.isConnected();
    this.setState({
      bluetoothColor: "rgba(27, 255, 20,1.0)",
      status: "🔄️ Buscando dispositivo...",
    });
    if (isConnected) {
      this.setState({ status: "🟢 Conectado" });
    } else {
      console.log("Buscando---");
      const devices = await BluetoothSerial.listUnpaired();
      devices.forEach((element) => {
        console.log(element.id);
        if (element.id == "00:18:E4:40:00:06") {
          this.setState({
            status: "🟡 Conectando...",
            MAC_ADDRESS: element.id,
          });
          console.log("get id " + this.state.MAC_ADDRESS);
          this.connect();
        }
      });
    }
  }

  startDiscovery = async () => {
    try {
      const isEnabled = await BluetoothSerial.isEnabled();
      console.log("show enable:" + isEnabled);
      if (isEnabled) {
        this.continueDiscovery();
      } else {
        this.setState({
          bluetoothColor: "rgba(255,255,255,1.0)",
          status: "🔴 Desconectado",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  leer= async()=>{
    fetch('http://192.168.166.81/dispensador/BuscarUsuario.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        id: AsyncStorage.getItem('@id'),
       
      })}).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson[0].id);
            this.setState({username: responseJson[0].username})
          }).then(()=> navigate("Mascota"))
          .catch((error) => {
            this.setState({
              loginError: 'El usuario no existe en nuestra base de datos'
            });
          });
  }

  componentDidMount() {
    this.subscription = RNBluetoothClassic.onDeviceDisconnected(
      this.onDeviceDisconnected
    );
    this.leer();
    this.connect();
  }

  deshabilitarBT = async () => {
    const isEnabled = await BluetoothSerial.isEnabled();
    console.log(isEnabled);
    if (isEnabled) {
      await BluetoothSerial.disable();
      this.setState({
        estadoBT: "Bluetooth apagado",
        bluetoothColor: "#FFFFFF",
        status: "🔴 Desconectado",
      });
    } else {
      await BluetoothSerial.enable();
      this.setState({
        estadoBT: "Bluetooth encendido",
        bluetoothColor: "rgba(27, 255, 20,1.0)",
      });
      this.continueDiscovery();
    }
  };
  render() {
    const {navigate} = this.props.navigation;  
    return (
      <View style={styles.container}>
        <Image
          style={styles.imagen}
          source={{
            uri: "https://images.wagwalkingweb.com/media/training_guides/say-hello/hero/How-to-Train-Your-Dog-to-Say-Hello.jpg",
          }}
        />
        <Text style={styles.titulo}>¡Bienvenido, {this.state.username}!</Text>
        <TouchableOpacity
          onPress={this.deshabilitarBT}
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
          <Ionicons
            name={"bluetooth-sharp"}
            size={28}
            color={this.state.bluetoothColor}
            style={{ top: 0, left: 0 }}
          />
          <Text style={{ color: this.state.bluetoothColor, fontSize: 18 }}>
            {this.state.estadoBT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> AndroidOpenSettings.bluetoothSettings()}
          style={{
            backgroundColor: "rgba(40, 110, 156,0.7)",
            position: "absolute",
            top: 240,
            left: 35,
            right: 35,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Ionicons
            name={"settings"}
            size={28}
            color={this.state.bluetoothColor}
            style={{ top: 0, left: 0 }}
          />
          <Text style={{ color: this.state.bluetoothColor, fontSize: 18 }}>
            Abrir Bluetooth en ajustes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        isEnabled={this.state.disable}
        onPress={()=>navigate("Dispensador")}
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            alignItems: "center",
            borderRadius: 15,
            position: "absolute",
            top: 300,
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
            Dispensador Modelo 1
          </Text>
          <Image
            style={{ width: 250, height: 250, borderRadius: 15 }}
            source={{
              uri: "https://http2.mlstatic.com/D_NQ_NP_882914-MLM32631290064_102019-O.webp",
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              paddingTop: 15,
              paddingBottom: 15,
              fontFamily: "Roboto",
            }}
          >
            Estado de la conexión: {this.state.status}
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
