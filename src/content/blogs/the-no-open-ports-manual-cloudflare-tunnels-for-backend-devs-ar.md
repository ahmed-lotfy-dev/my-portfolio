---
title: "دليل الـ No-Open-Ports: Cloudflare Tunnels لمطوري الـ Backend"
date: 2026-01-25
updated: 2026-01-25
tags:
  - zero-trust
  - tunnel
  - cloudflare-tunnel
  - devops
image: /images/blogs/cloudflare-tunnel.jpg
share: true
featured: true
---

# دليل الـ No-Open-Ports: Cloudflare Tunnels لمطوري الـ Backend

لو حصل واضطررت تلعب في إعدادات الـ router عشان تفتح port عشان تختبر Stripe webhook، أو OAuth callback، أو توري حد الـ API بتاعك على الـ localhost — انت عارف الألم. الموضوع مش بس متعب، ده كمان غير آمن ومش عملي.

كمطور backend محترف، انت عايز طريقة مستمرة وآمنة وقابلة للـ scripting عشان تخلي الـ services المحلية بتاعتك متاحة. **Cloudflare Tunnels** (`cloudflared`) بتعمل outbound-only connection لـ Cloudflare edge. جهازك هو اللي بيتصل بيهم، فمش محتاج تفتح port على الـ firewall بتاعك.

أنا بستخدم الطريقة دي لDeploy مشاريع العملاء — مفيش ports مفتوحة خالص، كل الداتا ماشية من خلال Zero Trust.

---

## الـ Mental Model

`cloudflared` مش server — ده **client**.

1. التطبيق بتاعك شغال على `localhost:8000`
2. `cloudflared` قاعد جنبه وبيعمل dial out لـ cloudflare (بيبني "pipe")
3. الزائر بيفتح `api.yourdomain.com`
4. Cloudflare بيبعت الـ traffic من الـ pipe لجهازك

مفيش port مفتوح. الـ DNS بيشير للـ tunnel مش للـ IP. لو الـ tunnel credentials موجودة، أي جهاز يقدر يشغله.

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

أو نزل الـ binary من Cloudflare وحطه في الـ PATH.

### على Linux

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install cloudflared
```

---

## تسجيل الدخول لـ Cloudflare

```bash
cloudflared tunnel login
```

هيفتح browser، اختار الدومين. بعد ما يخلص، ملف الـ certificate هيتحفظ.

أماكن الملف:
- Windows: `%USERPROFILE%\.cloudflared\cert.pem`
- Linux: `~/.cloudflared/cert.pem`

الملف ده critical — من غيره مش هتقدر تشغل الـ tunnel.

---

## إنشاء tunnel

```bash
cloudflared tunnel create my-tunnel
```

هتاخد:
- Tunnel UUID
- ملف credentials JSON

---

## إعداد الـ config

اعمل ملف `config.yml`:

### Windows

```
%USERPROFILE%\.cloudflared\config.yml
```

### Linux

```
~/.cloudflared/config.yml
```

مثال:

```yaml
tunnel: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: /full/path/to/credentials.json

ingress:
  - hostname: app.example.com
    service: http://localhost:3000
  - service: http_status:404
```

---

## DNS routing

اعمل DNS record بيشير للـ tunnel:

```bash
cloudflared tunnel route dns my-tunnel app.example.com
```

**مهم:** الـ Type لازم CNAME، والـ Target هو الـ tunnel مش الـ IP.

---

## تخلي التطبيق متاح للـ public

لو عايز التطبيق بتاعك يتفتح من غير أي authentication:

1. روح على **Cloudflare Zero Trust Dashboard**
2. روح لـ **Access** > **Applications**
3. دوس **Add an application** واختار **Self-hosted**
4. حط اسم التطبيق والدومين (مثلاً: `app.example.com`)
5. نزل لـ **Application policies** ودوس **Add a policy**
6. اعمل policy بالـ settings دي:
   - **Policy name**: "Public Bypass"
   - **Action**: Bypass
   - **Include**: Everyone
7. دوس **Add policy**

خلاص. الـ local service بتاعك (مثلاً `localhost:3000`) دلوقتي متاح للـ public من غير access control.

---

## تشغيل الـ tunnel

```bash
cloudflared tunnel run my-tunnel
```

أو كـ service:

**Windows:**

```bash
cloudflared service install
```

**Linux:**

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

دي أهم جزء.

### الملفات اللي لازم تاخد منها نسخة

- `cert.pem`
- `config.yml`
- `tunnel-UUID.json`

من غير دول، الـ tunnel مش هيتعمله reuse.

### النقل لـ PC تاني

1. ثبت cloudflared
2. انسخ الـ 3 ملفات
3. تأكد إن الـ paths جوه الـ config صح
4. شغل:

```bash
cloudflared tunnel run my-tunnel
```

---

## استخدام نفس الـ tunnel على Linux و Windows

الـ Tunnels مستقلة عن الـ platform. الـ paths بس اللي بتختلف.

الـ UUID والـ cert بيفضلوا زي ما هم.

---

## ملاحظات أمنية

- عامل `cert.pem` زي private key
- أي حد عنده الملفين دول يقدر يشغل الـ tunnel بتاعك
- خزن الـ backups مشفرة

---

## امتى تعمل tunnel جديد؟

- لو الـ cert.pem اتcompromised
- لو عايز isolation بين الـ environments
- لو حذفت الـ tunnel من Cloudflare dashboard

غير كده، استخدم نفس الـ tunnel.

---

## الـ Mental Model النهائي

cloudflared مش server — ده client. الـ DNS بيشير لـ Cloudflare. Cloudflare بتتكلم مع الـ tunnel. جهازك مبيفتحش port أبداً. ده اللي بيخلي الـ backups أهم من الجهاز نفسه.

هذا البورتيفوليو منشر ورا Cloudflare Tunnels — مفيش ports مفتوحة على الـ server، كل حاجة ماشية من خلال Zero Trust. لو عايز تشوف الـ production stack كامل، شوف [دليل الـ Self-Hosting على Dokploy](/ar/blogs/self-host-nextjs-blog-on-dokploy). ولو مهتم بموضوع الـ security، اقرأ عن [CVSS 10.0 من Next.js لـ n8n](/ar/blogs/cvss-10-0-is-not-a-coincidence-from-next-js-to-n8n).
