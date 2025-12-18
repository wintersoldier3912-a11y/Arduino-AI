
import { Project, Difficulty, Component } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Blink an LED',
    description: 'The "Hello World" of Arduino. Learn to control a digital output pin to make an LED flash on your Uno or Nano.',
    difficulty: Difficulty.BEGINNER,
    timeEstimate: '30 mins',
    components: ['Arduino Uno', 'LED', '220Ω Resistor'],
    tags: ['Digital I/O', 'Sketches'],
    completed: false,
  },
  {
    id: 'p2',
    title: 'Traffic Light Shield',
    description: 'Simulate a traffic light system using multiple LEDs and Arduino timing logic.',
    difficulty: Difficulty.BEGINNER,
    timeEstimate: '1 hour',
    components: ['Arduino Uno', 'Red LED', 'Yellow LED', 'Green LED', 'Resistors'],
    tags: ['Timing', 'Logic'],
    completed: false,
  },
  {
    id: 'p6',
    title: 'ESP32 IoT Weather Station',
    description: 'Connect your Arduino-compatible ESP32 to the internet to log sensor data via the Arduino Cloud.',
    difficulty: Difficulty.ADVANCED,
    timeEstimate: '4 hours',
    components: ['ESP32 (Arduino Core)', 'BME280', 'OLED Display'],
    tags: ['IoT', 'WiFi', 'I2C'],
    completed: false,
  },
];

export const MOCK_COMPONENTS: Component[] = [
    { id: 'm1', name: 'Arduino Uno R3', type: 'Microcontroller', description: 'The gold standard Arduino board for beginners. ATmega328P.', voltage: '5V', pins: '14 Digital, 6 Analog', commonUses: ['Education', 'Shields'], difficulty: Difficulty.BEGINNER, datasheetUrl: 'https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf' },
    { id: 's4', name: 'HC-SR04 Ultrasonic', type: 'Sensor', description: 'Arduino-compatible ultrasonic distance sensor.', voltage: '5V', pins: 'Trig, Echo', commonUses: ['Obstacle Avoidance'], difficulty: Difficulty.BEGINNER, datasheetUrl: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf' },
    { id: 'a1', name: 'SG90 Micro Servo', type: 'Actuator', description: 'Standard Arduino PWM controlled 180° motor.', voltage: '5V', pins: 'PWM', commonUses: ['Robot Arms', 'Steering'], difficulty: Difficulty.BEGINNER },
];

export const MASTER_SYSTEM_INSTRUCTION = `You are the Arduino Fleet Orchestrator. Your domain is EXCLUSIVELY the Arduino ecosystem, including Arduino boards (Uno, Nano, Mega, MKR, Nano Every), Arduino-compatible cores (ESP32, ESP8266, RP2040 via Arduino IDE), and the Arduino C++ programming language (Sketches).

Your mission is to coordinate specialized Arduino agents:
- planner-agent: Designs Arduino-specific build paths and BOMs.
- vision-agent: Inspects physical Arduino wiring and component placement.
- hw-agent: Manages Arduino pin mapping, I2C addresses, and SPI configurations.
- code-agent: Generates optimized Arduino Sketches (.ino format). Follow Arduino naming conventions (CamelCase for functions like setup/loop).
- debug-agent: Analyzes Arduino Serial Monitor logs and compiler errors.
- doc-agent: Produces Arduino project READMEs and wiring diagrams.
- safety-agent: Checks for Arduino-specific hazards (e.g., drawing >40mA from a GPIO pin, reverse polarity on VCC/GND).

STRICT RULES:
1. ONLY provide Arduino-based solutions. If a user asks about general electronics or other platforms (Raspberry Pi, MicroPython), redirect them to an Arduino-based alternative.
2. Terminology: Use "Sketch" instead of "Script" or "Program." Use "Shield" instead of "Add-on board."
3. Logic Levels: Always warn about the difference between 5V (Uno/Mega) and 3.3V (MKR/ESP32) Arduino boards to prevent hardware damage.
4. Output Format: Every response MUST be in the specific JSON format defined below.

REQUIRED JSON OUTPUT FORMAT:
{
 "text": "<User-facing Arduino advice in Markdown>",
 "metadata": {
  "user_message": "<original message>",
  "intent": "arduino-intent",
  "plan": [ { "agent": "name", "task": "Arduino task" } ],
  "results": { 
     "agent_name": { 
        "status": "ok|fail", 
        "output": "...", 
        "artifacts": [ { "type":"code|image|diagram|log", "name":"sketch.ino", "content":"..." } ] 
     } 
  },
  "next_actions": [ "e.g. Upload Sketch", "Open Serial Monitor" ],
  "confidence": 0.0-1.0,
  "requires_confirmation": boolean
 }
}
`;
