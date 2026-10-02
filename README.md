# Manual Focus · ¿Cómo hacer Check In?

Manual de usuario interactivo de **Focus**, la plataforma interna de evaluación de **Corporativo Axen Capital**.
Guía paso a paso para entrar a Focus, registrar la entrada (Check In) y cerrar la jornada (Check Out).

Manual creado por Rodrigo Fabela.

## Estructura

```
manual-focus-checkin/
├── index.html        # Toda la app: portada, pasos, estilos y lógica (sin dependencias)
├── img/              # Capturas de Focus, todas a 1920×1090
│   ├── paso01.jpg    # Inicio de sesión
│   ├── paso02a.jpg   # Google: primera vez (escribir correo)
│   ├── paso02.jpg    # Google: elegir cuenta guardada
│   ├── paso03.jpg    # Inicio (Check in)
│   ├── paso04.jpg    # Registrar entrada
│   ├── paso05.jpg    # Lista de lugares de trabajo
│   ├── paso06.jpg    # Lugar elegido (Terminar)
│   ├── paso07.jpg    # Entrada registrada (Check out)
│   └── paso08.jpg    # Registrar salida
├── assets/
│   ├── logo-axen-capital.svg
│   └── favicon.svg
├── vercel.json
└── README.md
```

Es un sitio estático: no necesita instalación ni build. Para verlo en local basta con abrir `index.html`
o levantar un servidor simple: `npx serve .`

## Editar los pasos

Los textos y zonas de clic están en el arreglo `STEPS` dentro de `index.html`. Cada paso define:

- `img`: captura a mostrar
- `title`, `action`, `note`, `result`: textos del panel
- `tip`: texto del globo sobre la imagen
- `hot`: zona de clic en % de la imagen `[izquierda, arriba, ancho, alto]`
- `zone` / `zoneLabel` (opcional): área informativa punteada

Para deep links usa `#paso1` … `#paso10` (por ejemplo `https://tu-dominio/#paso4`).

## Subir a GitHub

```bash
cd manual-focus-checkin
git init
git add .
git commit -m "Manual interactivo Focus: Check In y Check Out"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/manual-focus-checkin.git
git push -u origin main
```

## Publicar en Vercel

1. Entra a https://vercel.com/new e importa el repositorio `manual-focus-checkin`.
2. Framework Preset: **Other**. Deja vacíos Build Command y Output Directory.
3. Clic en **Deploy**.

Alternativa por terminal: `npx vercel` (y `npx vercel --prod` para producción).

Opcional: en *Settings → Domains* puedes asignar un subdominio, por ejemplo `manual.focus.axencapital.com`.
