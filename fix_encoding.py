
import os
import re

paths = [
    r"c:\Users\vivek\OneDrive\Documents\python\agri new\web\src\app\(main)\crop-advisor\page.tsx",
    r"c:\Users\vivek\OneDrive\Documents\python\agri new\web\src\app\(main)\crop-advisor\full-analysis\page.tsx",
    r"c:\Users\vivek\OneDrive\Documents\python\agri new\web\src\app\(main)\crop-analysis\page.tsx",
    r"c:\Users\vivek\OneDrive\Documents\python\agri new\web\src\components\crop-advisor\ProgressTracker.tsx"
]

def fix_match(m):
    text = m.group(0)
    try:
        # Try to reverse cp1252 -> utf8
        decoded = text.encode('cp1252').decode('utf-8')
        # Check if it looks like Devanagari or just a valid decode
        return decoded
    except:
        # If it fails, leave it alone
        return text

for p in paths:
    if not os.path.exists(p): continue
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()

    # The mojibake is composed of characters in the extended latin range (mostly 0x80 - 0xFF)
    # Plus sometimes spaces in between if there are multiple words.
    # Actually, let's just match any chunk that contains at least one high-ascii char
    # and includes spaces/punctuation so we can decode multi-word Devanagari together.
    # Even simpler: we can chunk by "sequences of non-ASCII characters and spaces".
    
    # Let's match any sequence that contains letters \x80-\xFF.
    # We can match word boundaries but it's safer to just match continuous blocks of \x80-\xFF
    # Wait, the CP1252 encoding might include characters like ' ' (space) internally if we decode them together?
    # No, space was space (0x20) in utf-8, which is 0x20 in cp1252.
    # If the text is "à¤•à¤¾à¤³à¥€ à¤®à¤¾à¤¤à¥€", there is a space in the middle.
    # If we decode word by word, the spaces remain outside.
    # So `match.encode('cp1252')` on "à¤•à¤¾à¤³à¥€" works, and space works.
    
    # Let's try matching chunks of [\x80-\xFF]+
    # For safe decoding, it's actually better to decode block of [\x80-\xFF\s\.,!\?]+ 
    # but let's just do [\x80-\xFF]+ first. Wait! UTF-8 sequences can be split by spaces in our regex?
    # No, utf-8 encoding of one character is 3 bytes, e.g. E0 A4 A4. 
    # All those 3 bytes become 3 characters in U+0080 - U+00FF.
    # Space is U+0020. Space is NOT part of the utf-8 sequence of a devanagari character.
    # So it perfectly forms continuous blocks of [\x80-\xFF]+ for each word!
    
    new_content = re.sub(r'[\x80-\xff]+', fix_match, content)
    
    if new_content != content:
        with open(p, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed mojibake in {os.path.basename(p)}")
    else:
        print(f"No changes in {os.path.basename(p)}")
