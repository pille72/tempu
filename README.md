# tempu
School Project

## Install

- SSH into raspberry pi
- `$ cd /tmp/ `
- `$ wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.55.tar.gz`
- `$ tar zxvf bcm2835-1.55.tar.gz`
- `$ cd bcm2835-1.55`
- `$ ./configure`
- `$ make`
- `$ sudo make check`
- `$ sudo make install`

### Run TempÜ
- `$ git clone https://github.com/pille72/tempu.git tempu`
- `$ cd tempu && npm install`
- `$ sudo node tempu.js`
