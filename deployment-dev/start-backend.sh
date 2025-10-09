#!/bin/bash

# Backend Start Script
# Starts the FastAPI pivot backend server with uv

set -e  # Exit on error

echo "=========================================="
echo "Starting Pivot Backend API"
echo "=========================================="

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "📦 uv not found, installing uv..."
    # Install uv using the official installer
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    else
        # Linux/macOS
        curl -LsSf https://astral.sh/uv/install.sh | sh
    fi
    
    # Add uv to PATH for current session
    if [ -d "$HOME/.cargo/bin" ]; then
        export PATH="$HOME/.cargo/bin:$PATH"
    fi
    
    # Verify installation
    if ! command -v uv &> /dev/null; then
        echo "❌ Error: Failed to install uv. Please install manually from https://docs.astral.sh/uv/getting-started/installation/"
        exit 1
    fi
    echo "✅ uv installed successfully"
else
    echo "✅ Found uv: $(uv --version)"
fi

# Detect Python command (python3 or python)
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python is not installed or not in PATH"
    exit 1
fi

# Python version check
PYTHON_VERSION=$($PYTHON_CMD -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Found Python $PYTHON_VERSION (using command: $PYTHON_CMD)"

# Check if Python version is 3.9+
MAJOR_VERSION=$($PYTHON_CMD -c 'import sys; print(sys.version_info[0])')
MINOR_VERSION=$($PYTHON_CMD -c 'import sys; print(sys.version_info[1])')

if [[ "$MAJOR_VERSION" -lt 3 ]] || [[ "$MAJOR_VERSION" -eq 3 && "$MINOR_VERSION" -lt 9 ]]; then
    echo "❌ Error: Python 3.9+ is required, but found Python $PYTHON_VERSION"
    exit 1
fi

# Sync dependencies using uv (creates venv automatically if needed)
echo "📦 Syncing dependencies with uv (from pyproject.toml)..."
uv sync

# Check if data exists
if [ ! -d "data" ] || [ -z "$(ls -A data/*.duckdb 2>/dev/null)" ]; then
    echo "⚠️  Sample data not found. Creating sample data..."
    if [ -f "create_sample_data.py" ]; then
        uv run create_sample_data.py
    else
        echo "⚠️  create_sample_data.py not found, skipping sample data creation"
    fi
fi

# Start the server
echo ""
echo "=========================================="
echo "🚀 Starting FastAPI server on http://localhost:8126"
echo "   Press CTRL+C to stop"
echo "=========================================="
echo ""
uv run pivot_api.py