#!/bin/bash
set -e
echo "🚀 Installing Tejas — AI Operating System"
OS=$(uname -s 2>/dev/null || echo "Windows")
case "$OS" in
  Linux*)
    echo "[Linux detected]"
    if ! command -v node &>/dev/null; then
      curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
      sudo apt-get install -y nodejs
    fi
    # Computer Use tools
    sudo apt-get install -y xdotool scrot 2>/dev/null || true
    ;;
  Darwin*)
    echo "[macOS detected]"
    command -v brew || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    brew install node 2>/dev/null || true
    ;;
esac
cd "$(dirname "$0")"
npm install
echo ""
echo "✅ Tejas installed successfully!"
echo "Run: node bin/tejas.js setup"
echo "Then: node bin/tejas.js \"hello\""
