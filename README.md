LoRa Receiver – Raspberry Pi 5
A lightweight setup for running a LoRa (RFM9x) receiver on Raspberry Pi 5 using CircuitPython and SPI communication.

Overview
This project demonstrates receiving LoRa messages on a Raspberry Pi 5 using Adafruit’s CircuitPython libraries.It uses SPI communication and works with RFM9x / SX127x LoRa modules.

Hardware Requirements
* Raspberry Pi 5 (with SPI enabled)
* LoRa RFM9x or SX127x module
* Jumper wires

LoRa Pin	Raspberry Pi Pin	GPIO	Description
VCC	3.3 V	—	Power
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
* Virtual environment (optional)
* Adafruit Blinka
* Adafruit CircuitPython RFM9x
* SPI and GPIO enabled

Dependencies

sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-dev python3-lgpio swig gpiod
pip install --upgrade pip
pip install adafruit-blinka adafruit-circuitpython-rfm9x

Receiver Script (receiver.py)

import board
import busio
import digitalio
import adafruit_rfm9x
import time

print("Starting LoRa Receiver...")

# SPI configuration for Raspberry Pi 5
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)

# Pin configuration (adjust if wiring differs)
cs = digitalio.DigitalInOut(board.D7)     # CE1 (Chip Select)
reset = digitalio.DigitalInOut(board.D25) # Reset pin

# Initialize LoRa module at 915 MHz
try:
    rfm9x = adafruit_rfm9x.RFM9x(spi, cs, reset, 915.0)
    print("LoRa Receiver ready. Listening for messages...")
except Exception as e:
    print("Error initializing LoRa module:", e)
    exit()

# Main loop
while True:
    packet = rfm9x.receive(timeout=5.0)
    if packet is not None:
        message = str(packet, "utf-8")
        print(f"Received: {message}")
    else:
        print("Waiting for messages...")
    time.sleep(1)


