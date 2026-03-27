---
description: How to create a new module/page with the Content Factory V10.1 Master Template.
---

To ensure every new module follows the premium cinematic aesthetic (20-orb background, glassmorphism, gold accents), follow these steps:

### 1. File Structure
Create your new `.html` file and include the following essential links in the `<head>`:

```html
<!-- Icons & Fonts -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">

<!-- Design System -->
<link rel="stylesheet" href="css/soft-corporate.css">

<!-- Master Template Engines -->
<script src="js/core/agent-core.js"></script>
<script src="js/core/ui-engine.js"></script>
```

### 2. The Master Template Hook
Wrap your page content in a `div` with the `data-master-template` attribute. Use the `.master-card` class for the main container.

```html
<body class="dark-factory">
    <div data-master-template>
        <div class="master-card">
            <!-- Icon Box -->
            <div class="master-icon-box">
                <i class="ph-fill ph-your-icon"></i>
            </div>
            
            <h1 class="master-title">Your Module Name</h1>
            <p class="master-subtitle">Your Tagline — V10.1</p>
            
            <!-- Your Content Here -->
            
        </div>
    </div>
</body>
```

### 3. Features Automated by UI-Engine
The `js/core/ui-engine.js` script will automatically:
- **Inject 20 Ambient Orbs**: Configured with the correct colors, blurs, and floating animations.
- **Add "Back to Hub" Button**: Placed in the top-left of the card with consistent styling.
- **Apply Transparencies**: Ensures the `.master-card` has the correct `backdrop-filter` and border opacity.

### 4. Color Palette Reference
- **Titles**: Use `.master-title` (Gradient White-to-Grey).
- **Subtitles/Focus**: Use `#ffd700` (Bright Gold).
- **Descriptions**: Use `#888` or `#aaa` for high readability.
