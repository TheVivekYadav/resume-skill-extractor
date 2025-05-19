#!/bin/bash

echo "Starting RQ worker with scheduler..."
rq worker --with-scheduler --url redis://valkey:6379
