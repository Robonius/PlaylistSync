#!/bin/bash
bun run dev > dev.log 2>&1 &
DEV_PID=$!
sleep 5
# verify frontend instructions
