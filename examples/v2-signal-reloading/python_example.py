import time
import signal
import os
import threading

# Thread-safe global store
class Config:
    def __init__(self):
        self.lock = threading.Lock()
        self.api_key = None

config = Config()

def load_secrets():
    """Reads the secret from the memory-backed tmpfs mount provided by DSO."""
    try:
        with open('/var/run/dso/secrets/prod-api-key', 'r') as f:
            secret = f.read().strip()
            with config.lock:
                config.api_key = secret
        print("Successfully loaded/reloaded secret!")
    except FileNotFoundError:
        print("Error: Secret file not found. Ensure DSO is running and mounted.")

def sighup_handler(signum, frame):
    """The callback executed when DSO sends the SIGHUP kernel signal."""
    print("Received SIGHUP from DSO! Rotating secrets in memory...")
    load_secrets()

if __name__ == '__main__':
    # 1. Initial load before serving traffic
    load_secrets()
    
    # 2. Register the signal handler
    signal.signal(signal.SIGHUP, sighup_handler)
    
    print("Server is running. Waiting for signals...")
    
    # 3. Keep the main thread alive (representing a web server loop)
    while True:
        time.sleep(10)
        with config.lock:
            print(f"[Active] Current API Key: {config.api_key}")
