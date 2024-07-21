# install NVM
# sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
# install node
nvm install 19
cd $RUNSWIFT_CHECKOUT_DIR/utils/webnao/scripts
bash ./install.sh
