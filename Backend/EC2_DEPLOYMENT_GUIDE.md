# FoodFlow Backend - AWS EC2 Deployment Guide

This guide provides step-by-step instructions to configure an **AWS EC2 instance** and set up **GitHub Secrets** for automated CI/CD deployment using the GitHub Actions workflow (`.github/workflows/ci-cd-backend.yml`).

---

## 1. AWS EC2 Instance Setup

### Step 1.1: Launch an EC2 Instance
- **OS**: Ubuntu 22.04 LTS or Ubuntu 24.04 LTS (recommended)
- **Instance Type**: `t2.micro` or `t3.micro` (Free Tier eligible)
- **Security Group Rules**:
  | Type | Protocol | Port Range | Source | Purpose |
  | --- | --- | --- | --- | --- |
  | SSH | TCP | 22 | My IP or Any (`0.0.0.0/0`) | Deployment & SSH Access |
  | Custom TCP | TCP | 5000 | Any (`0.0.0.0/0`) | Backend API direct access |
  | HTTP | TCP | 80 | Any (`0.0.0.0/0`) | Nginx Reverse Proxy (Optional) |
  | HTTPS | TCP | 443 | Any (`0.0.0.0/0`) | SSL/TLS (Optional) |

---

### Step 1.2: Connect and Install Prerequisites on EC2
Connect to your instance via SSH:
```bash
ssh -i /path/to/your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Update packages and install **Node.js 20**, **rsync**, and **PM2**:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl rsync git

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should output v20.x.x
npm -v   # Should output 10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Enable PM2 to auto-start on boot
pm2 startup
# (Run the command outputted by `pm2 startup` if instructed)
```

---

### Step 1.3: Prepare Deployment Directory & Permissions
Create the target directory (default `/var/www/foodflow-backend`) and assign ownership to the SSH user (`ubuntu`):
```bash
sudo mkdir -p /var/www/foodflow-backend
sudo chown -R $USER:$USER /var/www/foodflow-backend
```

---

### Step 1.4: Create `.env` Environment File on EC2
Navigate to the directory and create the `.env` file containing production secrets:
```bash
cd /var/www/foodflow-backend
nano .env
```

Paste your backend environment variables (refer to `.env.example`):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/foodflow?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_key_here
ADMIN_DEFAULT_PASSWORD=YourSecureAdminPassword
GEMINI_API_KEY=your_production_gemini_api_key

# Email SMTP configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=alerts@foodflow.org
```

---

## 2. GitHub Repository Secrets Setup

Navigate to your GitHub Repository:
**Settings > Secrets and variables > Actions > New repository secret**

Add the following required secrets:

| Secret Name | Description / Example Value |
| --- | --- |
| `EC2_HOST` | Public IP Address or DNS of your EC2 instance (e.g. `54.210.12.34` or `ec2-xxx.compute-1.amazonaws.com`) |
| `EC2_USER` | SSH username (e.g. `ubuntu` for Ubuntu AMI, `ec2-user` for Amazon Linux) |
| `EC2_SSH_KEY` | Entire content of your private key `.pem` file including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` |
| `EC2_TARGET_DIR` | *(Optional)* Target directory path (defaults to `/var/www/foodflow-backend` if left empty) |

---

## 3. How the CI/CD Pipeline Works

When code is pushed to `main` or `master` (or triggered manually via **Workflow Dispatch**):

1. **Job 1 (`test-and-build`)**:
   - Checks out the repository.
   - Installs Node modules and runs `npm run build` (TypeScript compiler `tsc`).
   - Runs `npm test` to verify code health before deployment.

2. **Job 2 (`deploy-to-ec2`)**:
   - Authenticates to EC2 via SSH key.
   - Uses `rsync` to synchronize `Backend/` files to EC2 (skipping `node_modules` & local build cache).
   - Runs `npm install` on EC2.
   - Builds TypeScript on EC2 (`npm run build`).
   - Restarts application using PM2 process manager (`pm2 restart foodflow-backend || pm2 start dist/server.js --name foodflow-backend`).

---

## 4. Useful PM2 Management Commands on EC2

Log in to EC2 and use the following commands to manage your backend server:

- **Check server status**:
  ```bash
  pm2 status
  ```
- **View live logs**:
  ```bash
  pm2 logs foodflow-backend
  ```
- **Restart service**:
  ```bash
  pm2 restart foodflow-backend
  ```
- **Stop service**:
  ```bash
  pm2 stop foodflow-backend
  ```

---

## 5. Nginx Reverse Proxy & Certbot SSL Setup

To run your backend API securely over standard HTTP (`80`) and **HTTPS (`443`)** with a free Let's Encrypt SSL certificate, follow these steps:

---

### Step 5.1: Install Nginx & Certbot on EC2

Log into your EC2 instance via SSH and run:

```bash
# Update repositories and install Nginx
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Verify Nginx status
sudo systemctl status nginx
```

---

### Step 5.2: Configure Nginx Site Profile

1. Copy the included Nginx config file or create a new profile at `/etc/nginx/sites-available/foodflow`:

```bash
sudo cp /var/www/foodflow-backend/nginx/foodflow.conf /etc/nginx/sites-available/foodflow
```

2. Edit the server name to match your domain name or EC2 Public DNS:
```bash
sudo nano /etc/nginx/sites-available/foodflow
```
*Change `server_name api.yourdomain.com;` to your actual domain name (e.g. `api.foodflow.org` or `ec2-xx-xx-xx-xx.compute-1.amazonaws.com`).*

3. Enable the site configuration and test syntax:
```bash
# Link to sites-enabled
sudo ln -sf /etc/nginx/sites-available/foodflow /etc/nginx/sites-enabled/

# Remove default Nginx site configuration if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration for syntax errors
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx
```

---

### Step 5.3: Obtain Free SSL Certificate via Certbot

Make sure your domain's DNS `A Record` points to your EC2 Public IP address before running Certbot.

Run Certbot with the Nginx plugin:

```bash
sudo certbot --nginx -d api.yourdomain.com
```

**During the interactive setup:**
1. Enter your email address for urgent renewal notices.
2. Agree to the Terms of Service (`Y`).
3. Select whether to redirect HTTP traffic to HTTPS (Choose **Option 2: Redirect - Make all requests redirect to secure HTTPS access**).

Certbot will automatically obtain the certificate, configure SSL in `/etc/nginx/sites-available/foodflow`, and reload Nginx!

---

### Step 5.4: Test SSL Auto-Renewal

Let's Encrypt certificates are valid for 90 days. Certbot automatically creates a systemd timer or cron job for auto-renewal. Test that renewal works correctly:

```bash
sudo certbot renew --dry-run
```

If the dry run succeeds, your SSL certificates will renew automatically without manual intervention!

