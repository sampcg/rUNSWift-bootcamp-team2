#!/bin/bash
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH/../")
source "$BIN_DIR/source.sh"

EXES=(${RUNSWIFT_CHECKOUT_DIR}/build-relwithdebinfo-native/utils/offnao/offnao.bin ${RUNSWIFT_CHECKOUT_DIR}/build-relwithdebinfo-2.1.4.13/utils/offnao/offnao.bin)
TARS=(/tmp/offnao-native.tar /tmp/offnao-2.1.tar)

export LD_LIBRARY_PATH="${RUNSWIFT_CHECKOUT_DIR}/softwares/sysroot_legacy/usr/lib/qt4/;${RUNSWIFT_CHECKOUT_DIR}/softwares/ctc-linux64-atom-2.1.4.13/png"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH;${RUNSWIFT_CHECKOUT_DIR}/softwares/sysroot_legacy/usr/lib:${RUNSWIFT_CHECKOUT_DIR}/softwares"

for i in ${!EXES[@]}; do
    EXE=${EXES[$i]}
    TAR=${TARS[$i]}

    if [ ! -f "$EXE" ]; then
        echo "ERROR: $EXE does not exist. Please run build-relwithdebinfo-native.sh and build-relwithdebinfo-2.1.sh"
        exit 1
    fi

    # Get linked libraries of offnao.bin and copy them to the tar file as well as offnao.bin itself
    # except libc.so.6 libpthread.so.0 librt.so.1
    libs=$(ldd "$EXE" | grep -v libc.so.6 | grep -v libpthread.so.0 | grep -v librt.so.1 | awk '{print $3}')
    rm -f "$TAR" "$TAR.xz"
    tar -cf "$TAR" -C / --transform 's/.*\//offnao\//' --dereference "$EXE" $libs

    # Create a simple script to run offnao.bin
    cat > /tmp/offnao.sh <<EOF
#!/bin/bash
REALPATH=\$(realpath "\$0")
BIN_DIR=\$(dirname "\$REALPATH")
cd "\$BIN_DIR"
LD_LIBRARY_PATH=. ./offnao.bin
EOF
    chmod +x /tmp/offnao.sh
    tar -rf "$TAR" -C /tmp --transform 's/^/offnao\//' offnao.sh

    xz -v "$TAR"
done
