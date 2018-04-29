#include <ESP8266WiFi.h>

const char* ssid = "Redmi";
const char* password = "12345678";

WiFiServer server(21);

char buf[1024];

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("\nConnecting to "); Serial.println(ssid);
  uint8_t i = 0;
  while (WiFi.status() != WL_CONNECTED && i++ < 20) delay(500);
  if(i == 21){
    Serial.print("Could not connect to"); 
    Serial.println(ssid);
    while(1) 
    delay(500);
  }
  
  server.begin();
  server.setNoDelay(true);
  Serial.print("Ready! IP: ");
  Serial.print(WiFi.localIP());
  Serial.println(":21");
}

int recv(WiFiClient client, char * buf, int bufLen)
{
  // Ожидаем данных, записываем их в buf
  // Возвращаем количество считаных байт
  // -1 if error

  while(!client.available()) // Ждем сообщения
  {
    if(!client.connected()) // Если клиент отключился - возвращаем ошибку
      return -1;
  }
  int iBuf = 0;
  while(client.available()) // пока в буфере есть сообщения
  {
    buf[iBuf] = client.read(); // Добавляем символ в буфер
    iBuf++;
    if(iBuf + 1 > bufLen) // Если привысили размер буфера - ошибка
      return -1;
  }
  buf[iBuf] = '\0';
  return iBuf;
}

void loop() {
  WiFiClient client = server.available(); // Проверяем очеред подключения
  if (client) { // Если подключился клиент, обрабатываем его
    
    Serial.println("New client connected");
    while (recv(client,buf,1024) >= 0) // Читаем сообщения, пока клиент не отсоединился
    {
      Serial.write(buf);
      client.write(buf);
    }
    Serial.println("Client disconnected");
    
  }
  
}
