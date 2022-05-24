import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import RNPickerSelect from 'react-native-picker-select';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Mascota extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      peso: 3.0,
      guardar: true,
      raciones:250,
      uid: '',
      raza: 3,
      edad: 2,
      horario: [],
      actividad:25,
      razas: [
        { label: "Chihuahueño", value: 3 },
        { label: "Pug", value: 6 },
        { label: "Fox Terrier", value: 8 },
        { label: "Bulldog", value: 25 },
        { label: "Boxer", value: 35 },
        { label: "Rottweiler", value: 35 },
        { label: "Komondor", value: 45},
      ],
      actividades:[
        { label: "Sedentario", value: 23 },
        { label: "Normal", value: 25 },
        { label: "Deportista", value: 27 }
      ],
      edades: [
        { label: "2 a 6 meses", value: 6 },
        { label: "6 a 12 meses", value: 4 },
        { label: "> 12 meses", value: 2 }
      ]
    };
    this.guardar = this.guardar.bind(this);
    this.calcularRaciones = this.calcularRaciones.bind(this);
  }

  calcularRaciones=()=>{
    const final = (((this.state.peso*(this.state.actividad/100))/this.state.edad)*1000);
    console.log(final);
    this.setState({raciones: final});
  }
  buscarMascota= async ()=>{
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
            console.log(responseJson[0].nombre);
            this.setState({guardar: false});
            ToastAndroid.show('Editar mascota activado', ToastAndroid.SHORT);
            this.setState({nombre: responseJson[0].nombre, edad: parseInt(responseJson[0].edad),
            raza:  parseInt(responseJson[0].raza), actividad:  parseInt(responseJson[0].actividad), 
            peso: parseFloat(responseJson[0].peso), raciones: parseInt(responseJson[0].raciones)
          });
          })
          .catch((error) => {
            ToastAndroid.show('Agregar mascota activado', ToastAndroid.SHORT);
          });
  }
  guardar=()=>{
    console.log("uid: " + this.state.uid);
    const url = (this.state.guardar)? 'http://192.168.166.81/dispensador/AgregarMascota.php' : 'http://192.168.166.81/dispensador/EditarMascota.php';
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: this.state.nombre,
        edad: this.state.edad,
        raza: this.state.raza,
        peso: this.state.peso,
        raciones: this.state.raciones,
        actividad: this.state.actividad,
        id: this.state.uid
 
      })}).then((response) => response.json())
          .then((responseJson) => {

            ToastAndroid.show('¡Registro exitoso!', ToastAndroid.SHORT);
            navigate("Panel");
          }).then(()=> navigate("Login"))
          .catch((error) => {
            console.log(error);
          });
  }
  getUid = async () =>{
      const d=  await AsyncStorage.getItem('@id');
      this.setState({uid: await AsyncStorage.getItem('@id')})
  }

  componentDidMount() {
    this.getUid();

    console.log("uiuiu" + this.state.uid);
    this.calcularRaciones();
    this.buscarMascota();
  }

  render() {
    const {navigate} = this.props.navigation;  
    return (
      <View style={styles.container}>
        <Image
          style={styles.imagen}
          source={{
            uri: "https://img.freepik.com/vector-gratis/patron-perros-esbozados_23-2147514776.jpg",
          }}
        />
        <Text style={styles.titulo}>Mi mascota 🐕</Text>
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
          <TextInput
            placeholder="Nombre de mi mascota"
              style={styles.mail}
              value={this.state.nombre}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              onChangeText={text => this.setState({nombre: text})}
            />
        </View>
        <View style={{ color: 'white', fontSize: 15, backgroundColor: 'rgba(120,0,80,0.7)', position: "absolute",
            top: 230,
            left: 35,
            right: 35,
            borderRadius: 10,
            alignItems: "center",}}>
            <Text >
              Raza:        
            </Text>
            <RNPickerSelect
                value={this.state.raza}
                 onValueChange={(value) => {this.setState({raza: value, peso: value}), this.calcularRaciones()}}
                 items={this.state.razas}
             />
        </View>
        <View style={{ color: 'white', fontSize: 15, backgroundColor: 'rgba(10,230,10,0.7)', position: "absolute",
            top: 300,
            left: 35,
            right: 35,
            borderRadius: 10,
            alignItems: "center",}}>
            <Text style={{ color: 'white', fontSize: 15 }}>
              Edad:        
            </Text>
            <RNPickerSelect
            value={this.state.edad}
                 onValueChange={(value) => {this.setState({edad: value}), this.calcularRaciones()}}
                 items={this.state.edades}
             />
        </View>
        <View style={{ color: 'white', fontSize: 15, backgroundColor: 'rgba(250,200,0,0.7)', position: "absolute",
            top: 385,
            left: 35,
            right: 35,
            borderRadius: 10,
            alignItems: "center",}}>
            <Text style={{ color: 'white', fontSize: 15 }}>
              Actividad:        
            </Text>
            <RNPickerSelect
            value={this.state.actividad}
                 onValueChange={(value) => {this.setState({actividad: value}),  this.calcularRaciones()}}
                 items={this.state.actividades}
             />
        </View>
        <View>
          <View
            style={{
              backgroundColor: "rgba(20, 670, 206,0.7)",
              position: "absolute",
              top: 460,
              flex: 1,
              justifyContent: 'space-between',
              display: 'flex',
              paddingTop:10,
              paddingLeft: 20,
              left: 35,
              width: '40%',
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15 }}>
              Peso en kg:           
            </Text>
            <TextInput
                keyboardType={'numeric'}
                style={{textAlign:'center',backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, marginBottom:10,width: '50%'}}
                value={this.state.peso}
                step="0.01"
                placeholderTextColor={"rgba(255,255,255,1.0)"}
                onChangeText={text => this.setState({peso: text}, this.calcularRaciones())}
              />
          </View>
          <View
            style={{
              backgroundColor: "rgba(200, 60, 6,0.7)",
              position: "absolute",
              top: 460,
              flex: 1,
              justifyContent: 'space-between',
              display: 'flex',
              paddingTop:10,
              paddingLeft: 30,
              paddingBottom: 35,
              right: 35,
              width: '40%',
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15 }}>
              Raciones de: {this.state.raciones} ms.
            </Text>
          </View>
        </View>
        <View>
        <TouchableOpacity
        onPress={()=> this.guardar()}
            style={{

              backgroundColor: "yellow",
              position: "absolute",
              top: 540,

              paddingTop:10,
              paddingBottom:10,
              paddingLeft: 30,
              left: 35,
              right: 35,
              borderRadius: 10,
            }}
          >
                      <Text style={{            textAlign: 'center',
            fontSize: 18,}}>
            Guardar datos de mi mascota
          </Text>
          </TouchableOpacity>
        </View>
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
    marginHorizontal: 25
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
    borderRadius: 15,
    position: "absolute",
    color: "#000000",
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
