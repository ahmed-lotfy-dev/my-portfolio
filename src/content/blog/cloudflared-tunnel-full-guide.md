---
title: "Cloudflared Tunnel Full Guide"
title_ar: "دليل كامل ل Cloudflared Tunnel"
slug: cloudflared-tunnel-full-guide
date: 2026-01-30
categories: ["development"]
reading_time: "3 min read"
featured: true
---

# How I Secured My Projects with Cloudflare Tunnel: A Step-by-Step Guide

As a senior full-stack software engineer, I've been working with various projects, including selfTracker, TaskHub, and Zamalek Store, and I've learned that security is a top priority. One of the most effective ways to secure my applications is by using Cloudflare Tunnel, which creates an outbound connection from my machine to Cloudflare without opening any ports.

## Why Cloudflare Tunnel Matters

Cloudflare Tunnel is a game-changer for developers who want to secure their applications without exposing their server IP. By creating a tunnel between my machine and Cloudflare, I can ensure that my application is protected from external attacks. Moreover, with Cloudflare Tunnel, I don't need to worry about opening ports or configuring firewalls, making it a hassle-free solution.

## Installing cloudflared

To get started with Cloudflare Tunnel, I need to install cloudflared on my machine. On Windows, I can use winget to install cloudflared:

```bash
winget install Cloudflare.cloudflared
```

Alternatively, I can download the binary from Cloudflare and add it to my PATH. To verify the installation, I can run:

```bash
cloudflared --version
```

On Linux, I can install cloudflared using the following commands:

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install cloudflared
```

## Authenticating with Cloudflare

To link my machine to my Cloudflare account, I need to authenticate using cloudflared:

```bash
cloudflared tunnel login
```

This will open a browser window where I can choose the domain I want to use with Cloudflare Tunnel. After successful authentication, a cert file will be stored locally, which is critical for creating and running the tunnel.

## Creating and Configuring the Tunnel

To create a tunnel, I can run:

```bash
cloudflared tunnel create my-tunnel
```

This will generate a tunnel UUID and credentials JSON file, which I need to configure in my `config.yml` file.

Here's an example `config.yml` file:

```yml
tunnel: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: /full/path/to/credentials.json
ingress:
  - hostname: app.example.com
    service: http://localhost:3000
  - service: http_status:404
```

## DNS Routing and Running the Tunnel

To route DNS traffic to the tunnel, I need to create a CNAME record that points to the tunnel:

```bash
cloudflared tunnel route dns my-tunnel app.example.com
```

Finally, I can run the tunnel using:

```bash
cloudflared tunnel run my-tunnel
```

## Backing Up and Migrating the Tunnel

To back up and migrate the tunnel to another machine, I need to copy the following files:

* `cert.pem`
* `config.yml`
* `tunnel-UUID.json`

I can then install cloudflared on the new machine, copy the files to the same directory, and run the tunnel using:

```bash
cloudflared tunnel run my-tunnel
```

No new tunnel creation is needed, and the same tunnel can be used on multiple machines.

## Security Notes and Best Practices

When working with Cloudflare Tunnel, it's essential to treat the `cert.pem` file like a private key and store backups encrypted. Additionally, I should be aware that anyone with the `cert.pem` and `credentials.json` files can run my tunnel.

## Conclusion

By following these steps and best practices, I can secure my applications and ensure a hassle-free development experience. Whether I'm working on selfTracker, TaskHub, or any other project, Cloudflare Tunnel provides a reliable and secure solution for protecting my applications.
