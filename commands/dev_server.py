import http.server
import socketserver
import os
import sys

# --- CONFIGURATION ---
PORT = 5000
# Root directory of the frontend relative to this script
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

class MedcoreHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom handler to kill browser caching and enable CORS for local development.
    """
    def end_headers(self):
        # 1. Disable Caching Completely
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')

        # 2. Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')

        super().end_headers()

    def log_message(self, format, *args):
        # Optional: Print to console for visibility
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format%args))

if __name__ == "__main__":
    # Change working directory to frontend folder
    if not os.path.exists(FRONTEND_DIR):
        print(f"❌ Error: Frontend directory not found at {FRONTEND_DIR}")
        sys.exit(1)

    os.chdir(FRONTEND_DIR)

    # Allow port reuse (prevents "Address already in use" errors on restart)
    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer(("", PORT), MedcoreHandler) as httpd:
        print("==========================================")
        print(f"🚀 MEDCORE DEV SERVER RUNNING")
        print(f"📂 Root: {FRONTEND_DIR}")
        print(f"🌐 URL:  http://localhost:{PORT}/pages/login.html")
        print("------------------------------------------")
        print("🛡️  CORS:   ENABLED")
        print("🛑 CACHE:  DISABLED")
        print("==========================================")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Dev Server stopped.")
            httpd.shutdown()
