# nao os 2.8.5.x
## linux kernel
```
# get the code (our version in case we changed anything)
# it's about 1GB
# git clone git@github.com:UNSWComputing/linux-aldebaran.git
# it's about 150MB
git clone --branch=sbr/v4.4.86-rt99-baytrail --depth=1 git@github.com:UNSWComputing/linux-aldebaran.git

# get the branch used for v6, in case it's not the default
git checkout sbr/v4.4.86-rt99-baytrail

# .config should already be preset but you can change something if you like:
# make config
make menuconfig
# make xconfig

# you may want to change:
#   Device Drivers  ---> Graphics support  ---> <M> Intel 8xx/9xx/G3x/G4x/HD Graphics

# in case you change something, you need to do this to get the kernel version string to match
git commit --all
git tag --annotate --force --message="need annotated tag to match kernel version string" v4.4.86-rt99-aldebaran

# compile!
make --jobs=$(nproc)

# this will make it a little easier to copy all the modules over
make INSTALL_MOD_PATH=~/linux-aldebaran-modules modules_install
```

## v6 camera auto exposure target script (has no effect)
```
robot=dory

ssh $robot sudo mount -o remount,rw /
for high in `seq 0 0x48`; do
    ((low = high * 0x30 / 0x48))
    low=$(printf 0x%x $low)
    high=$(printf 0x%x $high)
    sed_command=
    sed_command+="/{AEC_STABLE_RANGE_HIGH/s/.*/        {AEC_STABLE_RANGE_HIGH,     $high},/;"
    sed_command+="/{AEC_HYSTERESIS_RANGE_HIGH/s/.*/        {AEC_HYSTERESIS_RANGE_HIGH, $high},/;"
    sed_command+="/{AEC_STABLE_RANGE_LOW/s/.*/        {AEC_STABLE_RANGE_LOW,      $low},/;"
    sed_command+="/{AEC_HYSTERESIS_RANGE_LOW/s/.*/        {AEC_HYSTERESIS_RANGE_LOW,  $low},/;"
    sed -i "$sed_command" drivers/media/i2c/soc_camera/ov5640.c
    make --jobs=$(nproc)
    rsync -aPz drivers/media/i2c/soc_camera/ov5640.ko $robot:/lib/modules/4.4.86-rt99-aldebaran/kernel/drivers/media/i2c/soc_camera/ov5640.ko --rsync-path='sudo rsync'
    ssh $robot sudo rmmod ov5640
    ssh $robot sudo modprobe ov5640
    ssh $robot reboot
done
```
