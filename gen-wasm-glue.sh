#! /usr/bin/env bash

# Builds webassembly binary and generates wrapper JS code to run it

cargo build --release
wasm-bindgen --target bundler --out-dir packages/app/lib/wasm target/wasm32-unknown-unknown/release/light_simulation.wasm