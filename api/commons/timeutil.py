from datetime import datetime

import pytz


def utc_now():
    """Creates a timezone-aware datetime instance.
    """
    return datetime.now(tz=pytz.utc)
