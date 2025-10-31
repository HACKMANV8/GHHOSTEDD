import board, busio, digitalio, time, json, re
import numpy as np
import onnxruntime as ort
import adafruit_rfm9x

# ----------------------------------------
# 1?? Setup LoRa Receiver
# ----------------------------------------
print("? Starting LoRa Receiver...")

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
CS = digitalio.DigitalInOut(board.D5)
RESET = digitalio.DigitalInOut(board.D25)
DIO0 = digitalio.DigitalInOut(board.D24)

rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)
print("? LoRa hardware initialized successfully!")

# ----------------------------------------
# 2?? Load ONNX Models
# ----------------------------------------
print("? Loading ONNX models...")

model1_path = "/home/pi5/env_status_model.onnx"
model2_path = "/home/pi5/survival_timer_model.onnx"

model1 = ort.InferenceSession(model1_path)
model2 = ort.InferenceSession(model2_path)

input1 = model1.get_inputs()[0].name
input2 = model2.get_inputs()[0].name

print("? ONNX models loaded successfully!")

# ----------------------------------------
# 3?? Helper: Extract numeric data for ONNX
# ----------------------------------------
def format_for_onnx(raw_data: str):
    """
    Extract numeric values after ':' or '=' from LoRa data.
    Example: 'MQ-2: 284, MQ7: 66, MQ135: 173' ? [[284.0, 66.0, 173.0]]
    """
    matches = re.findall(r"[:=]\s*([-+]?\d*\.\d+|\d+)", raw_data)
    if len(matches) < 3:
        print(f"?? Expected 3 sensor values, got {len(matches)} ? {matches}")
        return None
    arr = np.array([float(x) for x in matches[:3]], dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)
    print(f"? Parsed input for models: {arr}, dtype={arr.dtype}")
    return arr

# ----------------------------------------
# 4?? Helper: Build JSON output
# ----------------------------------------
def build_json(raw_data, env_label, survival_pred):
    return json.dumps({
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "raw_data": raw_data,
        "environment_status": env_label,
        "survival_prediction": survival_pred.tolist()
    })

# ----------------------------------------
# 5?? Main Loop ? LoRa ? ONNX Models ? JSON
# ----------------------------------------
print("? Waiting for LoRa packets...")

while True:
    packet = rfm9x.receive(timeout=1.0)
    if packet:
        try:
            raw_data = packet.decode("utf-8", errors="ignore").strip()

            # Auto-fix missing label if packet starts with number
            if re.match(r"^\d", raw_data):
                raw_data = f"MQ-2:{raw_data}"

            print(f"\n? Received: {raw_data}")

            formatted = format_for_onnx(raw_data)
            if formatted is not None:
                # Ensure correct type
                formatted = formatted.astype(np.float32)

                # --- Run Model 1 (Environment Status) ---
                out1 = model1.run(None, {input1: formatted})[0]

                # If model1 gives probabilities, get the max label index
                if isinstance(out1.flat[0], (np.floating, float)):
                    label_idx = int(np.argmax(out1))
                    env_label = ["Safe", "Caution", "Danger"][label_idx]
                else:
                    # If model returns strings directly
                    env_label = out1[0].decode() if isinstance(out1[0], bytes) else str(out1[0])

                print(f"?? Environment status: {env_label}")

                # --- Run Model 2 (Survival Timer) ---
                out2 = model2.run(None, {input2: formatted})[0]

                # --- Build and save JSON output ---
                result_json = build_json(raw_data, env_label, out2)

                print("? JSON Output:")
                print(result_json)

                with open("/home/pi5/results.jsonl", "a") as f:
                    f.write(result_json + "\n")

        except Exception as e:
            print("? Error processing packet:", e)
    else:
        print("? Waiting for packets...")
    time.sleep(0.5)
