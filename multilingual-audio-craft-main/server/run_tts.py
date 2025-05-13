#!/usr/bin/env python
"""
Simplified script to run Coqui TTS and save output
Used by the Express.js server to generate speech
"""

import sys
import os
import argparse

try:
    from TTS.api import TTS
except ImportError:
    print("Error: Coqui TTS not installed. Install with 'pip install TTS'")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Run Coqui TTS")
    parser.add_argument("--text", type=str, required=True, help="Text to convert to speech")
    parser.add_argument("--language", type=str, choices=["en", "hi", "mixed"], default="en", help="Language code")
    parser.add_argument("--output", type=str, required=True, help="Output file path")

    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    # Model selection based on language
    if args.language == "mixed":
        model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
    elif args.language == "hi":
        model_name = "tts_models/hi/cv/vits"
    else:
        model_name = "tts_models/en/ljspeech/tacotron2-DDC"

    try:
        print(f"Loading TTS model: {model_name}")
        tts = TTS(model_name=model_name)
        
        print(f"Generating speech for text: {args.text}")
        tts.tts_to_file(text=args.text, file_path=args.output)
        
        if os.path.exists(args.output):
            print(f"✅ Successfully generated speech at {args.output}")
            return 0
        else:
            print(f"❌ Output file was not created at {args.output}")
            return 1
            
    except Exception as e:
        print(f"❌ Error generating speech: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
