"""
Analysis Job Store
Stores the state of running analyses.
"""
from typing import Dict, Any, Optional
from enum import Enum
from datetime import datetime
import uuid

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING_MODEL_1 = "processing_model_1"
    MODEL_1_COMPLETED = "model_1_completed"
    PROCESSING_MODEL_2 = "processing_model_2"
    PROCESSING_MODEL_3 = "processing_model_3"
    PROCESSING_MODEL_4 = "processing_model_4"
    PROCESSING_MODEL_5 = "processing_model_5"
    PROCESSING_MODEL_6 = "processing_model_6"
    PROCESSING_MODEL_7 = "processing_model_7"
    PROCESSING_MODEL_8 = "processing_model_8"
    PROCESSING_MODEL_9 = "processing_model_9"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalysisJob:
    def __init__(self, request_data: Dict[str, Any]):
        self.job_id = str(uuid.uuid4())
        self.status = AnalysisStatus.PENDING
        self.request_data = request_data
        self.created_at = datetime.now()
        self.model_1_result: Optional[Dict[str, Any]] = None
        self.full_result: Optional[Dict[str, Any]] = None
        self.completed_steps: list[str] = []  # Track completed model names
        self.error: Optional[str] = None
        # Per-model results: keyed "model_1" .. "model_9", populated as each model finishes
        self.model_results: Dict[str, Any] = {}

class AnalysisJobStore:
    _jobs: Dict[str, AnalysisJob] = {}

    @classmethod
    def create_job(cls, request_data: Dict[str, Any]) -> AnalysisJob:
        job = AnalysisJob(request_data)
        cls._jobs[job.job_id] = job
        return job

    @classmethod
    def get_job(cls, job_id: str) -> Optional[AnalysisJob]:
        return cls._jobs.get(job_id)

    @classmethod
    def update_status(cls, job_id: str, status: AnalysisStatus):
        if job_id in cls._jobs:
            cls._jobs[job_id].status = status

    @classmethod
    def add_completed_step(cls, job_id: str, step_name: str):
        if job_id in cls._jobs:
            cls._jobs[job_id].completed_steps.append(step_name)

    @classmethod
    def set_model_result(cls, job_id: str, model_key: str, result: Dict[str, Any]):
        """Store an individual model's result. e.g. model_key='model_1'"""
        if job_id in cls._jobs:
            cls._jobs[job_id].model_results[model_key] = result

    @classmethod
    def set_model_1_result(cls, job_id: str, result: Dict[str, Any]):
        if job_id in cls._jobs:
            cls._jobs[job_id].model_1_result = result
            cls._jobs[job_id].status = AnalysisStatus.MODEL_1_COMPLETED
            cls.add_completed_step(job_id, "Rainfall Analysis")
            # Also store in unified model_results for frontend progressive access
            cls.set_model_result(job_id, "model_1", result)

    @classmethod
    def set_full_result(cls, job_id: str, result: Dict[str, Any]):
        if job_id in cls._jobs:
            cls._jobs[job_id].full_result = result
            cls._jobs[job_id].status = AnalysisStatus.COMPLETED

    @classmethod
    def set_error(cls, job_id: str, error: str):
        if job_id in cls._jobs:
            cls._jobs[job_id].error = error
            cls._jobs[job_id].status = AnalysisStatus.FAILED
