FROM scratch
ENV RUNSWIFT_ROBOT_DOCKER=1
ADD root.tgz /
# Install SSH server
RUN apt update && apt install -y openssh-server ffmpeg \
v4l2loopback-dkms \
v4l2loopback-utils \
build-essential \
git \
v4l-utils
# linux-headers-$(uname -r)-generic

RUN apt-get clean

RUN echo "v4l2loopback" >> /etc/modules
# RUN modprobe v4l2loopback devices=2

WORKDIR /home/nao


# # Configure SSH
RUN mkdir /var/run/sshd
# RUN echo 'root:password' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
RUN ssh-keygen -A

# Expose SSH port
EXPOSE 22

# Start SSH service
CMD ["/usr/sbin/sshd", "-D"]