---
title: "الدليل الشامل لـ Cloudflare Tunnel باستخدام cloudflared"
description: "الدليل الشامل لـ Cloudflare Tunnel مع cloudflared — تثبيت، إعداد، ترحيل، و backup. بيشتغل على Windows و Linux."
excerpt: "كل محتاج تعرفه عن Cloudflare Tunnel: تثبيت، إعداد، ترحيل، backups. بدون بورتات مفتوحة."
date: 2026-01-30
updated: 2026-01-30
image: /images/blogs/cloudflare-tunnel.jpg
tags:
  - cloudflare
  - cloudflared
  - networking
  - security
  - devops
  - tutorial
share: true
featured: true
---

# الدليل الشامل لـ Cloudflare Tunnel باستخدام cloudflared

لو انت مطور بتشتغل على مشاريع حقيقية، غالباً واجهتك المشكلة دي: عايز تخلي الـ local server بتاعك متاح على الإنترنت. يا إما عشان تختبر webhook من Stripe، يا إما عشان توري حد الـ API بتاعك، يا إما عشان تجرب OAuth callback.

الطريقة القديمة؟ تفتح ports على الـ router، وتبدأ تلعب في إعدادات الـ firewall. وده مش بس متعب — ده خطر أمنياً.

cloudflared بيحل المشكلة دي بشكل مختلف تماماً. بدل ما انت "تستنى" الاتصال من بره، الـ machine بتاعتاك هي اللي بتعمل اتصال خارجي لـ Cloudflare. مفيش port مفتوح. مفيش firewall محتاع تعديل. كل حاجة بتتم من خلال outbound connection.

أنا بستخدم الطريقة دي في نشر مشاريع العملاء — مفيش ports مفتوحة، كل الداتا ماشية من خلال Cloudflare edge. والبلوج اللي بتقرأه دلوقتي شغال بنفس الطريقة.

---

## إزاي الـ cloudflared بيشتغل فعلياً؟

cloudflared مش server — ده client.

تخيل الموضوع كده:

1. التطبيق بتاعك شغال على `localhost:8000`
2. cloudflared قاعد جنبه وبيعمل dial out لـ Cloudflare (بيبني "pipe")
3. الزائر بيفتح `api.yourdomain.com`
4. Cloudflare بيبعت الـ traffic من الـ pipe لجهازك

مفيش port مفتوح. الـ DNS بيشير للـ tunnel مش للـ IP.

---

## المتطلبات

- حساب على Cloudflare
- دومين مضاف على Cloudflare
- cloudflared متثبت

---

## تثبيت cloudflared

### على Windows

```bash
winget install Cloudflare.cloudflared
```

أو نزل الـ binary من موقع Cloudflare وحطه في الـ PATH.

التحقق:

```bash
cloudflared --version
```

### على Linux (Debian/Ubuntu)

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install cloudflared
```

التحقق:

```bash
cloudflared --version
```

---

## تسجيل الدخول لـ Cloudflare

الخطوة دي بتربط جهازك بحساب Cloudflare:

```bash
cloudflared tunnel login
```

هيفتح browser، اختار الدومين. بعد ما يخلص، ملف الـ certificate هيتحفظ محلياً.

أماكن الملف:
- Windows: `%USERPROFILE%\.cloudflared\cert.pem`
- Linux: `~/.cloudflared/cert.pem`

الملف ده مهم جداً — من غيره مش هتقدر تشغل الـ tunnel.

---

## إنشاء tunnel

```bash
cloudflared tunnel create my-tunnel
```

هتاخد:
- Tunnel UUID
- ملف credentials JSON

مثال:

```bash
~/.cloudflared/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json
```

---

## إعداد الـ config

اعمل ملف `config.yml`:

### على Windows

```bash
%USERPROFILE%\.cloudflared\config.yml
```

### على Linux

```bash
~/.cloudflared/config.yml
```

مثال على الإعداد:

```yaml
tunnel: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: /full/path/to/credentials.json

ingress:
  - hostname: app.example.com
    service: http://localhost:3000
  - service: http_status:404
```

---

## إعداد DNS

اعمل DNS record بيشير للـ tunnel:

```bash
cloudflared tunnel route dns my-tunnel app.example.com
```

**مهم:**
- الـ Type لازم يكون CNAME
- الـ Target هو الـ tunnel مش الـ IP
- لو عندك CNAME قديم من tunnel اتحذف، هيبوظ الـ routing

---

## تشغيل الـ tunnel

```bash
cloudflared tunnel run my-tunnel
```

أو كـ service:

### Windows

```bash
cloudflared service install
```

### Linux

```bash
sudo cloudflared service install
```

---

## المشاكل الشائعة

### الموقع مش بيفتح

- الـ DNS CNAME بيشير لـ tunnel قديم
- الـ UUID غلط في الـ config
-  path ملف الـ credentials غلط

### بيشتغل محلياً بس

- التطبيق مش شغال على localhost
- الـ port غلط في الـ ingress service

---

## النسخ الاحتياطي والنقل لجهاز تاني

دي أهم حاجة في الموضوع كله.

### الملفات اللي لازم تاخد نسخة منها

من `~/.cloudflared` أو `%USERPROFILE%\.cloudflared`:

- `cert.pem`
- `config.yml`
- `tunnel-UUID.json`

من غير دول، الـ tunnel مش هيتقدر يتعمله reuse.

### النقل لـ PC تاني

1. ثبت cloudflared
2. انسخ الـ 3 ملفات في نفس الـ directory
3. تأكد إن الـ paths جوه الـ config صح
4. شغل:

```bash
cloudflared tunnel run my-tunnel
```

مفيش حاجة لإنشاء tunnel جديد.

---

## استخدام نفس الـ tunnel على Linux و Windows

الـ Tunnels مستقلة عن الـ platform. الـ paths بس اللي بتختلف.

مثال Windows:

```bash
C:\Users\Ahmed\.cloudflared\credentials.json
```

مثال Linux:

```bash
/home/ahmed/.cloudflared/credentials.json
```

الـ UUID والـ cert بيفضلوا زي ما هم.

---

## ملاحظات أمنية

- عامل `cert.pem` زي الـ private key
- أي حد عنده `cert.pem` و `credentials.json' يقدر يشغل الـ tunnel بتاعك
- خزن الـ backups مشفرة

---

## امتى تعمل tunnel جديد؟

- لو الـ cert.pem اتcompromised
- لو عايز isolation بين الـ environments
- لو حذفت الـ tunnel من Cloudflare dashboard

غير كده، استخدم نفس الـ tunnel.

---

## الـ Mental Model

cloudflared مش server — ده client. الـ DNS بيشير لـ Cloudflare. Cloudflare بتتكلم مع الـ tunnel. جهازك مبيفتحش port أبداً. ده اللي بيخلي الـ backups أهم من الجهاز نفسه.

أنا بستخدم الطريقة دي بالظبط في نشر مشاريع العملاء — مفيش ports مفتوحة، كل حاجة ماشية من خلال Cloudflare edge. لو عايز تشوف الـ production stack كامل مع Postgres والـ orchestration، شوف [دليل الـ Self-Hosting على Dokploy](/ar/blogs/self-host-nextjs-blog-on-dokploy). ولو عايز تشوف مثال حي، [The Drive Center](/ar/projects/the-drive-center) شغال بنفس الطريقة.
