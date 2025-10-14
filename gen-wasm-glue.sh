#! /usr/bin/env bash

# Builds webassembly binary and generates wrapper JS code to run it

cargo build --release
wasm-bindgen --target web --out-dir frontend/assets target/wasm32-unknown-unknown/release/light_simulation.wasm