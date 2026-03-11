"""
Master pipeline: Apify scraping → Download → Transcribe → Extract → Load

Usage:
    python run_pipeline.py [--influencer USERNAME] [--platform PLATFORM]

Steps:
    1. Scrape with Apify (TikTok + Instagram)
    2. Download videos
    3. Transcribe with Groq Whisper
    4. Extract products with AI
    5. Load to Supabase
"""

import subprocess
import sys
import time
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent

# Define pipeline steps
STEPS = [
    ("scrape_tiktok_apify.py", "Scrape TikTok (Apify)"),
    ("scrape_instagram_apify.py", "Scrape Instagram (Apify)"),
    ("download_tiktok_videos.py", "Download TikTok videos"),
    ("download_instagram_videos.py", "Download Instagram videos"),
    ("transcribe_videos.py", "Transcribe all videos"),
    ("4_extract_products.py", "Extract products with AI"),
    ("5_load_database.py", "Load to Supabase"),
]

def run_step(script: str, description: str) -> bool:
    """Run a pipeline step"""
    print(f"\n{'='*60}")
    print(f"▶ {description}")
    print(f"  Script: {script}")
    print(f"{'='*60}")
    
    start = time.time()
    result = subprocess.run([sys.executable, str(SCRIPTS_DIR / script)])
    elapsed = time.time() - start
    
    if result.returncode == 0:
        print(f"\n✅ {description} completed in {elapsed:.1f}s")
        return True
    else:
        print(f"\n❌ {description} failed")
        return False

def main():
    print("="*60)
    print("🚀 Influencer Product Pipeline (Apify-based)")
    print("="*60)
    
    for script, desc in STEPS:
        success = run_step(script, desc)
        if not success:
            response = input("\nContinue anyway? [y/N] ").strip().lower()
            if response != 'y':
                print("Aborting.")
                sys.exit(1)
    
    print("\n"+"="*60)
    print("✅ Pipeline complete!")
    print("="*60)

if __name__ == "__main__":
    main()
