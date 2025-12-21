# 🕶️ Visualisation

The **Visualisation** tools in Alpaca4d help you inspect and understand your model directly in the Rhino viewport before and after running the analysis.  
They provide an immediate graphical feedback of elements, supports, loads and constraints, so you can quickly detect modelling mistakes.

The main component is **`Model View (Alpaca4d)`**, which reads the assembled Alpaca model and draws a customizable preview.

## Model view

With the `Model View` component you can:

- **Preview elements**:  
  - Display beams as lines or as extruded 3D meshes based on their cross‑sections.  
  - Show shells and bricks with colors derived from their section or material.
- **Show loads**:  
  - Visualise point, line and surface loads as arrows or pressure patches, scaled by a user‑defined factor.
- **Show supports and constraints**:  
  - Display boundary conditions and rigid diaphragms as symbols or meshes for quick checking.

## Usage notes

- Use **extruded mode** when communicating the model to non‑technical stakeholders, and **wireframe mode** when you want a light, fast preview.  
- Combine `Model View` with the **Results** tools to compare the original geometry with displaced shapes or stress contours.  
- Always visually inspect the model (supports, constraints and loads) before starting a detailed analysis.