FROM osrf/ros:humble-desktop@sha256:06958ceb5a0dc89cd4c2c6e4077da98432bd71700f1c8cd6b643bf6f7fafccf3
ENV RUNSWIFT_DOCKER=1

# Update package list and install dependencies including ccache
RUN sudo apt update && \
    sudo apt install -y wget unzip cmake debootstrap pigz e2fsprogs patchelf xxd rsync ccache libopencv-dev

# Ensure ccache is in the PATH
ENV PATH="/usr/lib/ccache:${PATH}"

# build setup starts
RUN mkdir -p /root/dev/rUNSWift/bin
COPY bin/source.sh /root/dev/rUNSWift/bin/source.sh
COPY bin/setup-build.sh /root/dev/rUNSWift/bin/setup-build.sh
RUN chmod +x /root/dev/rUNSWift/bin/setup-build.sh
RUN /root/dev/rUNSWift/bin/setup-build.sh
RUN rm -rf /root/dev/rUNSWift
# build setup ends

RUN mkdir -p /root/dev/rUNSWift
WORKDIR /root/dev/rUNSWift
COPY bin/entrypoint.sh /root/entrypoint.sh
RUN chmod +x /root/entrypoint.sh
ENTRYPOINT ["bash", "/root/entrypoint.sh"]