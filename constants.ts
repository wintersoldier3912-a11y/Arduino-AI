
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
    // --- Microcontrollers ---
    { id: 'm1', name: 'Arduino Uno R3', type: 'Microcontroller', description: 'The standard board for beginners. ATmega328P.', voltage: '5V', pins: '14 Digital, 6 Analog', commonUses: ['Education', 'Prototyping'], difficulty: Difficulty.BEGINNER },
    { id: 'm2', name: 'Arduino Nano', type: 'Microcontroller', description: 'Breadboard-friendly version of the Uno.', voltage: '5V', pins: '14 Digital, 8 Analog', commonUses: ['Compact Projects'], difficulty: Difficulty.BEGINNER },
    { id: 'm3', name: 'Arduino Mega 2560', type: 'Microcontroller', description: 'More pins and memory for large projects.', voltage: '5V', pins: '54 Digital, 16 Analog', commonUses: ['3D Printers', 'Complex Robotics'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'm4', name: 'ESP32 Dev Module', type: 'Microcontroller', description: 'Powerful dual-core with WiFi & Bluetooth.', voltage: '3.3V', pins: '30+ GPIO (Touch, DAC)', commonUses: ['IoT', 'Audio Streaming', 'Cameras'], difficulty: Difficulty.ADVANCED },
    { id: 'm5', name: 'ESP8266 NodeMCU', type: 'Microcontroller', description: 'Low cost WiFi-enabled microcontroller.', voltage: '3.3V', pins: '16 GPIO', commonUses: ['Basic IoT', 'Web Servers'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'm6', name: 'Raspberry Pi Pico', type: 'Microcontroller', description: 'RP2040 Dual Core ARM Cortex-M0+.', voltage: '3.3V', pins: '26 GPIO', commonUses: ['MicroPython', 'High Performance'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'm7', name: 'STM32 "Blue Pill"', type: 'Microcontroller', description: 'STM32F103C8T6 ARM Cortex-M3.', voltage: '3.3V', pins: '32 GPIO', commonUses: ['High Speed Processing'], difficulty: Difficulty.ADVANCED },
    { id: 'm8', name: 'Teensy 4.0', type: 'Microcontroller', description: '600MHz ARM Cortex-M7 powerhouse.', voltage: '3.3V', pins: '40 Pins', commonUses: ['Audio Synthesis', 'High Speed'], difficulty: Difficulty.EXPERT },

    // --- Sensors ---
    { id: 's1', name: 'DHT11', type: 'Sensor', description: 'Basic digital temperature and humidity sensor.', voltage: '3-5V', pins: 'VCC, DATA, GND', commonUses: ['Weather'], difficulty: Difficulty.BEGINNER },
    { id: 's2', name: 'DHT22', type: 'Sensor', description: 'More accurate digital temp/humidity sensor.', voltage: '3-5V', pins: 'VCC, DATA, NC, GND', commonUses: ['Precision Weather'], difficulty: Difficulty.BEGINNER },
    { id: 's3', name: 'BME280', type: 'Sensor', description: 'Temperature, Humidity, and Barometric Pressure.', voltage: '3.3V', pins: 'I2C/SPI', commonUses: ['Altimeter', 'Weather Station'], difficulty: Difficulty.INTERMEDIATE },
    { id: 's4', name: 'HC-SR04', type: 'Sensor', description: 'Ultrasonic distance sensor (Sonar).', voltage: '5V', pins: 'Trig, Echo', commonUses: ['Obstacle Avoidance'], difficulty: Difficulty.BEGINNER },
    { id: 's5', name: 'MPU-6050', type: 'Sensor', description: '6-axis Gyroscope and Accelerometer.', voltage: '3.3-5V', pins: 'I2C', commonUses: ['Drones', 'Balance Bots', 'VR'], difficulty: Difficulty.ADVANCED },
    { id: 's6', name: 'PIR Motion Sensor', type: 'Sensor', description: 'Passive Infrared sensor for detecting motion.', voltage: '5V', pins: 'Digital Out', commonUses: ['Security Alarms', 'Auto Lights'], difficulty: Difficulty.BEGINNER },
    { id: 's7', name: 'LDR (Photoresistor)', type: 'Sensor', description: 'Light dependent resistor.', voltage: 'Passive', pins: '2 Pins', commonUses: ['Night Lights', 'Lux Meter'], difficulty: Difficulty.BEGINNER },
    { id: 's8', name: 'MQ-2 Gas Sensor', type: 'Sensor', description: 'Detects Smoke, LPG, Propane, Hydrogen.', voltage: '5V', pins: 'Analog/Digital', commonUses: ['Gas Leak Alarm'], difficulty: Difficulty.INTERMEDIATE },
    { id: 's9', name: 'Soil Moisture Sensor', type: 'Sensor', description: 'Measures soil water content.', voltage: '3.3-5V', pins: 'Analog', commonUses: ['Smart Garden'], difficulty: Difficulty.BEGINNER },
    { id: 's10', name: 'VL53L0X', type: 'Sensor', description: 'Time-of-flight laser distance sensor.', voltage: '3.3V', pins: 'I2C', commonUses: ['Precision Measurement'], difficulty: Difficulty.ADVANCED },
    { id: 's11', name: 'DS18B20', type: 'Sensor', description: 'Waterproof digital temperature probe.', voltage: '3-5V', pins: '1-Wire Protocol', commonUses: ['Aquariums', 'Liquids'], difficulty: Difficulty.INTERMEDIATE },
    { id: 's12', name: 'HX711 Load Cell Amp', type: 'Sensor', description: 'ADC for weight scales.', voltage: '2.6-5.5V', pins: 'Data, Clock', commonUses: ['Digital Scales'], difficulty: Difficulty.ADVANCED },
    { id: 's13', name: 'TCS3200', type: 'Sensor', description: 'RGB Color Sensor.', voltage: '5V', pins: 'Freq Out', commonUses: ['Color Sorting'], difficulty: Difficulty.INTERMEDIATE },
    { id: 's14', name: 'Rotary Encoder', type: 'Sensor', description: 'Infinite rotation input knob.', voltage: '5V', pins: 'CLK, DT, SW', commonUses: ['Menu Navigation'], difficulty: Difficulty.INTERMEDIATE },

    // --- Actuators ---
    { id: 'a1', name: 'SG90 Micro Servo', type: 'Actuator', description: 'Small 180° positional motor.', voltage: '5V', pins: 'PWM', commonUses: ['Robot Arms', 'Small Mechanisms'], difficulty: Difficulty.BEGINNER },
    { id: 'a2', name: 'MG996R Servo', type: 'Actuator', description: 'High torque metal gear servo.', voltage: '5-6V', pins: 'PWM', commonUses: ['RC Cars', 'Heavy Duty Robotics'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'a3', name: '28BYJ-48 Stepper', type: 'Actuator', description: 'Geared stepper motor (usually with ULN2003).', voltage: '5V', pins: '4 Phase', commonUses: ['Precision Movement'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'a4', name: 'NEMA 17 Stepper', type: 'Actuator', description: 'Bipolar stepper for CNC/3D Printing.', voltage: '12-24V', pins: '4 Wire (Coils)', commonUses: ['3D Printers', 'CNC'], difficulty: Difficulty.ADVANCED },
    { id: 'a5', name: 'DC Gear Motor', type: 'Actuator', description: 'Standard DC motor with yellow gearbox.', voltage: '3-12V', pins: '2 Wire', commonUses: ['Robot Wheels'], difficulty: Difficulty.BEGINNER },
    { id: 'a6', name: 'Relay Module (1-CH)', type: 'Actuator', description: 'Electromechanical switch for high voltage.', voltage: '5V Logic', pins: 'Digital In', commonUses: ['Home Automation', 'AC Control'], difficulty: Difficulty.BEGINNER },
    { id: 'a7', name: 'Solenoid Valve', type: 'Actuator', description: 'Electrically controlled water valve.', voltage: '12V', pins: '2 Wire', commonUses: ['Irrigation'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'a8', name: 'Piezo Buzzer', type: 'Actuator', description: 'Simple sound generator.', voltage: '5V', pins: '2 Pins', commonUses: ['Alarms', 'Melodies'], difficulty: Difficulty.BEGINNER },

    // --- Displays ---
    { id: 'd1', name: '16x2 LCD (I2C)', type: 'Display', description: 'Basic alphanumeric character display.', voltage: '5V', pins: 'I2C (SDA/SCL)', commonUses: ['Text Output'], difficulty: Difficulty.BEGINNER },
    { id: 'd2', name: '0.96" OLED', type: 'Display', description: 'Sharp 128x64 monochrome display.', voltage: '3.3V', pins: 'I2C', commonUses: ['Menus', 'Graphics'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'd3', name: 'MAX7219 Dot Matrix', type: 'Display', description: '8x8 Red LED Grid.', voltage: '5V', pins: 'SPI-like', commonUses: ['Scrolling Text', 'Games'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'd4', name: 'TM1637 7-Segment', type: 'Display', description: '4-digit clock style display.', voltage: '5V', pins: 'CLK, DIO', commonUses: ['Timers', 'Clocks'], difficulty: Difficulty.BEGINNER },
    { id: 'd5', name: '2.4" TFT Shield', type: 'Display', description: 'Color touchscreen shield for Uno.', voltage: '5V', pins: 'Shield (Many)', commonUses: ['GUIs', 'Images'], difficulty: Difficulty.ADVANCED },

    // --- Communication ---
    { id: 'cm1', name: 'HC-05 Bluetooth', type: 'Communication', description: 'Bluetooth Classic Serial module.', voltage: '5V', pins: 'UART (RX/TX)', commonUses: ['Phone Control'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'cm2', name: 'NRF24L01+', type: 'Communication', description: '2.4GHz RF transceiver.', voltage: '3.3V', pins: 'SPI', commonUses: ['Remote Control', 'Mesh Nets'], difficulty: Difficulty.ADVANCED },
    { id: 'cm3', name: 'SIM800L GSM', type: 'Communication', description: 'Cellular network module (2G).', voltage: '3.7-4.2V (High Current)', pins: 'UART', commonUses: ['SMS', 'Data logging'], difficulty: Difficulty.EXPERT },
    { id: 'cm4', name: 'LoRa SX1278', type: 'Communication', description: 'Long range, low power RF.', voltage: '3.3V', pins: 'SPI', commonUses: ['Long Range Telemetry'], difficulty: Difficulty.EXPERT },
    { id: 'cm5', name: 'MCP2515 CAN Bus', type: 'Communication', description: 'Vehicle bus interface.', voltage: '5V', pins: 'SPI', commonUses: ['Car Hacking'], difficulty: Difficulty.ADVANCED },

    // --- Drivers & ICs ---
    { id: 'ic1', name: 'L298N Driver', type: 'Driver', description: 'Dual H-Bridge for DC motors/Steppers.', voltage: 'Up to 35V', pins: 'IN1-4, EN, OUT', commonUses: ['Motor Control'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'ic2', name: 'A4988 Stepper Driver', type: 'Driver', description: 'Compact microstepping driver.', voltage: '8-35V Motor', pins: 'Step/Dir', commonUses: ['3D Printers'], difficulty: Difficulty.ADVANCED },
    { id: 'ic3', name: '74HC595 Shift Register', type: 'IC', description: 'Serial in, Parallel out. Expands outputs.', voltage: '5V', pins: 'Latch, Clock, Data', commonUses: ['More LEDs/LCDs'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'ic4', name: 'PCF8574 IO Expander', type: 'IC', description: 'I2C to 8-bit parallel converter.', voltage: '3.3-5V', pins: 'I2C', commonUses: ['LCD Backpacks'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'ic5', name: 'DS3231 RTC', type: 'Module', description: 'High precision Real-Time Clock.', voltage: '3.3-5V', pins: 'I2C', commonUses: ['Timekeeping'], difficulty: Difficulty.BEGINNER },
    { id: 'ic6', name: 'Logic Level Converter', type: 'Module', description: 'Bidirectional 3.3V <-> 5V conversion.', voltage: 'HV/LV', pins: '4 channels', commonUses: ['Sensor Interfacing'], difficulty: Difficulty.INTERMEDIATE },

    // --- Power & Basic Components ---
    { id: 'b1', name: 'Breadboard', type: 'Basic', description: 'Solderless prototyping platform.', voltage: 'N/A', pins: 'Rows/Cols', commonUses: ['Prototyping'], difficulty: Difficulty.BEGINNER },
    { id: 'b2', name: 'Jumper Wires', type: 'Basic', description: 'M-M, M-F, F-F connecting cables.', voltage: 'N/A', pins: 'N/A', commonUses: ['Connections'], difficulty: Difficulty.BEGINNER },
    { id: 'b3', name: 'Resistor (Assorted)', type: 'Basic', description: 'Passive current limiters (220Ω, 1kΩ, 10kΩ).', voltage: 'Passive', pins: '2 Pins', commonUses: ['Current Limiting', 'Pull-ups'], difficulty: Difficulty.BEGINNER },
    { id: 'b4', name: 'LED (Generic)', type: 'Basic', description: 'Light Emitting Diode.', voltage: '2-3V drop', pins: 'Anode/Cathode', commonUses: ['Indicators'], difficulty: Difficulty.BEGINNER },
    { id: 'b5', name: 'LM2596 Buck Converter', type: 'Power', description: 'Step-down voltage regulator module.', voltage: 'Input > Output', pins: 'In/Out', commonUses: ['Power Supply'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'b6', name: 'Li-Po Battery (3.7V)', type: 'Power', description: 'Rechargeable lithium polymer cell.', voltage: '3.7V - 4.2V', pins: 'JST', commonUses: ['Portable Power'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'b7', name: 'TP4056 Charger', type: 'Power', description: 'Li-Ion/Li-Po battery charging module.', voltage: '5V In', pins: 'BAT+, BAT-', commonUses: ['Charging'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'b8', name: 'Tactile Push Button', type: 'Basic', description: 'Momentary switch.', voltage: 'Passive', pins: '4 Pins', commonUses: ['Input'], difficulty: Difficulty.BEGINNER },
    { id: 'b9', name: 'Potentiometer (10k)', type: 'Basic', description: 'Variable resistor / voltage divider.', voltage: 'Passive', pins: '3 Pins', commonUses: ['Analog Input'], difficulty: Difficulty.BEGINNER },
    { id: 'b10', name: 'MOSFET (IRFZ44N)', type: 'Basic', description: 'N-Channel Power MOSFET.', voltage: 'Gate 4V+', pins: 'G, D, S', commonUses: ['High Power Switching'], difficulty: Difficulty.INTERMEDIATE },
    { id: 'b11', name: 'Diode (1N4007)', type: 'Basic', description: 'Rectifier diode to block reverse current.', voltage: 'Passive', pins: 'Anode/Cathode', commonUses: ['Protection'], difficulty: Difficulty.BEGINNER }
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
