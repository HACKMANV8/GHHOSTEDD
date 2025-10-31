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