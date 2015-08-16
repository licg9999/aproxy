#!/bin/bash

sudo rm -R node_modules/flex-combo-plus/ 
sudo cp -R ../flex-combo-plus/ node_modules/flex-combo-plus/

sudo ./bin/aproxy
