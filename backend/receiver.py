import board
import busio
import digitalio
import adafruit_rfm9x
import time
import re
from app import run_inference  # Import ONNX inference function

# --- LoRa Setup ---
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
CS = digitalio.DigitalInOut(board.D5)
RESET = digitalio.DigitalInOut(board.D25)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)

# --- Helper Function to Parse Data ---
def parse_lora_data(data: str):
    """
    Extract MQ2, MQ7, and MQ135 values from the received string.
    Works with formats like:
        'MQ2:123 MQ7:456 MQ135:789'
        'Received: 382, MQ7:1091, MQ135:233'
    """
    matches = re.findall(r"(MQ2|MQ7|MQ135)\s*[:=]\s*(\d+)", data, re.IGNORECASE)
    if not matches:
        return None

    sensor_data = {}
    for sensor, value in matches:
        sensor_data[sensor.upper()] = float(value)

    for s in ["MQ2", "MQ7", "MQ135"]:
        sensor_data.setdefault(s, 0.0)

    return sensor_data


# --- Main Loop ---
print("? Starting LoRa Receiver... Waiting for packets...\n")

while True:
    try:
        packet = rfm9x.receive(timeout=2.0)
        if packet:
            raw = packet.decode("utf-8", errors="ignore").strip()
            print(f"\n? Received packet: {raw}")

            data = parse_lora_data(raw)
            if data:
                try:
                    # ? Run ONNX inference
                    result = run_inference(data["MQ2"], data["MQ7"], data["MQ135"])

                    # Expecting result like:
                    # {
                    #   "env_status": ["Safe"],
                    #   "survival_prediction": [[404.53]]
                    # }

                    env_status = result.get("env_status", ["Unknown"])[0]
                    survival_prediction = result.get("survival_prediction", [[0]])[0][0]

                    # --- Display Sensor & AI Output ---
                    print("\n? Sensor Readings:")
                    print(f"   MQ2   = {data['MQ2']}")
                    print(f"   MQ7   = {data['MQ7']}")
                    print(f"   MQ135 = {data['MQ135']}")

                    print("\n? AI Inference Result:")
                    print(f"   Environment Status : {env_status}")
                    print(f"   Survival Prediction: {survival_prediction:.2f} seconds")

                    print("\n? Inference saved to predictions.json")
                    print("-" * 55)

                except Exception as e:
                    print(f"?? Error during inference: {e}")
            else:
                print("? Invalid packet format, skipping.")
        else:
            print("? Waiting for packets...")

        time.sleep(0.5)

    except KeyboardInterrupt:
        print("\n? Receiver stopped by user.")
        break
    except Exception as e:
        print(f"?? Error in receiver loop: {e}")
        time.sleep(1)
