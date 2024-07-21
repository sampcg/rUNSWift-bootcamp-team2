# This Makefile documents common commands you'd run in this repo

# Define ARGS to capture extra arguments
ARGS = $(filter-out $@,$(MAKECMDGOALS))

### Building images and binaries
# To do anything related to building, you first need your docker container set up. Run `make build-docker` to do this
# rerun any time you change Dockerfile or dependant files
build-docker:
	./bin/build-docker.sh
build-runswift:
	./bin/docker.sh ./bin/build-target.sh runswift
# Builds binary that ticks a lot slower. However, it provides a lot more information when it core-dumps/is introspected with a debugger
build-runswift-debug:
	./bin/docker.sh ./bin/build-target.sh runswift debug

# also builds offnao, vatnao
build-all:
	./bin/docker.sh ./bin/build-target.sh all

# when building the image, it's recommended you have rUNSWift already built so it can be included in the image
build-image:
	./bin/docker.sh ./bin/build-naoimage.sh

### Running Utilities
run-offnao: # runs from default location (buildwithrelinfo)
	./bin/docker.sh bash -c "RUNSWIFT_CHECKOUT_DIR=/root/dev/rUNSWift ./build-relwithdebinfo-native/utils/offnao/offnao.bin"

run-vatnao: # usage: make run_vatnao -- --filename <offnao dump file>
	./bin/docker.sh bash -c "RUNSWIFT_CHECKOUT_DIR=/root/dev/rUNSWift ./build-relwithdebinfo-native/utils/vatnao/vatnao.bin $(ARGS)"

# TODO command to install and run webnao

### While at Comp
# Changes the wifi the robot connects to
change-wifi: # usage: change-wifi <robot/all> <wifi-name/NONE>
	./bin/nao-util.py $(firstword $(ARGS)) --wifi $(word 2,$(ARGS))
# syncs the code on your computer to the robot. Do `make nao-sync all` to sync to all robots reachable
nao-sync: # usage: make nao-sync <robot>
	./bin/nao-util.py $(ARGS) --sync
# shutdown a nao robot (or all of them)
nao-shutdown: # usage: make nao-shutdown <robot/all>
	./bin/nao-util.py $(ARGS) --shutdown
# # reboot a nao robot (or all of them)
nao-reboot: # usage: make nao-reboot <robot/all>
	./bin/nao-util.py $(ARGS) --reboot
# check robot build time, commit sha, player number (in config) etc
nao-check: # usage: make nao-check <robot/all>
	./bin/nao-util.py $(ARGS) --check
# edit field_dimensions.json and run this to update the field dimensions on the robot. Units are in meters
configure-field:
	./bin/configure-field-json field_dimensions.json

### Misc
update-hosts: # adds the robots to your hosts file, meaning you can easily reference them in any command like ping/ssh without needing its ip
	sudo ./bin/update-hosts.sh
clean:
	rm -rf build-*
