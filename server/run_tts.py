#!/usr/bin/env python
"""
Coqui TTS script for generating speech
"""

import sys
import os
import argparse
from pathlib import Path

try:
    from TTS.api import TTS
except ImportError:
    print("Error: Coqui TTS not installed. Please run: pip install TTS")
    sys.exit(1)

def get_model_name(language):
    """Get the appropriate model name based on language"""
    models = {
        "en": "tts_models/en/ljspeech/tacotron2-DDC",
        "hi": "tts_models/hi/cv/vits",
        "mixed": "tts_models/multilingual/multi-dataset/xtts_v2"
    }
    return models.get(language, models["en"])

def main():
    parser = argparse.ArgumentParser(description="Generate speech using Coqui TTS")
    parser.add_argument("--text", type=str, required=True, help="Text to convert to speech")
    parser.add_argument("--language", type=str, choices=["en", "hi", "mixed"], default="en", help="Language code")
    parser.add_argument("--output", type=str, required=True, help="Output audio file path")
    args = parser.parse_args()

    try:
        # Ensure output directory exists
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Get model name
        model_name = get_model_name(args.language)
        print(f"Using model: {model_name}")

        # Initialize TTS
        tts = TTS(model_name=model_name)
        print("TTS model loaded successfully")

        # Generate speech
        print(f"Generating speech for: {args.text}")
        tts.tts_to_file(text=args.text, file_path=str(output_path))
        
        if output_path.exists():
            print(f"Successfully generated speech at: {output_path}")
            return 0
        else:
            print(f"Failed to generate speech file at: {output_path}")
            return 1

    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 