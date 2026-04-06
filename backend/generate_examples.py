import zipfile
import json
import os

def create_zip(name, files):
    os.makedirs("examples", exist_ok=True)
    path = os.path.join("examples", name)
    with zipfile.ZipFile(path, 'w') as z:
        for filename, content in files.items():
            z.writestr(filename, content)
    print(f"Created: {path}")

# 1. Real-World Enterprise App V1
# Demonstrates mixed external dependencies and specialized in-house modules
v1_files = {
    "package.json": json.dumps({
        "name": "verix-enterprise",
        "version": "1.0.0",
        "dependencies": {
            "express": "4.17.1",
            "axios": "0.21.1",
            "dotenv": "10.0.0",
            "lodash": "4.17.21"
        }
    }, indent=2),
    "src/index.js": "const express = require('express');\const auth = require('./auth/service');",
    "src/auth/service.js": "// Internal Auth Logic\nmodule.exports = { login: () => {} };",
    "src/auth/roles.js": "// Internal Role Management",
    "src/database/connection.js": "// Custom Database Wrapper",
    "src/database/models.js": "// Database Schema",
    "src/utils/logger.js": "// Proprietary Logging System",
    "README.md": "# Verix Enterprise V1"
}
create_zip("enterprise-app-v1.zip", v1_files)

# 2. Real-World Enterprise App V2 (Version Drift)
# Demonstrates updates, removals, and NEW in-house module development
v2_files = {
    "package.json": json.dumps({
        "name": "verix-enterprise",
        "version": "1.1.0",
        "dependencies": {
            "express": "4.18.2", # Updated
            "axios": "1.6.0",    # Updated
            "helmet": "7.1.0",   # Added
            "spring-web": "5.3.18" # Added (Vulnerable)
        }
    }, indent=2),
    "src/index.js": "const express = require('express');\const payments = require('./payment/gateway');",
    "src/auth/service.js": "// Updated Auth Logic",
    "src/auth/roles.js": "// Internal Role Management",
    "src/database/connection.js": "// Custom Database Wrapper",
    "src/payment/gateway.js": "// New Payment Integration Module",
    "src/payment/stripe.js": "// Stripe Connector",
    "src/payment/paypal.js": "// PayPal Connector",
    "src/utils/logger.js": "// Proprietary Logging System",
    "docs/architecture.txt": "V1.1 uses new payment layer."
}
create_zip("enterprise-app-v2.zip", v2_files)

# 3. Vulnerable Legacy Project (Full of Issues)
# Demonstrates high risk scores and red-flag explanations
vuln_files = {
    "requirements.txt": "log4j==2.14.1\nrequest==2.25.1\ndjango==1.11.29\nold-util==0.1.0",
    "app.py": "import log4j\nprint('starting legacy app')",
    "legacy/crypto.py": "// Use of MD5 (In-house but insecure)",
    "legacy/utils.py": "// Deprecated utils",
    "external/vendor-lib.js": "// Unlicensed vendor code"
}
create_zip("vulnerable-legacy.zip", vuln_files)

# 4. Clean Modern Template
safe_files = {
    "package.json": json.dumps({
        "dependencies": {
            "react": "18.2.0",
            "next": "14.1.0",
            "lucide-react": "0.330.0"
        }
    }, indent=2),
    "src/components/Button.tsx": "export const Button = () => <button />",
    "src/app/page.tsx": "import { Button } from '@/components/Button'"
}
create_zip("safe-modern.zip", safe_files)
