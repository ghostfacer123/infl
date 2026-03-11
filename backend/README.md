# Influencer Product Search - Backend

## Architecture

**Pipeline:** Apify Scraping → Download → Transcribe → Extract → Load

### Data Flow
1. **Scrape** - Apify actors scrape TikTok/Instagram metadata
2. **Download** - Extract video URLs and download files
3. **Transcribe** - Groq Whisper transcribes audio to text
4. **Extract** - AI extracts product mentions
5. **Load** - Save to Supabase database

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

```env
# Apify
APIFY_API_TOKEN=your_token_here

# AI/Transcription
GROQ_API_KEY=your_groq_key

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Instagram (for Apify)
INSTA_USERNAME=throwaway_account
INSTA_PASSWORD=password
```

## Run Pipeline

```bash
python scripts/run_pipeline.py
```

## Individual Scripts

```bash
# Scrape
python scripts/scrape_tiktok_apify.py
python scripts/scrape_instagram_apify.py

# Download
python scripts/download_tiktok_videos.py
python scripts/download_instagram_videos.py

# Process
python scripts/transcribe_videos.py
python scripts/4_extract_products.py
python scripts/5_load_database.py
```

## Data Structure

```
data/
├── raw/
│   ├── tiktok/
│   │   └── {username}/
│   │       ├── videos.json          # Apify metadata
│   │       └── videos/              # Downloaded .mp4 files
│   └── instagram/
│       └── {username}/
│           ├── reels.json
│           └── videos/
└── processed/
    ├── transcriptions.json          # Whisper output
    └── products.json                # Extracted products
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/search?q=Charlotte Tilbury` | Smart product search |
| GET | `/products` | List all products |
| GET | `/influencers` | List all influencers |
| GET | `/categories` | List all categories |

## Deployment (Railway)

1. Create a new [Railway](https://railway.app) project
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Railway will auto-deploy using `nixpacks.toml`
