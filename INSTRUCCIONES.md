# 🎂 Las aventuras de María y Lucía
## Instrucciones completas

---

## 📁 ESTRUCTURA DE CARPETAS

```
maria-app/
├── index.html          ← Archivo principal (no tocar)
├── manifest.json       ← Config PWA (no tocar)
├── sw.js               ← Service Worker (no tocar)
├── css/
│   └── styles.css      ← Estilos (no tocar)
├── js/
│   ├── config.js       ← ⭐ AQUÍ PERSONALIZAS TODO
│   ├── game.js         ← Motor del juego (no tocar)
│   └── app.js          ← Controlador (no tocar)
└── assets/
    ├── icon.png        ← ⭐ ICONO de la app (cuadrado, mínimo 192x192px)
    ├── fotos/
    │   ├── foto1.jpg   ← ⭐ Primera foto (recuerdo 1)
    │   ├── foto2.jpg   ← ⭐ Segunda foto (recuerdo 2)
    │   ├── foto3.jpg   ← ⭐ Tercera foto (recuerdo 3)
    │   ├── foto4.jpg   ← ⭐ Cuarta foto (recuerdo 4)
    │   └── foto5.jpg   ← ⭐ Quinta foto (recuerdo 5)
    └── video/
        └── video.mp4   ← ⭐ Tu vídeo de recopilación
```

---

## ⭐ PASOS PARA PERSONALIZAR

### 1. Añade las fotos
- Ve a la carpeta `assets/fotos/`
- Renombra tus 5 fotos como: `foto1.jpg`, `foto2.jpg`... hasta `foto5.jpg`
- Formato: JPG o PNG funcionan ambos (si usas PNG, cambia la extensión en `js/config.js`)

### 2. Añade el vídeo
- Ve a la carpeta `assets/video/`
- Pon tu vídeo con el nombre exacto: `video.mp4`
- Recomendación: comprímelo a menos de 50MB para que cargue bien

### 3. Añade el icono
- Pon una imagen cuadrada en `assets/icon.png`
- Mínimo 192x192 píxeles
- Será el icono que aparezca en el móvil de María

### 4. (Opcional) Modifica textos
- Abre `js/config.js` con el Bloc de notas
- Cambia cualquier texto, frase o nombre

---

## 🚀 SUBIR A GITHUB PAGES (gratis y permanente)

### Paso 1: Crear cuenta en GitHub
1. Ve a https://github.com
2. Crea una cuenta gratuita si no tienes

### Paso 2: Crear repositorio
1. Pulsa el botón verde **"New"** (repositorio nuevo)
2. Nombre: `maria-lucia` (o lo que quieras)
3. Marca **"Public"** (obligatorio para GitHub Pages gratis)
4. Pulsa **"Create repository"**

### Paso 3: Subir archivos
1. En la página del repositorio, pulsa **"uploading an existing file"**
2. Arrastra TODA la carpeta `maria-app` o selecciona todos los archivos
3. **IMPORTANTE**: Sube los archivos tal como están, respetando la estructura de carpetas
4. Pulsa **"Commit changes"**

### Paso 4: Activar GitHub Pages
1. Ve a **Settings** (pestaña de ajustes del repositorio)
2. Menú izquierdo: **Pages**
3. En "Source" selecciona **"main"** y carpeta **"/ (root)"**
4. Pulsa **Save**
5. Espera 2-3 minutos

### Paso 5: Obtener el link
Tu app estará disponible en:
```
https://TU_USUARIO.github.io/maria-lucia/
```

---

## 📱 CÓMO MARÍA LO INSTALA EN SU IPHONE

1. Le mandas el link por WhatsApp
2. Ella lo abre en **Safari** (importante, no en Chrome)
3. Pulsa el botón de **compartir** (el cuadrado con la flechita ↑)
4. Selecciona **"Añadir a pantalla de inicio"**
5. Pulsa **"Añadir"**
6. ¡Ya tiene la app en su iPhone! 🎉

La app aparecerá con el icono que pusiste y funcionará como una app normal.

---

## ❓ PREGUNTAS FRECUENTES

**¿Funciona sin internet?**
Sí, después de la primera vez que la abra, funciona offline (gracias al Service Worker).

**¿El vídeo puede ser grande?**
Intenta que no supere 100MB. Si es muy grande, tarda en cargar.

**¿Puede cambiar el nombre en el icono?**
Sí, en `manifest.json`, cambia `"short_name"`.

**¿Se puede ver en Android también?**
Sí, funciona igual de bien en Android con Chrome.

---

Hecho con ❤️ por Lucía para María
