"""
Shared async OpenRouter LLM client.

Safety guarantees:
  - temperature=0.2 (near-deterministic)
  - Strict JSON parsing with up to 3 retries on malformed output
  - Exponential backoff on 429 rate-limit errors (15s → 30s → 60s)
  - Raises ValueError if all retries fail
  - Never returns raw string — always returns parsed dict
"""

import asyncio
import json
import logging
import httpx
from typing import Any, Dict, Optional

import backend.config as _cfg

logger = logging.getLogger(__name__)


async def call_llm(
    system_prompt: str,
    user_prompt: str,
    model: Optional[str] = None,
    max_tokens: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Call OpenRouter LLM and return parsed JSON dict.
    Retries up to OPENROUTER_MAX_RETRIES times with exponential backoff on 429.
    """
    api_key = _cfg.OPENROUTER_API_KEY
    if not api_key or api_key.startswith("sk-or-YOUR"):
        raise ValueError(
            "OPENROUTER_API_KEY is not set. "
            "Add it to backend/.env: OPENROUTER_API_KEY=sk-or-..."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://agri-decision-lab.local",
        "X-Title": "Avishkar Crop Decision Intelligence",
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_prompt})

    payload = {
        "model": model or _cfg.OPENROUTER_MODEL,
        "temperature": _cfg.OPENROUTER_TEMPERATURE,
        "max_tokens": max_tokens or _cfg.OPENROUTER_MAX_TOKENS,
        "messages": messages,
        # Note: response_format JSON mode is NOT set here — it's unsupported on many
        # free-tier models (e.g. Llama 3.3 70B). JSON output is enforced via the
        # system prompt ("Return ONLY valid JSON") + retry/parse logic below.
    }

    max_retries = _cfg.OPENROUTER_MAX_RETRIES
    backoff_seconds = [15, 30, 60]  # wait times between retries on 429

    async with httpx.AsyncClient(timeout=90.0) as client:
        for attempt in range(1, max_retries + 1):
            try:
                logger.debug(f"OpenRouter call attempt {attempt}/{max_retries} model={model or _cfg.OPENROUTER_MODEL}")
                resp = await client.post(
                    _cfg.OPENROUTER_BASE_URL,
                    headers=headers,
                    json=payload,
                )

                # Handle 429 with backoff before raising
                if resp.status_code == 429:
                    wait = backoff_seconds[min(attempt - 1, len(backoff_seconds) - 1)]
                    logger.warning(
                        f"Attempt {attempt}: 429 rate limit — waiting {wait}s before retry..."
                    )
                    if attempt < max_retries:
                        await asyncio.sleep(wait)
                        continue
                    else:
                        resp.raise_for_status()  # raise after final attempt

                resp.raise_for_status()

                data = resp.json()
                content = data["choices"][0]["message"]["content"]

                # Strip markdown code fences if present
                content = content.strip()
                if content.startswith("```"):
                    lines = content.split("\n")
                    content = "\n".join(lines[1:-1])

                parsed = json.loads(content)
                logger.debug(f"OpenRouter call succeeded on attempt {attempt}")
                return parsed

            except json.JSONDecodeError as e:
                logger.warning(f"Attempt {attempt}: JSON parse failed — {e}")
                if attempt == max_retries:
                    raise ValueError(
                        f"LLM returned non-JSON after {max_retries} attempts. "
                        f"Last error: {e}"
                    )

            except httpx.HTTPStatusError as e:
                logger.error(f"OpenRouter HTTP error: {e.response.status_code} — {e.response.text[:200]}")
                raise

            except Exception as e:
                logger.warning(f"Attempt {attempt}: Unexpected error — {e}")
                if attempt == max_retries:
                    raise ValueError(
                        f"LLM call failed after {max_retries} attempts. "
                        f"Last error: {e}"
                    )

    raise ValueError("LLM call failed: exhausted all retries")
