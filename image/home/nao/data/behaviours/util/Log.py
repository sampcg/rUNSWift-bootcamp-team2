import logging
import os
import robot

logger = logging.getLogger("behaviour")
logger.setLevel(logging.DEBUG)  # Set this to logging.INFO for comp

log_path = os.getenv("LOG_PATH", "/var/volatile/runswift")
log_folder = "%s/%s" % (log_path, 'latest') # note this is a symlink to the latest log dir by runswift binary

if os.path.islink(log_folder):
    real_path = os.readlink(log_folder)
    if not os.path.isabs(real_path):
        real_path = os.path.join(log_path, real_path)

    if os.path.isdir(real_path):
        log_folder = real_path
        file_handler = logging.FileHandler(log_folder + "/behaviour")
        logger.addHandler(file_handler)

        formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        print("Behaviour Logging to %s" % log_folder)
    else:
        print("I can't find the log folder %s!!" % log_folder)
        log_folder = None
else:
    print("log latest folder (%s) isn't a symlink!!" % log_folder)
    log_folder = None

console_handler = logging.StreamHandler()
logger.addHandler(console_handler)




def debug(*args, **kwargs):
    logger.debug(*args, **kwargs)


def info(*args, **kwargs):
    # in the most common log
    if log_folder is None:
        robot.say("I can't log Python behaviours")
    logger.info(*args, **kwargs)


def warning(*args, **kwargs):
    logger.warning(*args, **kwargs)


def error(*args, **kwargs):
    logger.error(*args, **kwargs)


def critical(*args, **kwargs):
    logger.critical(*args, **kwargs)
