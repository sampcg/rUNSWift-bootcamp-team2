echo 'deb http://download.opensuse.org/repositories/science:/SimSpark/xUbuntu_22.04/ /' | sudo tee /etc/apt/sources.list.d/science:SimSpark.list
curl -fsSL https://download.opensuse.org/repositories/science:SimSpark/xUbuntu_22.04/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/science_SimSpark.gpg > /dev/null
sudo apt-get update
sudo apt-get install rcssserver3d
