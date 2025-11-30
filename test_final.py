try:
    import flask
    import requests
    from bs4 import BeautifulSoup
    import openpyxl
    print("✅ All imports successful!")
    
    # Test BeautifulSoup with html.parser
    html = "<div><h1>Test</h1></div>"
    soup = BeautifulSoup(html, 'html.parser')
    print("✅ BeautifulSoup with html.parser works!")
    
    # Test requests
    response = requests.get("https://httpbin.org/json", timeout=10)
    print(f"✅ HTTPS requests work! Status: {response.status_code}")
    
    print("🎉 Everything is ready! You can run: python app.py")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Other error: {e}")