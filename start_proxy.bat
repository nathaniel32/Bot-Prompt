@echo off
start tor -f "./tor/torrc1" --DataDirectory "./tor/data/1"
start tor -f "./tor/torrc2" --DataDirectory "./tor/data/2"
start tor -f "./tor/torrc3" --DataDirectory "./tor/data/3"