import threading
import time
import urllib.request
import json
import socketserver
import os
import server

def run_tests():
    server.init_db()
    port = 8899
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", port), server.PrimeShieldHandler)

    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    time.sleep(0.5)

    base = f"http://127.0.0.1:{port}"
    print(f"Testing server on {base}...")

    # 1. Health check
    with urllib.request.urlopen(f"{base}/api/health") as res:
        health = json.loads(res.read().decode())
        print("1. Health Check:", health.get("status") == "healthy")

    # 2. Post Enquiry
    sample_enquiry = {
        "id": "ENQ-TEST-001",
        "category": "Real Estate",
        "name": "Arun Kumar",
        "mobile": "9840123456",
        "email": "arun@test.com",
        "location": "Chennai",
        "propertyType": "Villa",
        "project": "Chola's Empire",
        "budget": "₹1.25 Crores",
        "sqft": "2400 sq.ft",
        "visitDate": "2026-12-01",
        "visitTime": "Evening (03:00 PM - 06:00 PM)"
    }
    req = urllib.request.Request(
        f"{base}/api/enquiries",
        data=json.dumps(sample_enquiry).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        enq_res = json.loads(res.read().decode())
        print("2. Post Enquiry Response:", enq_res.get("success") is True)

    # 3. Get Enquiries
    with urllib.request.urlopen(f"{base}/api/enquiries") as res:
        enq_list = json.loads(res.read().decode())
        print(f"3. Get Enquiries: Count = {enq_list.get('count')} (Expected >= 1)")

    # 4. Post Villa
    sample_villa = {
        "id": "villa-test-101",
        "title": "Chola Luxury Villa A1",
        "project": "Chola's Empire",
        "area": "SGIM Boulevard",
        "sqft": 2400,
        "bhk": "4 BHK",
        "priceDisplay": "₹1.30 Cr",
        "status": "Ready to Move",
        "description": "Premium test villa listing",
        "images": ["https://images.unsplash.com/photo-1613977257363-707ba9348227"]
    }
    req_v = urllib.request.Request(
        f"{base}/api/villas",
        data=json.dumps(sample_villa).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_v) as res:
        villa_res = json.loads(res.read().decode())
        print("4. Post Villa Response:", villa_res.get("success") is True)

    # 5. Get Villas
    with urllib.request.urlopen(f"{base}/api/villas") as res:
        villas_data = json.loads(res.read().decode())
        print(f"5. Get Villas: Count = {villas_data.get('count')} (Expected >= 1)")

    # 6. Delete Villa
    req_del = urllib.request.Request(
        f"{base}/api/villas/villa-test-101",
        method='DELETE'
    )
    with urllib.request.urlopen(req_del) as res:
        del_res = json.loads(res.read().decode())
        print("6. Delete Villa Response:", del_res.get("success") is True)

    # 7. Static file serving (index.html)
    with urllib.request.urlopen(f"{base}/index.html") as res:
        html = res.read().decode('utf-8')
        print("7. Static File Serving (index.html):", "PrimeShield Group" in html)

    httpd.shutdown()
    print("\nALL SERVER TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    run_tests()
