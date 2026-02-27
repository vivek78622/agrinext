"""Migration: add market_potential column to crops table."""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy import text
from backend.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE crops ADD COLUMN market_potential VARCHAR DEFAULT "Medium"'))
        conn.commit()
        print("Column market_potential added successfully.")
    except Exception as e:
        if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
            print("Column already exists, skipping.")
        else:
            print(f"Error: {e}")
