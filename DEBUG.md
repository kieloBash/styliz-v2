# 🔍 Debugging Next.js with Turbopack in Chrome

Follow these steps to enable **server-side debugging** in your Next.js app when using **Turbopack**:

---

## 1️⃣ Install Dependencies
Install `cross-env` to set environment variables across platforms (Windows, macOS, Linux):

```bash
npm install --save-dev cross-env
```

## 2️⃣ Add Debug Script
In your `package.json`, add a new script for debugging:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "debug": "cross-env NODE_OPTIONS=--inspect next dev --turbopack"
}
```

## 3️⃣ Start Debug Mode
Run the debug script:

```bash
npm run debug
```

## 4️⃣ Configure Debugging in VS Code (Optional)

If you prefer debugging inside **Visual Studio Code** instead of Chrome:

1. Open `.vscode/launch.json` (create the file if it doesn’t exist).
2. Add the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug client-side (Firefox)",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "reAttach": true,
      "pathMappings": [
        {
          "url": "webpack://_N_E",
          "path": "${workspaceFolder}"
        }
      ]
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

## 4️⃣ Open Chrome DevTools
- Open **Google Chrome**.
- Navigate to 
```bash
chrome://inspect
```
- Under **Remote Target**, click **inspect** next to your Next.js process.

## 5️⃣ Set Breakpoints
- You can now set **breakpoints** directly inside Chrome DevTools.
- Works for:
  - API routes
  - `getServerSideProps`
  - Other server-side code