#include <SoftwareSerial.h>   // Incluimos la librería  SoftwareSerial  
SoftwareSerial BT(11,10);    // Definimos los pines RX y TX del Arduino conectados al Bluetooth
#include <Servo.h>
Servo servoMotor;
const byte Trigger = 13;   //Pin digital 2 para el Trigger del sensor
const byte Echo = 12;   //Pin digital 3 para el Echo del sensor
String cmd = "";

void setup()
{
  BT.begin(9600);       // Inicializamos el puerto serie BT que hemos creado
  Serial.begin(9600);   // Inicializamos  el puerto serie  
  servoMotor.attach(9);
  servoMotor.write(0);
  pinMode(Trigger, OUTPUT); //pin como salida
  pinMode(Echo, INPUT);  //pin como entrada
  digitalWrite(Trigger, LOW);//Inicializamos el pin con 0
}
 
void loop()
{
  if(BT.available())    // Si llega un dato por el puerto BT se envía al monitor serial
  {
    while(BT.available()>0){
      char inChar = (char)BT.read(); 
      cmd +=inChar;
    }
    if(cmd!=""){
      if(cmd!="s"){
          int temp = cmd.toInt();
          Serial.println(cmd);
          servoMotor.write(180);
          delay(temp);
          servoMotor.write(0);     
          delay(temp);
      }else {
          long t; //timepo que demora en llegar el eco
          long r; //distancia en centimetros
        
          digitalWrite(Trigger, HIGH);
          delayMicroseconds(100);          //Enviamos un pulso de 10us
          digitalWrite(Trigger, LOW);
          
          t = pulseIn(Echo, HIGH); //obtenemos el ancho del pulso
          r = t/59;             //escalamos el tiempo a una distancia en cm
          int d = r;
          Serial.print("Distancia: ");
          if(d >= 20 && d <=22){
            Serial.println("0");
            BT.write("0%");
          }
            
          if(d > 20 && d <=15){
            Serial.println("25");
            BT.write("25%");
          }

          if(d > 15 && d <=10){
            Serial.println("50");
            BT.write("50%");
          }
            
          if(d > 10 && d <=5){
              BT.write("75%");
              Serial.println("75");
          }

          if(d > 24){
            Serial.println("100");
            BT.write("100%");
          }
            
          Serial.print(r);
          Serial.print("cm");
          Serial.println();
          delay(100);          //Hacemos una pausa de 100ms
          
      }
    }
      cmd=""; //reset cmd
  }
}
