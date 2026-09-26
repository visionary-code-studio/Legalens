"""
Rate Limiter middleware for Legalens API endpoints.
Implements token-bucket rate limiting per client IP to prevent abuse
and ensure fair access to GenAI resources.
"""

import time
from typing import Dict, Tuple
from collections import defaultdict


class RateLimiter:
    """
    In-memory token-bucket rate limiter for API abuse prevention.
    Configurable per-endpoint limits with automatic token replenishment.
    """

    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._buckets: Dict[str, list] = defaultdict(list)

    def is_allowed(self, client_id: str) -> Tuple[bool, int]:
        """
        Check if the client is within their rate limit.
        Returns:
            (is_allowed: bool, remaining_requests: int)
        """
        now = time.time()
        bucket = self._buckets[client_id]

        # Prune expired entries
        self._buckets[client_id] = [
            ts for ts in bucket if now - ts < self.window_seconds
        ]
        bucket = self._buckets[client_id]

        if len(bucket) >= self.max_requests:
            return False, 0

        bucket.append(now)
        remaining = self.max_requests - len(bucket)
        return True, remaining

    def reset(self, client_id: str) -> None:
        """Clear rate limit state for a specific client."""
        self._buckets.pop(client_id, None)


# Pre-configured limiters for different endpoint tiers
api_limiter = RateLimiter(max_requests=60, window_seconds=60)
ai_limiter = RateLimiter(max_requests=20, window_seconds=60)
auth_limiter = RateLimiter(max_requests=10, window_seconds=60)
