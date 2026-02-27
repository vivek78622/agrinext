import sqlite3

def fix_db():
    conn = sqlite3.connect('agri_decision.db')
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE crops ADD COLUMN base_temp_c FLOAT DEFAULT 10.0")
        conn.commit()
        print("Added base_temp_c column.")
    except sqlite3.OperationalError as e:
        print(f"Error (maybe column exists?): {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_db()
