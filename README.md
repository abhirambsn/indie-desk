# Indie Desk
### An All in one Platform for freelancers

## Development Instructions

1. To add any new module create a directory in the ``modules`` folder and start developing there.
2. The ``ui`` folder contains the angular frontend.
3. Kindly add the commands required to run the module in the ``docs/<module_name>.md`` file.
4. Name all the commits in the format ``<module_name>: <commit_message>``.
5. Create a ``Dockerfile`` and Kubernetes deployment or ``docker-compose.yml`` file for each module.
6. If using ``python`` kindly name your virtual environments **.venv** only.
7. Do NOT push virtual environment (if you virtual env folder name is different kindly add it to the **.gitignore** file).