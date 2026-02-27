from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models import Crop

class CropRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_crops(self) -> List[Crop]:
        """Fetch all crops from the database."""
        return self.db.query(Crop).all()

    def get_crops_by_season(self, season: str) -> List[Crop]:
        """Fetch crops matching a specific season."""
        # Case-insensitive matching for season could be added if needed
        return self.db.query(Crop).filter(Crop.season == season).all()

    def get_crop_by_id(self, crop_id: int) -> Optional[Crop]:
        """Fetch a single crop by ID."""
        return self.db.query(Crop).filter(Crop.id == crop_id).first()

    def get_crop_by_name(self, name: str) -> Optional[Crop]:
        """Fetch a single crop by name."""
        return self.db.query(Crop).filter(Crop.name == name).first()
