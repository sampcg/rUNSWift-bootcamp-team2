#!/bin/bash
# This scripts builds the base image that we use to flash robots with
REALPATH="$(realpath "$0")"
BIN_DIR="$(dirname "$REALPATH")"
source "$BIN_DIR"/source.sh

cd "$RUNSWIFT_CHECKOUT_DIR"/softwares

in_docker=${RUNSWIFT_DOCKER:-0}

# dependencies for NaoImage
aptinstall debootstrap pigz e2fsprogs patchelf xxd rsync
# we'll get a dubious ownership warning without this
git config --global --add safe.directory '*'

if [[ ! -d NaoImage ]]; then
    # TODO: fork and replace with our fork here
    git clone https://github.com/NaoDevils/NaoImage.git
fi

if [[ ! -f nao-2.8.5.11_ROBOCUP_ONLY_with_root.opn ]]; then
    rsync -aP repository@runswift2.cse.unsw.edu.au:/var/www/html/opennao2/build-2.8.5.1x/nao-2.8.5.11_ROBOCUP_ONLY_with_root.opn ./
fi

cd NaoImage
git reset --hard
git pull
git apply ../../bin/naoimage-patches/naoimage-docker-support.patch
# TODO in Eindhoven we want to use the europe cdn
# sed -i 's@http://de.archive.ubuntu.com/ubuntu@http://mirror.aarnet.edu.au/ubuntu@' snippets/ubuntu.sh
ln -f ../../bin/naoimage-snippets/ros2-base.sh snippets/ros2-base.sh
ln -f ../../bin/naoimage-snippets/ros2-dependencies.sh snippets/ros2-dependencies.sh
ln -f ../../bin/naoimage-snippets/runswift-dependencies.sh snippets/runswift-dependencies.sh
ln -f ../../bin/naoimage-snippets/runswift-base.sh snippets/runswift-base.sh
ln -f ../../bin/naoimage-snippets/runswift-robotconfig.sh snippets/runswift-robotconfig.sh
ln -f ../../bin/naoimage-snippets/runswift-tag.sh snippets/runswift-tag.sh

if [ "$in_docker" -eq "1" ]; then
    echo "Running in docker, creating symlink for the image build folder";
    # we need x at the end to ensure the command like rm -r root/* will always work
    # as this command is the part of generate_image script
    mkdir -p ~/dev/image/root/x
    rm ~/dev/rUNSWift/softwares/NaoImage/root || true
    ln -s ~/dev/image/root ~/dev/rUNSWift/softwares/NaoImage/root
else
    echo "Running in a native system"
    rm -rf ./root || true
fi
# always keep runswift-tag as a last item to ensure we always update image build time and commit sha
sudo ./generate_image.sh ../nao-2.8.5.11_ROBOCUP_ONLY_with_root.opn ../image.ext3 ubuntu firmware-update runswift-dependencies save-base runswift-base runswift-robotconfig runswift-tag

./generate_opn.sh ../image.ext3 ../image.opn


