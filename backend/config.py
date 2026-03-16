from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # Hardcoded API key as requested for public use
    GOOGLE_API_KEY: str = "AIzaSyCX2vgzgbKFVkwAYkxRHcQMYHOnzWfKlmc"
    DATABASE_URL: str = "sqlite:///./resume_analyzer.db"
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
