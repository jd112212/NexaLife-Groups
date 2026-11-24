#!/usr/bin/env python3
"""
PrimeShield Group - Advisory Platform Server
Built using Python 3 standard library (no pip dependencies required).
Provides static asset serving, SQLite persistence for enquiries & villa listings,
and WhatsApp notification dispatch helpers for Founder Teekaraman.P.
"""

import http.server
import socketserver
import os
import sys
import json
import sqlite3
import urllib.parse
from datetime import datetime

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'primeshield.db')
OWNER_PHONE = "919962699649"
OWNER_NAME = "Teekaraman.P"

def init_db():
    """Initializes SQLite database and creates tables if they don't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Enquiries table (Real estate and insurance leads)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS enquiries (
            id TEXT PRIMARY KEY,
            category TEXT,
            name TEXT,
            mobile TEXT,
            email TEXT,
            location TEXT,
            property_type TEXT,
            project TEXT,
            budget TEXT,
            sqft TEXT,
            insurer TEXT,
            insurance_type TEXT,
            income_source TEXT,
            profession TEXT,
            visit_date TEXT,
            visit_time TEXT,
            raw_payload TEXT,
            created_at TEXT
        )
    """)

    # Villa listings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS villas (
            id TEXT PRIMARY KEY,
            title TEXT,
            project TEXT,
            area TEXT,
            sqft INTEGER,
            bhk TEXT,
            price_display TEXT,
            status TEXT,
            description TEXT,
            images_json TEXT,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()
    print(f"[PrimeShield DB] SQLite database verified at {DB_FILE}")

class PrimeShieldHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler supporting REST API endpoints and static file serving."""

    def end_headers(self):
        # Enable CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, status_code, data):
        body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/health':
            self.send_json(200, {
                "status": "healthy",
                "brand": "PrimeShield Group",
                "founder": OWNER_NAME,
                "timestamp": datetime.now().isoformat()
            })
            return

        if path == '/api/enquiries':
            self.handle_get_enquiries()
            return

        if path == '/api/villas':
            self.handle_get_villas()
            return

        # Serve static files
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        
        try:
            payload = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}
        except Exception as e:
            self.send_json(400, {"error": f"Invalid JSON payload: {str(e)}"})
            return

        if path == '/api/enquiries':
            self.handle_post_enquiry(payload)
            return

        if path == '/api/villas':
            self.handle_post_villa(payload)
            return

        self.send_json(404, {"error": "Endpoint not found"})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/villas/'):
            villa_id = path.split('/')[-1]
            self.handle_delete_villa(villa_id)
            return

        self.send_json(404, {"error": "Endpoint not found"})

    def handle_get_enquiries(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM enquiries ORDER BY created_at DESC")
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
        conn.close()
        self.send_json(200, {"count": len(result), "enquiries": result})

    def handle_post_enquiry(self, data):
        enq_id = data.get('id') or f"ENQ-{int(datetime.now().timestamp()*1000)}"
        category = data.get('category', 'General')
        name = data.get('name', '')
        mobile = data.get('mobile', '')
        email = data.get('email', '')
        location = data.get('location', '')
        prop_type = data.get('propertyType', '')
        project = data.get('project', '')
        budget = data.get('budget', '')
        sqft = data.get('sqft', '')
        insurer = data.get('insurer', '')
        ins_type = data.get('insuranceType', '')
        income = data.get('incomeSource', '')
        profession = data.get('profession', '')
        visit_date = data.get('visitDate', '')
        visit_time = data.get('visitTime', '')
        now = datetime.now().isoformat()

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO enquiries (
                id, category, name, mobile, email, location,
                property_type, project, budget, sqft,
                insurer, insurance_type, income_source, profession,
                visit_date, visit_time, raw_payload, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            enq_id, category, name, mobile, email, location,
            prop_type, project, budget, sqft,
            insurer, ins_type, income, profession,
            visit_date, visit_time, json.dumps(data), now
        ))
        conn.commit()
        conn.close()

        # Generate WhatsApp prefilled message notification link for the owner
        if category == 'Real Estate':
            msg = (
                f"*NEW REAL ESTATE LEAD - PrimeShield Group*\n"
                f"Client: {name}\n"
                f"Mobile: +91 {mobile}\n"
                f"Email: {email}\n"
                f"Location: {location}\n"
                f"Requirement: {prop_type} at {project}\n"
                f"Budget: {budget} | SqFt: {sqft}\n"
                f"Site Visit Date: {visit_date} ({visit_time})\n"
            )
        else:
            msg = (
                f"*NEW INSURANCE LEAD - PrimeShield Group*\n"
                f"Client: {name}\n"
                f"Mobile: +91 {mobile}\n"
                f"Email: {email}\n"
                f"Location: {location}\n"
                f"Insurer: {insurer} ({ins_type})\n"
                f"Profession: {profession} | Income: {income}\n"
                f"Consultation Date: {visit_date} ({visit_time})\n"
            )

        encoded_msg = urllib.parse.quote(msg)
        whatsapp_url = f"https://wa.me/{OWNER_PHONE}?text={encoded_msg}"

        print("\n" + "="*60)
        print(f"[NEW ENQUIRY RECEIVED] Category: {category} | Client: {name} (+91 {mobile})")
        print(f"Recorded in SQLite table 'enquiries'")
        print(f"WhatsApp Dispatch Link: {whatsapp_url}")
        print("="*60 + "\n")

        self.send_json(201, {
            "success": True,
            "id": enq_id,
            "whatsapp_url": whatsapp_url,
            "message": "Enquiry stored successfully and dispatch link prepared."
        })

    def handle_get_villas(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM villas ORDER BY created_at DESC")
        rows = cursor.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            try:
                d['images'] = json.loads(d.get('images_json', '[]'))
            except:
                d['images'] = []
            result.append(d)
        conn.close()
        self.send_json(200, {"count": len(result), "villas": result})

    def handle_post_villa(self, data):
        villa_id = data.get('id') or f"villa-{int(datetime.now().timestamp()*1000)}"
        title = data.get('title', 'Luxury Villa')
        project = data.get('project', "Chola's Empire")
        area = data.get('area', 'SGIM')
        sqft = int(data.get('sqft', 2000))
        bhk = data.get('bhk', '4 BHK Duplex')
        price = data.get('priceDisplay', '₹1.15 Crores')
        status = data.get('status', 'Ready to Move')
        desc = data.get('description', '')
        images = data.get('images', [])
        now = datetime.now().isoformat()

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO villas (
                id, title, project, area, sqft, bhk, price_display,
                status, description, images_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            villa_id, title, project, area, sqft, bhk, price,
            status, desc, json.dumps(images), now
        ))
        conn.commit()
        conn.close()

        print(f"[VILLA SAVED] ID: {villa_id} | Title: {title} in {project}")
        self.send_json(200, {"success": True, "id": villa_id})

    def handle_delete_villa(self, villa_id):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM villas WHERE id = ?", (villa_id,))
        conn.commit()
        conn.close()
        print(f"[VILLA DELETED] ID: {villa_id}")
        self.send_json(200, {"success": True, "deleted_id": villa_id})

def run_server():
    init_db()
    # Change working dir to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PrimeShieldHandler) as httpd:
        print(f"-------------------------------------------------------------")
        print(f" PrimeShield Group Advisory Platform")
        print(f" Founder: {OWNER_NAME}")
        print(f" Local Web Server running at: http://localhost:{PORT}")
        print(f" Direct file preview available by opening index.html in any browser")
        print(f"-------------------------------------------------------------")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
