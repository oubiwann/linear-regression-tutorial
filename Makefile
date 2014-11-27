NAME=tutorial
NOTEBOOK=notebooks/$(NAME).ipynb

include include/common.mk

# The 'setup' target needs to be run before the 'project-deps' target,
# so that the includes are present (done by 'make project-setup').
deps: project-deps

setup: project-setup

.DEFAULT_GOAL :=
default: setup run
