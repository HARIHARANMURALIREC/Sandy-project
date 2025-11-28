#!/bin/bash

echo "========================================="
echo "   RIGHTS 360 - SYSTEM STATUS CHECK"
echo "========================================="
echo ""

# Check Backend
echo "🔧 BACKEND STATUS (Port 8000):"
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend API is RUNNING"
    echo "   Response: $(curl -s http://localhost:8000/ | python3 -c "import sys, json; print(json.load(sys.stdin)['message'])")"
else
    echo "❌ Backend API is NOT RUNNING"
fi
echo ""

# Check Frontend
echo "🎨 FRONTEND STATUS (Port 5173):"
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ Frontend is RUNNING"
    echo "   Title: $(curl -s http://localhost:5173/ | grep -o '<title>.*</title>' | sed 's/<[^>]*>//g')"
else
    echo "❌ Frontend is NOT RUNNING"
fi
echo ""

# Check Processes
echo "📊 RUNNING PROCESSES:"
echo ""
echo "Vite Process:"
ps aux | grep "node.*vite" | grep -v grep | awk '{print "   PID: "$2" - "$11" "$12" "$13}' | head -1
echo ""
echo "Python Process:"
ps aux | grep "Python.*main.py" | grep -v grep | awk '{print "   PID: "$2" - "$11" "$12}' | head -1
echo ""

# Check Ports
echo "🔌 PORT STATUS:"
netstat -an | grep -E ":(5173|8000)" | grep LISTEN | while read line; do
    echo "   $line"
done
echo ""

echo "========================================="
echo "   ACCESS YOUR APPLICATION:"
echo "========================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "🔑 Login Credentials:"
echo "   Admin:     admin / admin123"
echo "   Test User: testuser / test123"
echo ""
echo "========================================="
