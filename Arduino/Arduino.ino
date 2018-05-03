#include <ESP8266WiFi.h>


const char* ssid = "Redmi";
const char* password = "12345678";

int led = 2;  // d4
int led2 = 4; // d2
int ledOn = LOW;
int ledOff = HIGH;
int ledState = ledOff;
int ledState2 = ledOff;

WiFiServer server(21);

char buf[512];
int bufInt[128];

void setup() {
  pinMode(led, OUTPUT);
  pinMode(led2, OUTPUT);
  digitalWrite(led, ledState);
  digitalWrite(led2, ledState);
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("\nConnecting to "); Serial.println(ssid);
  uint8_t i = 0;
  while (WiFi.status() != WL_CONNECTED && i++ < 20) delay(500);
  if (i == 21) {
    Serial.print("Could not connect to");
    Serial.println(ssid);
    while (1)
      delay(500);
  }

  server.begin();
  server.setNoDelay(true);
  Serial.print("Ready! IP: ");
  Serial.print(WiFi.localIP());
  Serial.println(":21");
  int buf1[10];
  parse_str_in_int_array("[1,2,5,4]",500,buf1,10);
}

int recv(WiFiClient client, char * buf, int bufLen)
{
  // Ожидаем данных, записываем их в buf
  // Возвращаем количество считаных байт
  // -1 if error

  while (!client.available()) // Ждем сообщения
  {
    if (!client.connected()) // Если клиент отключился - возвращаем ошибку
      return -1;
  }
  int iBuf = 0;
  while (client.available()) // пока в буфере есть сообщения
  {
    buf[iBuf] = client.read(); // Добавляем символ в буфер
    iBuf++;
    if (iBuf + 1 > bufLen) // Если привысили размер буфера - ошибка
      return -1;
  }
  buf[iBuf] = '\0';
  return iBuf;
}

int parse_str_in_int_array(char * arrIn, int maxLenIn, int * arrOut, int maxLenOut)
{ // Парсит массив вида [7,-6,14] в массив int * arrOut
  // возвращает кол-во элементов
  char * pointer = arrIn; // Указатель, которым ходим по arrIn
  int iPointer = 0; // Индекс элемента указателя
  int iOutArray = 0; // Индекс крайнего элемента выходного массива

  bool isAlreadyFindNumber = false; // true если мы уже встретили число после последнего разделителя

  while (*pointer != '\0') // Идем указателем Пока не дошли до конца строки 
  {
    char c = *pointer; // Текущий символ
    if (c != '[' && c != ']' && c != ',') // Если pointer указывает на число...
    {
      if (!isAlreadyFindNumber) // Которое еще не считали
      {
        if (iOutArray >= maxLenOut) // Если привысили размер выходного массива
          return -1; // Возвращаем ошибку

        int buf = 0;
        sscanf(pointer, "%d", &buf); // Считываем очередное число
        arrOut[iOutArray] = buf;
        iOutArray++;

        isAlreadyFindNumber = true;
      }
    }
    else // Если указывает не на число
    {
      isAlreadyFindNumber = false; // Говорим, что встретили разделитель
    }

    pointer++;
    iPointer++;

    if (iPointer >= maxLenIn) // Если зашли за границы
      return -1; // Возвращаем ошибочное значение
  }
  for (int i = 0; i < iOutArray; i++)
  {
    Serial.println(arrOut[i]);
  }
  return iOutArray; // Возвращаем количество считанных чисел
}


int c0(char *outputMsg)
{
  sprintf(outputMsg,"[%d]",ledState == ledOn ? 1 : 0);
  return 0;
        
}
int c1(int nElems, int * bufInt, char * outputMsg)
{
  if(nElems != 2)
        return -1;
      int newState = bufInt[1];
      if(newState == 1)
      { 
        ledState = ledOn;
      }  else if(newState == 0)
      {
        ledState = ledOff;
      } else return -1;
      digitalWrite(led, ledState);
      outputMsg[0] = '\0';
  
      sprintf(outputMsg,"[%d]",ledState == ledOn ? 1 : 0);  
      return 0;
}

int process_msg(char * inputMsg, int inputMsgMaxLen, char * outputMsg, int outputMsgMaxLen)
{
  // return 0 если все хорошо
  int nElems = parse_str_in_int_array(inputMsg, inputMsgMaxLen, bufInt, 128);
  if(nElems <= 0)
    return -1;
  int idAction = bufInt[0];
  switch(idAction)
  {
    case 0:
      //sprintf(outputMsg,"[%d]",ledState == ledOn ? 1 : 0);
      return c0(outputMsg);
      break;
    case 1:
      return c1(nElems, bufInt, outputMsg);
      break;
      
    case 2:
      sprintf(outputMsg,"[%d]",ledState2 == ledOn ? 1 : 0);
      break;
      
    case 3:
      if(nElems != 2)
        return -1;
      int newState = bufInt[1];
      if(newState == 1)
      { 
        ledState2 = ledOn;
      }  else if(newState == 0)
      {
        ledState2 = ledOff;
      } else return -1;
      digitalWrite(led2, ledState2);
      outputMsg[0] = '\0';
  
      sprintf(outputMsg,"[%d]",ledState2 == ledOn ? 1 : 0);
      break;



      
  }
  return 0;
}

void loop() {
  //digitalWrite(led,ledOn);
  WiFiClient client = server.available(); // Проверяем очеред подключения
  if (client) { // Если подключился клиент, обрабатываем его
    //digitalWrite(led,ledOff);
    Serial.println("New client connected");
    while (recv(client, buf, 512) >= 0) // Читаем сообщения, пока клиент не отсоединился
    {
      if(!process_msg(buf, 512, buf, 512))
      {
        Serial.write(buf);
        client.write(buf);
      } else 
      {
        Serial.write("ERR");
        client.write("ERR");
      }
    }
    Serial.println("Client disconnected");

  }

}

