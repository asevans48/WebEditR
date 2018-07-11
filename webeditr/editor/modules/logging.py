"""
Can set a logger with at least the log function


@author aevans
"""
import datetime
from enum import Enum

LOGGER = None

class LOGLEVEL(Enum):
    DEBUG = 1
    INFO = 2
    WARN = 3


def set_logger(logger):
    global LOGGER
    LOGGER = logger


def get_logger():
    global LOGGER
    return LOGGER


def log(msg, logger=LOGGER, level=LOGLEVEL.INFO):
    if logger is None:
        print("{} @ {}: {}".format(level.name, str(datetime.datetime.now()), msg))
    else:
        msg = "{} @ {}: {}".format(level.name, str(datetime.datetime.now()), msg)
        logger.log(msg)
