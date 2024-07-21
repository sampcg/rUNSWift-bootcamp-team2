# Webnao

Toolset for debugging, calibration and analysis of rUNSWift NAO robots' peformance.

## Overview
The toolset currently consists of three parts:
- the web application that provides the tools that can be used on a laptop or mobile
- the server that provides information about the robots and facilitates streaming from network or dumps
- the dump processor to extract information of interest from dumps

## Getting started
### Installing Node.js 

The preferred method of using Node.js is via [NVM](https://github.com/nvm-sh/nvm) as it allows for different versions of Node to be installed and used on one machine.

For Linux or MacOS please follow the [nvm documentation](https://github.com/nvm-sh/nvm#installing-and-updating), and for Windows, please follows the [nvm-windows](https://github.com/coreybutler/nvm-windows).

Once NVM is installed, run :

1. `nvm install 19`
2. `nvm use 19`
3. Reload VScode

### Installing dependencies

1. Run `npm i` inside *webnao/server* folder 
2. Run `npm i` inside *webnao/webapp-react* folder

### Running the main application
1. Run `npm start` inside the *server* folder, wait for "Servers started" message
2. In as separate terminal, run `npm start` inside the *webapp-react* folder 
3. The tools should launch a browser to http://localhost:1234

### Using the dump processor
The dump processor supports two parameters
* `--middleware`, which is the name of the processor to use
* `--dumps`, which can have multiple comma-separated paths for dump files. The paths could be globs, for example `'.dumps/a/**/*.bbd2'` will find and process all bbd2 files inside `.dumps/a` folder and its subfolders

To start the processor, run `npm run process-dumps -- --middleware [desired processor] --dumps [dump paths]`

Example:
`npm run process-dumps -- --middleware robotImages --dumps '.dumps/230831-yellow-game/*.bbd2'`


## Folder structure

`server` - server part
`server/.dumps` - where all dumps should go, with *.bbd2* extension
`react-webapp` - web application

## Updating blackboard defitions

We are using Protobuf to serialise blackboards in the network stream and dump files.
In order to deserialise them into instances of the correct types on the Webnao end, we need to sync protobuf defintions (.proto files) with types in the Typescript world.
In order to do that
1. Copy .proto files from the runswift build output into react-webapp/src/common/blackboard/definitions/
2. In order to re-generate definitions, go to react-webapp folder and run `npm run protobuf-gen` or `npm run protobuf-gen-win` on Windows.

## Other useful commands
* Sync time over ssh 
```
ssh nao@robot sudo date -s @`( date -u +"%s" )` 
```

## Example dumps
If you want to work with dump files, here are a couple of examples:  

https://limenutt-drive.s3.amazonaws.com/temp/rUNSWift/dump1.bbd2  
https://limenutt-drive.s3.amazonaws.com/temp/rUNSWift/dump-mirror2.bbd2 
