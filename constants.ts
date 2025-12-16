import { Project, Difficulty, Component } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Blink an LED',
    description: 'The "Hello World" of Arduino. Learn to control a digital output pin to make an LED flash.',
    difficulty: Difficulty.BEGINNER,
    timeEstimate: '30 mins',
    components: ['Arduino Uno', 'LED', '220Ω Resistor'],
    tags: ['Digital I/O', 'Basics'],
    completed: false,
  },
  {
    id: 'p2',
    title: 'Traffic Light Controller',
    description: 'Simulate a traffic light system using multiple LEDs and timing logic.',
    difficulty: Difficulty.BEGINNER,
    timeEstimate: '1 hour',
    components: ['Arduino Uno', 'Red LED', 'Yellow LED', 'Green LED', 'Resistors'],
    tags: ['Timing', 'Logic'],
    completed: false,
  },
  {
    id: 'p3',
    title: 'Temperature Monitor',
    description: 'Read data from a DHT11/DHT22 sensor and print it to the Serial Monitor.',
    difficulty: Difficulty.BEGINNER,
    timeEstimate: '1.5 hours',
    components: ['Arduino Uno', 'DHT11 Sensor', 'Breadboard'],
    tags: ['Sensors', 'Serial Communication'],
    completed: false,
  },
  {
    id: 'p4',
    title: 'Distance Sensor Alarm',
    description: 'Use an ultrasonic sensor to detect objects and buzz an alarm if they get too close.',
    difficulty: Difficulty.INTERMEDIATE,
    timeEstimate: '2 hours',
    components: ['Arduino Uno', 'HC-SR04', 'Piezo Buzzer'],
    tags: ['Sensors', 'Sound'],
    completed: false,
  },
  {
    id: 'p5',
    title: 'Servo Motor Control',
    description: 'Control the position of a servo motor using a potentiometer.',
    difficulty: Difficulty.INTERMEDIATE,
    timeEstimate: '2 hours',
    components: ['Arduino Uno', 'Servo Motor', 'Potentiometer'],
    tags: ['Analog Input', 'PWM'],
    completed: false,
  },
  {
    id: 'p6',
    title: 'WiFi Weather Station',
    description: 'Connect your Arduino (ESP32/8266) to the internet to log weather data.',
    difficulty: Difficulty.ADVANCED,
    timeEstimate: '4 hours',
    components: ['ESP32', 'BME280', 'OLED Display'],
    tags: ['IoT', 'WiFi', 'I2C'],
    completed: false,
  },
];

export const MOCK_COMPONENTS: Component[] = [
  {
    id: 'c1',
    name: 'Arduino Uno R3',
    type: 'Microcontroller',
    description: 'The most popular board for beginners. Based on ATmega328P.',
    voltage: '5V (Input 7-12V)',
    pins: '14 Digital (6 PWM), 6 Analog',
    commonUses: ['Prototyping', 'Education', 'Basic Automation'],
    datasheetUrl: '#',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'c2',
    name: 'ESP32 Dev Module',
    type: 'Microcontroller',
    description: 'A powerful board with integrated WiFi and Bluetooth.',
    voltage: '3.3V',
    pins: '30+ GPIO (DAC, ADC, Touch)',
    commonUses: ['IoT', 'Web Servers', 'Bluetooth Audio'],
    datasheetUrl: '#',
    difficulty: Difficulty.ADVANCED
  },
  {
    id: 'c3',
    name: 'DHT22',
    type: 'Sensor',
    description: 'Digital temperature and humidity sensor. More accurate than DHT11.',
    voltage: '3.3V - 5V',
    pins: 'VCC, DATA, NC, GND',
    commonUses: ['Weather Stations', 'Environmental Monitoring'],
    datasheetUrl: '#',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'c4',
    name: 'HC-SR04',
    type: 'Sensor',
    description: 'Ultrasonic distance sensor using sonar.',
    voltage: '5V',
    pins: 'VCC, TRIG, ECHO, GND',
    commonUses: ['Obstacle Avoidance', 'Fluid Level Detection'],
    datasheetUrl: '#',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'c5',
    name: 'SG90 Micro Servo',
    type: 'Actuator',
    description: 'Tiny and lightweight servo motor with high output power.',
    voltage: '4.8V - 6V',
    pins: 'Signal (Orange), VCC (Red), GND (Brown)',
    commonUses: ['Robotic Arms', 'Camera Gimbals', 'RC Planes'],
    datasheetUrl: '#',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'c6',
    name: 'L298N Driver',
    type: 'Module',
    description: 'Dual H-Bridge motor driver for DC and stepper motors.',
    voltage: 'Logic 5V, Drive 5-35V',
    pins: 'ENA, IN1, IN2, IN3, IN4, ENB',
    commonUses: ['Car Robots', 'High Power Motor Control'],
    datasheetUrl: '#',
    difficulty: Difficulty.INTERMEDIATE
  }
];

export const SYSTEM_INSTRUCTION = `You are Arduino Mentor, an expert Arduino and embedded systems educator. 

Your role is to:
1. Explain Arduino concepts clearly, adapting to the user's skill level.
2. Guide users through hands-on projects with step-by-step instructions.
3. Help debug code and circuit issues.
4. Recommend appropriate learning paths and components.
5. Provide code examples that are well-commented and follow best practices (C++ for Arduino).

CONTEXT AWARENESS:
You will receive information about the user's skill level (Electronics, Programming, IoT).
- If the user is a BEGINNER in a topic, avoid jargon, explain "why" things work, and use analogies.
- If the user is ADVANCED, be concise, focus on optimization, datasheets, and best practices.

Format your responses using Markdown. Use code blocks for Arduino sketches.
Be encouraging and patient. 
`;