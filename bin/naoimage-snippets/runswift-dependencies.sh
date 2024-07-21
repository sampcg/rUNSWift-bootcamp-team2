mount -o bind /dev ./root/dev
mount -o bind /dev/pts ./root/dev/pts
mount -t sysfs /sys ./root/sys
mount -t proc /proc ./root/proc

chroot ./root /bin/bash <<"EOT"
set -e 
set -o pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get install -y flite libprotobuf23 python-is-python3 net-tools rsync libjpeg-dev
apt-get install -y libboost-thread1.74.0 libboost-program-options1.74.0 libboost-serialization1.74.0 libboost-python1.74.0 python3-pip
apt-get install -y libasound2-dev
apt-get install -y libopencv-dev

# Ideally this would be in requirements.txt
pip3 install pyalsaaudio==0.10.0 numpy==1.26.4 msgpack==1.0.8

EOT

umount ./root/dev/pts
umount ./root/dev
umount ./root/sys
umount ./root/proc