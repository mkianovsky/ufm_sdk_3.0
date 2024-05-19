#!/bin/bash -x
CONFIG_FILE="/config/pdr_deterministic.conf"
sudo mkdir -p /config
sudo cp -f plugins/pdr_deterministic_plugin/build/config/pdr_deterministic.conf "$CONFIG_FILE"
sed -i -e 's/\nTEST_MODE=True\n//g' "$CONFIG_FILE"
echo -e '\n[Common]\nTEST_MODE=True\n' >> "$CONFIG_FILE"
sed -i -e 's/DRY_RUN=False/DRY_RUN=True/g' "$CONFIG_FILE"
sed -i -e 's/INTERVAL=300/INTERVAL=10/g' "$CONFIG_FILE"
sed -i -e 's/CONFIGURED_TEMP_CHECK=False/CONFIGURED_TEMP_CHECK=True/g' "$CONFIG_FILE"
sed -i -e 's/DEISOLATE_CONSIDER_TIME=5/DEISOLATE_CONSIDER_TIME=1/g' "$CONFIG_FILE"

python plugins/pdr_deterministic_plugin/ufm_sim_web_service/isolation_algo.py