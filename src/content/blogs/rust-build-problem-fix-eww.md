---
published: false
title: Rust Build Problem Fix (eww)
date: 2026-01-25
updated: 2026-01-25
tags: ["rust", "debugging", "build"]
share: true
---
published: false
# Installing Rust nightly

With rustup, the tool we installed in [Chapter 1](https://www.oreilly.com/library/view/rust-programming-by/9781788390637/96bd59ca-5e18-4dff-9cc1-42258b4fc522.xhtml), *Basics of Rust*, it is very easy to install nightly:

```plain text
rustup default nightly
```

Running this command will install the nightly version of the tools (cargo, rustc, and so on). Also, it will switch the corresponding commands to use the nightly version.

If you want to go back to the stable version, issue the following command:

```plain text
rustup default stable
```

The nightly version is updated very frequently, so you might want to 
update it every week or more often. To do so, you need to run this 
command:

```plain text
rustup update
```

This will also update the stable version if a new version was released (one stable version is released every 6 weeks).

Now that we are using Rust nightly, we're ready to create ...
Build issues like this are why I moved to static generation — fewer moving parts, faster builds. The approach is documented in my [Obsidian Workflow post](/en/blogs/building-zero-effort-obsidian-to-portfolio-workflow).

For the full deployment pipeline, see [Dokploy + VPS Self-Hosting Guide](/en/blogs/master-postgresql-self-hosting-guide-dokploy-vps).

## Further Reading

- [build tools hitting a wall](/blogs/frontend-build-tools-hitting-a-wall)
- [building a zero-effort workflow](/blogs/building-zero-effort-obsidian-to-portfolio-workflow)
