# Como gerar o .EXE do FinanceFlow

## Requisitos
- Node.js 18+ instalado (https://nodejs.org)
- Windows 10 ou 11

## Passos

1. Extraia o ZIP em uma pasta no seu computador

2. Abra o Terminal (CMD ou PowerShell) dentro da pasta e rode:
   ```
   npm install
   ```

3. Para gerar o instalador .EXE:
   ```
   npm run dist
   ```

4. O instalador será criado em:
   ```
   release/FinanceFlow Setup X.X.X.exe
   ```

## Para testar antes de gerar o .EXE

```
npm run dev
```

Isso abre o app em modo desenvolvimento (precisa ter Electron instalado via `npm install`).
