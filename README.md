## ⚡ Ingenierie 2 EISI ALT 25/26 - INFRA
Este proyecto es una herramienta web dinámica diseñada para la gestión y visualización de materias de la Maestría en Sistemas de Información, permite un seguimiento en tiempo real del progreso académico.

## 🇪🇸 ESPAÑOL
### 📝 Descripción
La herramienta procesa un archivo de datos local (horario_notion_listo.csv) para presentar el cronograma de clases del año 2026, comenzando el 5 de enero de 2026 y finalizando el 10 de julio de 2026.   

### ✨ Características Principales
**Interfaz Bilingüe:** Soporte completo para cambiar entre Español y Francés al instante.

**Detección de Semana Actual:** Al cargar, el sistema identifica automáticamente la semana de formación activa.


**Salto de Vacaciones:** La sección "Próxima actividad" detecta automáticamente la siguiente semana con clases, ignorando periodos de descanso (como el salto de febrero a marzo).   

**Contadores Duales:** Visualización de semanas calendario totales y semanas reales de formación que quedan.

**Indicador de Ubicación:** Diferencia visual entre clases en sala física y modalidad "Distanciel".


**Barras de Progreso:** Seguimiento visual de las sesiones completadas por cada materia (ej. Sesión 1 de 4).   

### 🛠️ Instalación y Uso
1. Aloja los archivos (index.html, style.css, script.js) en un servidor web Apache.

2. Asegúrate de que el archivo horario_notion_listo.csv esté en el mismo directorio.

3. Accede a la URL fija configurada en tu servidor.

## 🇫🇷 FRANÇAIS
### 📝 Description
Cet outil web dynamique est conçu pour la gestion et la visualisation des matières du Master en Systèmes d'Information. L'interface traite un fichier de données local (horario_notion_listo.csv) pour présenter le calendrier des cours de l'année 2026, du 5 janvier 2026 au 10 juillet 2026.   

### ✨ Caractéristiques Principales
**Interface Bilingue :** Support complet pour basculer instantanément entre l'espagnol et le français.

**Détection de la Semaine Actuelle :** Au chargement, le système identifie automatiquement la semaine de formation active.


**Saut de Vacances :** La section "Prochaine activité" détecte automatiquement la semaine suivante avec des cours, ignorant les périodes de repos (comme le passage de février à mars).   

**Compteurs Doubles :** Affichage des semaines calendaires totales et des semaines de formation réelles restantes.

**Indicateur de Lieu :** Différence visuelle entre les cours en salle physique et la modalité "Distanciel".


**Barres de Progression :** Suivi visuel des sessions terminées pour chaque matière (ex. Session 1 sur 4).   

### 🛠️ Installation et Utilisation
1. Hébergez les fichiers (index.html, style.css, script.js) sur un serveur web Apache.

2. Assurez-vous que le fichier horario_notion_listo.csv se trouve dans le même répertoire.

3. Accédez à l'URL fixe configurée sur votre serveur.

### 📊 Estructura de Datos / Structure des Données
El sistema requiere las siguientes columnas en el CSV:   

- Materia: Nombre del curso.

- Responsable: Profesor encargado.

- Fecha: Formato AAAA-MM-DD.

- Hora Inicio / Hora Fin: Horarios de sesión.

- Progreso: Estado de la materia (ej. "1 / 4").

- Salle: Ubicación o modalidad.
