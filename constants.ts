
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
    { id: 'm1', name: 'Arduino Uno R3', type: 'Microcontroller', description: 'The standard board for beginners. ATmega328P.', voltage: '5V', pins: '14 Digital, 6 Analog', commonUses: ['Education', 'Prototyping'], difficulty: Difficulty.BEGINNER, datasheetUrl: 'https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf' },
    { id: 's4', name: 'HC-SR04', type: 'Sensor', description: 'Ultrasonic distance sensor (Sonar).', voltage: '5V', pins: 'Trig, Echo', commonUses: ['Obstacle Avoidance'], difficulty: Difficulty.BEGINNER, datasheetUrl: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf' },
    { id: 'a1', name: 'SG90 Micro Servo', type: 'Actuator', description: 'Small 180° positional motor.', voltage: '5V', pins: 'PWM', commonUses: ['Robot Arms', 'Small Mechanisms'], difficulty: Difficulty.BEGINNER },
];

export const MASTER_SYSTEM_INSTRUCTION = `You are a multi-agent orchestration master for Arduino projects. You design, run and coordinate a collection of specialized AI agents:
- planner-agent: Breaks user goals into prioritized sub-tasks.
- vision-agent: Analyzes camera frames to detect components and wiring.
- code-agent: Generates compact, tested Arduino C++ code.
- hardware-agent: Interfaces with microcontroller serial logs and telemetry.
- debug-agent: Isolates root causes (hardware vs code) from logs.
- safety-agent: Evaluates physical safety risks (voltage, current, hazards).
- procure-agent: Normalizes BOM and suggests parts.
- ux-agent: Translates technical outputs into step-by-step tutorials.
- doc-agent: Produces README, QuickStart, and FAQs.

REQUIRED JSON OUTPUT FORMAT:
You MUST return a JSON object containing the user-facing text and the orchestration metadata.
Example:
{
 "text": "I have created a plan for your LED project...",
 "metadata": {
  "user_message": "Build a blink project",
  "intent": "project-init",
  "plan": [ { "agent": "planner-agent", "task": "Create build steps" }, { "agent": "code-agent", "task": "Write blink code" } ],
  "results": { 
     "planner-agent": { "status": "ok", "output": "Plan created." },
     "code-agent": { "status": "ok", "output": "Code written.", "artifacts": [{"type":"code", "name":"blink.ino", "content":"void setup()..."}] }
  },
  "next_actions": ["Review code", "Connect LED"],
  "confidence": 0.95,
  "requires_confirmation": false
 }
}

RULES:
- Always check with safety-agent for hazardous operations.
- Require 'CONFIRM ACTUATE' phrase before flashing or high-power steps.
- If user input is 'CONFIRM ACTUATE', proceed with the queued hardware action.
- Use low temperature for code/debug, high for tutorials.
`;
