VENV=.venv-hy
PYTHON=python3.4
HY=hy
IPYTHON=ipython3
IPYTHON_DIR=$(shell pwd)/.ipython
IPYTHON_PROFILE=ihy
IPYTHON_OPTIONS=--ipython-dir=$(IPYTHON_DIR) --profile=$(IPYTHON_PROFILE) --kernel hy
SYSTEM_PYTHON=$(shell which $(PYTHON))
SOURCE=./lib

virtual-env:
	$(SYSTEM_PYTHON) -m venv $(VENV)

project-deps:
	. $(VENV)/bin/activate && \
	pip3.4 install -r requirements.txt

project-setup: virtual-env deps

run:
	. $(VENV)/bin/activate && \
	PYTHONPATH=$(SOURCE) \
	$(IPYTHON) notebook $(NOTEBOOK) $(IPYTHON_OPTIONS)

clean:
	rm -rf $(VENV)

repl:
	. $(VENV)/bin/activate && \
	PYTHONPATH=$(SOURCE) \
	$(IPYTHON) $(IPYTHON_OPTIONS)

hyrepl:
	. $(VENV)/bin/activate && \
	PYTHONPATH=$(SOURCE) $(HY)

flakes:
	@echo "\nChecking for flakes ...\n"
	flake8 $(SOURCE)
