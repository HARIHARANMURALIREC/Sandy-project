#!/usr/bin/env python3
"""
Test script to verify Rights 360 application setup
Run this to check if everything is configured correctly
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def test_file_structure():
    """Test if all required files are present"""
    print("🔍 Testing file structure...")
    
    required_files = [
        "backend/main.py",
        "backend/requirements.txt",
        "backend/database.py",
        "frontend/package.json",
        "frontend/app/layout.tsx",
        "frontend/app/page.tsx",
        "README.md"
    ]
    
    missing_files = []
    for file_path in required_files:
        full_path = Path(file_path)
        if not full_path.exists():
            missing_files.append(file_path)
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    print("✅ All required files present!")
    return True

def test_python_environment():
    """Test Python environment"""
    print("\n🐍 Testing Python environment...")
    
    python_version = sys.version_info
    print(f"Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    if python_version < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    
    print("✅ Python version OK")
    return True

def test_node_environment():
    """Test Node.js environment"""
    print("\n📦 Testing Node.js environment...")
    
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js: {result.stdout.strip()}")
        else:
            print("❌ Node.js not found")
            return False
            
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm: {result.stdout.strip()}")
            return True
        else:
            print("❌ npm not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not installed")
        return False

def test_backend_dependencies():
    """Test backend dependencies availability"""
    print("\n🔧 Testing backend dependencies...")
    
    # Check if requirements.txt exists and has content
    req_file = Path("backend/requirements.txt")
    if not req_file.exists():
        print("❌ requirements.txt not found")
        return False
    
    with open(req_file) as f:
        requirements = f.read().strip()
    
    if not requirements:
        print("❌ requirements.txt is empty")
        return False
    
    print("✅ requirements.txt found with dependencies")
    
    # Test if we can import basic modules (if installed)
    test_imports = [
        ("fastapi", "FastAPI"),
        ("sqlalchemy", "SQLAlchemy"),
        ("google.generativeai", "Gemini AI")
    ]
    
    for module, name in test_imports:
        try:
            __import__(module)
            print(f"✅ {name} available")
        except ImportError:
            print(f"⚠️  {name} not installed (run: pip install -r backend/requirements.txt)")
    
    return True

def test_frontend_config():
    """Test frontend configuration"""
    print("\n⚛️  Testing frontend configuration...")
    
    package_json = Path("frontend/package.json")
    if not package_json.exists():
        print("❌ package.json not found")
        return False
    
    try:
        with open(package_json) as f:
            pkg_data = json.load(f)
        
        required_deps = ["next", "react", "typescript"]
        missing_deps = [dep for dep in required_deps if dep not in pkg_data.get("dependencies", {})]
        
        if missing_deps:
            print(f"⚠️  Missing dependencies: {missing_deps}")
        else:
            print("✅ Core dependencies in package.json")
        
        return True
        
    except json.JSONDecodeError:
        print("❌ Invalid package.json")
        return False

def test_environment_files():
    """Test environment configuration files"""
    print("\n🔐 Testing environment files...")
    
    env_files = [
        "backend/env.example",
        "frontend/env.example"
    ]
    
    for env_file in env_files:
        if Path(env_file).exists():
            print(f"✅ {env_file} found")
        else:
            print(f"⚠️  {env_file} missing")
    
    # Check if actual .env exists (should not be committed)
    backend_env = Path("backend/.env")
    if backend_env.exists():
        print("⚠️  backend/.env exists (should not be committed to git)")
    else:
        print("✅ No backend/.env file (copy from env.example)")
    
    return True

def main():
    """Run all tests"""
    print("🚀 Rights 360 Application Test Suite")
    print("=" * 50)
    
    tests = [
        test_file_structure,
        test_python_environment,
        test_node_environment,
        test_backend_dependencies,
        test_frontend_config,
        test_environment_files
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Application should be ready to run.")
        print("\n🚀 Next steps:")
        print("1. cd backend && pip install -r requirements.txt")
        print("2. cd frontend && npm install")
        print("3. Set up environment files (.env)")
        print("4. cd backend && python init_db.py")
        print("5. Start the servers!")
    else:
        print("⚠️  Some tests failed. Please address the issues above.")

if __name__ == "__main__":
    main()
