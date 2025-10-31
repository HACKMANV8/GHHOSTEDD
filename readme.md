LoRa Receiver with ONNX Inference – Raspberry Pi 5
A lightweight setup for running a LoRa (RFM9x) receiver on Raspberry Pi 5 with real-time data processing through Random Forest ONNX models.

Overview
This project demonstrates how to receive LoRa sensor data on a Raspberry Pi 5 using Adafruit’s CircuitPython libraries, then process that data with ONNX models for environment classification and survival prediction.
The system:
1. Receives gas sensor values (MQ2, MQ7, MQ135) via LoRa.
2. Formats and sends them to ONNX models for prediction.
3. Outputs structured JSON logs of results.

Hardware Requirements
LoRa Pin	Raspberry Pi Pin	GPIO	Description
VCC	3.3V	—	Power
GND	GND	—	Ground
SCK	Pin 23	GPIO 11	SPI Clock
MOSI	Pin 19	GPIO 10	SPI MOSI
MISO	Pin 21	GPIO 9	SPI MISO
NSS / CS	Pin 29	GPIO 5	Chip Select
RESET	Pin 22	GPIO 25	Reset
DIO0 / IRQ	Pin 18	GPIO 24	Interrupt
Software Requirements
* Raspberry Pi OS (Bookworm)
* Python 3.13 or newer
* Virtual environment (recommended)
* Adafruit Blinka
* Adafruit CircuitPython RFM9x
* ONNX Runtime
* scikit-learn
* skl2onnx

Installation

sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-dev python3-lgpio swig gpiod
pip install --upgrade pip
pip install adafruit-blinka adafruit-circuitpython-rfm9x onnxruntime skl2onnx scikit-learn

Converting Random Forest Models to ONNX
Trained Random Forest models were exported from scikit-learn into ONNX for lightweight inference on Raspberry Pi.
1. Convert scikit-learn model to ONNX

import joblib
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Load trained Random Forest model
rf_model = joblib.load("env_status_model.pkl")

# Define input type (3 features: MQ2, MQ7, MQ135)
initial_type = [("float_input", FloatTensorType([None, 3]))]

# Convert and save ONNX model
onnx_model = convert_sklearn(rf_model, initial_types=initial_type)
with open("env_status_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
Repeat the same process for survival_timer_model.pkl if required.
2. Verify and Transfer Models

scp env_status_model.onnx survival_timer_model.onnx pi5@<raspberrypi_ip>:/home/pi5/

LoRa Receiver Script (receiver.py)

import board, busio, digitalio, adafruit_rfm9x, time

print("Starting LoRa Receiver...")

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
cs = digitalio.DigitalInOut(board.D7)
reset = digitalio.DigitalInOut(board.D25)

try:
    rfm9x = adafruit_rfm9x.RFM9x(spi, cs, reset, 915.0)
    print("LoRa Receiver ready. Listening for messages...")
except Exception as e:
    print("Error initializing LoRa module:", e)
    exit()

while True:
    packet = rfm9x.receive(timeout=5.0)
    if packet is not None:
        message = str(packet, "utf-8")
        print(f"Received: {message}")
    else:
        print("Waiting for messages...")
    time.sleep(1)

ONNX Inference Integration
The receiver data is processed and passed through two ONNX models for prediction.

import board, busio, digitalio, time, json, re
import numpy as np
import onnxruntime as ort
import adafruit_rfm9x

print("🚀 Starting LoRa Receiver...")

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
CS = digitalio.DigitalInOut(board.D5)
RESET = digitalio.DigitalInOut(board.D25)

rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 915.0)
print("✅ LoRa hardware initialized successfully!")

print("🧠 Loading ONNX models...")
model1 = ort.InferenceSession("/home/pi5/env_status_model.onnx")
model2 = ort.InferenceSession("/home/pi5/survival_timer_model.onnx")
input1 = model1.get_inputs()[0].name
input2 = model2.get_inputs()[0].name
print("✅ Models loaded successfully!")

def parse_lora_data(data):
    """Extract MQ sensor values in correct order"""
    match = re.findall(r"MQ-2[:=]\s*(\d+).*?MQ7[:=]\s*(\d+).*?MQ135[:=]\s*(\d+)", data, re.IGNORECASE)
    if not match:
        print("⚠️ Could not parse LoRa data:", data)
        return None
    vals = np.array([[float(x) for x in match[0]]], dtype=np.float32)
    print("📊 Parsed input:", vals)
    return vals

print("📡 Waiting for packets...")

while True:
    packet = rfm9x.receive(timeout=2.0)
    if packet:
        try:
            raw = packet.decode("utf-8").strip()
            print(f"\n📩 Received: {raw}")
            data = parse_lora_data(raw)
            if data is not None:
                out1 = model1.run(None, {input1: data})[0]
                out2 = model2.run(None, {input2: data})[0]
                result = {
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "input": raw,
                    "env_status": out1.tolist(),
                    "survival_prediction": out2.tolist()
                }
                print(json.dumps(result, indent=2))
                with open("/home/pi5/results.jsonl", "a") as f:
                    f.write(json.dumps(result) + "\n")
        except Exception as e:
            print("❌ Error processing packet:", e)
    else:
        print("⏳ Waiting for packets...")
    time.sleep(0.5)

Output Format
Each LoRa message is logged as a JSON line in results.jsonl:

{
  "timestamp": "2025-10-31 18:22:54",
  "input": "MQ-2:193, MQ7:82, MQ135:237",
  "env_status": ["Caution"],
  "survival_prediction": [6.4]
}
