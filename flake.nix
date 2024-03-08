{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, rust-overlay, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [ (import rust-overlay) ];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          mesa
          alsa-lib
          glfw
          libGL
          libdrm
          xorg.libX11
          xorg.libXi

          pkg-config
          rust-bin.stable.latest.default
        ];
      };
    }
  );
}
