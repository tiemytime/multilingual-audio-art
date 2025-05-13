
#!/usr/bin/env python
"""
A simple wrapper for Coqui TTS that accepts command line arguments.
This script converts text to speech and saves the output as a WAV file.
"""

import argparse
import os
from TTS.utils.synthesizer import Synthesizer

def main():
    """Main function to process arguments and run TTS"""
    parser = argparse.ArgumentParser(description='Run Coqui TTS on input text')
    parser.add_argument('--text', type=str, required=True, help='Text to convert to speech')
    parser.add_argument('--language', type=str, default='en', choices=['en', 'hi'], help='Language code')
    parser.add_argument('--output', type=str, required=True, help='Output WAV file path')
    
    args = parser.parse_args()
    
    # Choose appropriate model based on language
    if args.language == 'hi':
        model_name = "tts_models/multilingual/multi-dataset/your_tts"
        vocoder_name = "vocoder_models/universal/libri-tts/fullband-melgan"
    else:
        model_name = "tts_models/en/ljspeech/tacotron2-DDC"
        vocoder_name = "vocoder_models/en/ljspeech/multiband-melgan"
    
    # Initialize synthesizer
    synthesizer = Synthesizer(
        model_name,
        vocoder_name,
        use_cuda=False  # Set to True if GPU is available
    )
    
    # Generate speech
    print(f"Generating speech for: {args.text}")
    wav = synthesizer.tts(args.text)
    
    # Save the output
    print(f"Saving to: {args.output}")
    synthesizer.save_wav(wav, args.output)
    
    # Generate phonemes (would be handled differently in a real implementation)
    phonemes = get_phonemes(args.text, args.language)
    print(f"Phonemes: {phonemes}")
    
    return 0

def get_phonemes(text, language):
    """
    Get phonemes for the text.
    In a real implementation, this would use Coqui TTS's phoneme conversion.
    """
    # This is a simplified phoneme generation
    # In a real implementation, you would use Coqui TTS's phoneme conversion
    words = text.split()
    phonemes = []
    
    for word in words:
        # Simple phoneme representation
        if language == 'hi':
            phonemes.append(f"{word}-hi")
        else:
            phonemes.append(f"{word}-en")
    
    return phonemes

if __name__ == "__main__":
    exit(main())
