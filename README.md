# Etiquetes Wizard (Next.js)

Aplicació Next.js per al subdomini `etiquetes.s-ie.cat` que guia el client amb un procés per passos per identificar l'etiqueta adequada.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- API route per correu amb Resend

## Estructura recomanada

```text
etiquetes/
  app/
    api/send/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    preview/LabelPreviewSvg.tsx
    wizard/LabelWizard.tsx
    wizard/steps/StepContact.tsx
    wizard/steps/StepPrinter.tsx
    wizard/steps/StepDimensions.tsx
    wizard/steps/StepMaterial.tsx
  lib/
    schemas/wizard.ts
  .env.example
  package.json
  tailwind.config.ts
```

## Variables d'entorn

Duplica `.env.example` a `.env` i omple:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `SECRETARY_EMAIL`

## Execució

```bash
npm install
npm run dev
```

## Lògica condicional inclosa

- Impressora `desktop` limita amplada màxima recomanada.
- Si hi ha marca negra, la posició és obligatòria.
- Si no hi ha marca negra, la posició es força a `none`.
- En tèrmica directa, `ribbonType` es força a `none`.
- En transferència tèrmica, `ribbonType` és obligatori.
