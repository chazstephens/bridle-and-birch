# Bridle & Birch — Live Engraving Preview Research Report

This report analyzes the systems, tools, and APIs available to render **highly realistic dynamic text engravings** directly onto product images (such as wood, leather, glass, and cylindrical drinkware) for the Bridle & Birch storefront, replacing the current flat text layers.

---

## The Core Problem

Standard web personalization overlays place text on top of an image as a simple, flat layer. For luxury engraved home goods, this looks artificial because real engraving interacts with the material's physical properties:

1. **Wood Engraving (Acacia/Walnut):** Laser burns follow the wood grain, charring deeper into softer growth rings and lighter in harder ones, creating color/density variance and slightly textured edges.
2. **Glass Etching/Frosting:** Laser frosting is semi-translucent, diffusing light from the background rather than being a solid white paint layer.
3. **Leather Branding:** Heat stamps depress the leather fibers, creating depth (bevels/shadows) and darkening the skin.
4. **Cylindrical Wrapping:** Engraving on drinkware (whiskey glasses, tumblers) must wrap around the curved 3D geometry of the product rather than sitting on a flat 2D plane.

---

## Comparative Matrix of Solutions

| Dimension | Option 1: SVG Displacement Maps (Client-Side) | Option 2: WebGL Shader / Three.js (Client-Side) | Option 3: Dynamic Mockups API (SaaS / PSD-Based) | Option 4: ImageMagick / Serverless (Self-Hosted) |
| :--- | :--- | :--- | :--- | :--- |
| **Render Quality** | **Medium-High** (Organic edge weathering & texture blending) | **High** (3D mesh warping, lighting, depth highlights) | **Very High** (Photoshop-level warp grids, bevels, shadows) | **Medium-High** (Cylinder distortion and pixel displacement) |
| **Performance / Latency** | **0ms (Instant)** | **0ms (Instant)** | **1.2 – 2.0 seconds** (API round-trip) | **500ms – 1.5 seconds** (Server compute) |
| **E-Commerce Integration** | Simple overlay or offscreen canvas export | Embedding canvas in product page | Webhook/API calls returning imageUrl | Next.js API Route handler |
| **Cylindrical Warping** | No (Flat 2D only) | **Yes** (Wraps around cylinder) | **Yes** (Photoshop Smart Object Warp) | **Yes** (Cylinder warp filters) |
| **Cost** | **$0 (Free)** | **$0 (Free)** | **Paid Subscription** (e.g. $19–$99/mo) | **$0** (Compute-only infrastructure cost) |
| **Implementation Complexity** | Low-Medium (HTML/CSS/SVG) | High (GLSL Shaders / UV Map setup) | Low (REST API integration) | High (CLI setup on serverless environment) |

---

## Detailed Technology Deep Dive

### 1. Option 1: Client-Side SVG Displacement Filters & Blending (Recommended for MVP)
This approach runs entirely inside the user's browser, using native SVG filters (`<feDisplacementMap>`) to distort custom text along the physical grain of a product texture, blended using CSS.

* **How it works:**
  1. We prepare a high-contrast grayscale "heightmap" of the product's engravable surface (e.g. wood grain lines or slate texture) and save it as a small file.
  2. In Next.js, we overlay an SVG text element over the product image.
  3. The SVG references a `<filter>` that uses the heightmap as `in2` in `<feDisplacementMap>`.
  4. The filter shifts the text outlines to match the grain lines of the wood, creating organic edges.
  5. We apply `mix-blend-mode: multiply` (wood/leather) or `mix-blend-mode: overlay` (glass) to blend the text color with the underlying product fibers.
* **Code Example (SVG Filter structure):**
  ```xml
  <svg width="0" height="0">
    <defs>
      <filter id="wood-engrave-filter">
        <!-- 1. Load the grayscale heightmap -->
        <feImage href="/images/heightmaps/charcuterie_heightmap.png" result="heightmap" x="0" y="0" width="100%" height="100%" />
        <!-- 2. Distort text along the heightmap pixels -->
        <feDisplacementMap in="SourceGraphic" in2="heightmap" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedText" />
        <!-- 3. Add a slight emboss shadow for depth -->
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.25 0" in="SourceGraphic" result="shadowMask" />
        <feOffset dx="0.5" dy="1" in="shadowMask" result="shadowOffset" />
        <feBlend mode="normal" in="displacedText" in2="shadowOffset" />
      </filter>
    </defs>
  </svg>
  ```
* **Pros:** Instant feedback, highly responsive, zero operational cost, vector fonts stay sharp.
* **Cons:** Cannot wrap text around 3D curves (e.g. cylindrical glasses or tumblers).

### 2. Option 2: WebGL Shaders / Three.js
WebGL renders a 3D model of the product directly in the browser and overlays custom text as a dynamic canvas texture onto the 3D mesh.

* **How it works:**
  1. Create a simplified 3D model (GLTF/OBJ) of the product (e.g. a cylinder for a glass, a flat plane for a board).
  2. We write a custom WebGL fragment shader that performs bump mapping (calculating how virtual light reflects off the engraved lettering).
  3. The user's text is rendered to a hidden 2D canvas, which is uploaded to the GPU as a texture map.
* **Pros:** Unmatched interactive fidelity. The customer can rotate the product in 3D and watch the engraving catch the light realistically. True cylindrical wrap.
* **Cons:** Extremely high implementation effort, requires 3D models of every product catalog item, increases page load times.

### 3. Option 3: Dynamic Mockups API (Gold Standard for Photorealism)
A dedicated e-commerce rendering SaaS that allows you to automate mockups using Photoshop files (`.psd`).

* **How it works:**
  1. An artist designs a photorealistic product mockup in Adobe Photoshop. The personalization zone is set up as a **Smart Object** with native Photoshop warping, displacement maps, bevel/emboss layer styles, and blending.
  2. You upload the `.psd` file to the Dynamic Mockups dashboard.
  3. From Next.js, when the user types text, we make a REST API call:
     ```bash
     POST https://api.dynamicmockups.com/v1/render
     Headers: Authorization: Bearer <API_KEY>
     Body: { "templateId": "board_psd", "layers": { "CustomText": { "text": "The Stephens Family", "font": "Cinzel", "color": "#2c1d11" } } }
     ```
  4. The API replaces the text in the Photoshop Smart Object, renders the image using Photoshop's engine, and returns a high-res PNG URL in under 2 seconds.
* **Pros:** Absolute photorealism. Inherits Photoshop's powerful warp grids (ideal for wrapping text around curved tumblers/bottles), layer styles, and lighting. Minimal code required on the Next.js side.
* **Cons:** Paid API subscription (usage-based billing), network latency (requires a server round-trip of ~1-2 seconds), requires creating/maintaining PSD templates.

### 4. Option 4: Serverless ImageMagick (Self-Hosted Backend)
Using ImageMagick on a self-hosted server or serverless cloud function to dynamically warp and overlay text.

* **How it works:**
  1. Text is generated as a transparent PNG.
  2. We run ImageMagick command line operations using a node wrapper.
  3. ImageMagick's `-displace` parameter shifts text pixels along a grayscale displacement map of the wood grain.
  4. For cups, the `-distort cylinder` parameter warps the text into a cylindrical arc.
* **Pros:** 100% self-hosted (no subscription costs), highly flexible command-line parameters.
* **Cons:** ImageMagick binary must be installed on the server (very difficult to bundle in standard serverless hosts like Netlify/Vercel). Requires server compute power, which can slow down checkout and preview loops under high traffic.

---

## Recommendations for Bridle & Birch

### Short-Term Recommendation: Client-Side SVG Displacement & Blending
For the launch version of the website, we should implement **Client-Side SVG Displacement and CSS Blending**. It gives the user an instantaneous, tactile preview with zero server overhead and zero monthly SaaS costs:
1. **Wood Products:** Apply dynamic SVG displacement filters mapped to a grayscale heightmap of the wood grain, blended with `mix-blend-mode: multiply`.
2. **Glass Products:** Render the text in semi-translucent white (`rgba(245, 245, 245, 0.85)`) with an SVG blur filter and `mix-blend-mode: overlay` to simulate frosted engraving.

### Long-Term Recommendation: Dynamic Mockups API
As the product catalog expands—especially if adding cylindrical drinkware (glasses, tumblers) or leather goods—we should transition to the **Dynamic Mockups API**. 
* This allows you to design mockups directly in Photoshop, keeping the developer out of the loop when adding new products or changing layouts, and guarantees professional, print-on-demand level rendering.
