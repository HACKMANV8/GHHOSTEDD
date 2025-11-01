import json
import numpy as np
import onnxruntime as ort
import os

# --- Model Paths ---
ENV_MODEL_PATH = "/home/pi5/naakshatra1/GHHOSTEDD/backend/env_status_model.onnx"
SURVIVAL_MODEL_PATH = "/home/pi5/naakshatra1/GHHOSTEDD/backend/survival_timer_model.onnx"
OUTPUT_PATH = "/home/pi5/naakshatra1/GHHOSTEDD/backend/predictions.json"

# --- Load Models ---
env_session, survival_session = None, None
env_input, survival_input = None, None

try:
    if os.path.exists(ENV_MODEL_PATH):
        env_session = ort.InferenceSession(ENV_MODEL_PATH)
        env_input = env_session.get_inputs()[0].name
        print(f"? Environment model loaded from {ENV_MODEL_PATH}")
    else:
        print(f"?? Environment model not found at {ENV_MODEL_PATH}")

    if os.path.exists(SURVIVAL_MODEL_PATH):
        survival_session = ort.InferenceSession(SURVIVAL_MODEL_PATH)
        survival_input = survival_session.get_inputs()[0].name
        print(f"? Survival model loaded from {SURVIVAL_MODEL_PATH}")
    else:
        print(f"?? Survival model not found at {SURVIVAL_MODEL_PATH}")

except Exception as e:
    print(f"?? Error loading ONNX models: {e}")
    print("Running fallback predictions (Safe, 400s)...")

def run_inference(mq2, mq7, mq135):
    """
    Run inference using both ONNX models.
    Returns:
      {
        "env_status": ["Safe" / "Caution" / "Danger"],
        "survival_prediction": [[float(seconds)]]
      }
    """
    input_data = np.array([[mq2, mq7, mq135]], dtype=np.float32)

    # --- Environment Classification ---
    if env_session:
        try:
            env_output = env_session.run(None, {env_input: input_data})
            env_raw = env_output[0][0]

            if isinstance(env_raw, (int, np.integer, float)):
                label_map = {0: "Safe", 1: "Caution", 2: "Danger"}
                env_label = label_map.get(int(env_raw), "Unknown")
            else:
                env_label = str(env_raw)

        except Exception as e:
            print(f"?? Environment model inference error: {e}")
            env_label = "Unknown"
    else:
        env_label = "Safe" if mq7 < 1000 else "Caution"

    # --- Survival Timer Prediction ---
    if survival_session:
        try:
            survival_output = survival_session.run(None, {survival_input: input_data})
            survival_raw = float(survival_output[0][0][0])  # seconds
        except Exception as e:
            print(f"?? Survival model inference error: {e}")
            survival_raw = 0.0
    else:
        survival_raw = 400.0  # fallback

    # --- Combine Results ---
    result = {
        "env_status": [env_label],
        "survival_prediction": [[float(survival_raw)]]
    }

    # --- Save to predictions.json ---
    try:
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        with open(OUTPUT_PATH, "w") as f:
            json.dump(result, f, indent=4)
        print(f"? Result saved to {OUTPUT_PATH}")
    except Exception as e:
        print(f"?? Could not save results: {e}")

    return result
