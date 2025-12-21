# 🔗 Uniaxial materials

A **UniaxialMaterial** describes a 1D stress–strain relationship, typically used for fibers, hinges, or simplified member behavior where only one force component is relevant (axial, shear or bending).  
In Alpaca4d the **`Uniaxial`** Grasshopper component is a switcher that exposes different uniaxial models (e.g. `UniaxialElastic`, `ElasticPerfectlyPlastic`).

At the moment, the main implemented model is **`UniaxialElastic`**, which creates an `Alpaca4d.Material.UniaxialMaterialElastic` object.

## UniaxialElastic

The **UniaxialElastic** sub‑component defines a linear elastic uniaxial material:

- **Material Name** (optional): Custom name for the material (e.g. "Steel S235 – axial").  
- **E**: Young’s modulus \([Force/Length²]\) in tension.
- **Eneg**: Young’s modulus \([Force/Length²]\) in compression (can be equal to `E` or different if needed).
- **Eta**: Viscous damping parameter (Rayleigh‑type), usually `0.0` for purely elastic behavior.
- **G**: Shear modulus \([Force/Length²]\).
- **ν**: Poisson’s ratio.
- **Rho**: Density \([Mass/Length³]\).

**Output**

- **Material**: A uniaxial material that can be assigned to elements or sections that expect a `UniaxialMaterial`.

## ElasticPerfectlyPlastic (preview)

An **ElasticPerfectlyPlastic** uniaxial model is also available in the menu, but is currently marked as **“not yet implemented”** and only issues a warning.  
For now, use **UniaxialElastic** (or database‑based materials) for production models.

## Usage notes

- Uniaxial materials are most commonly used in **fiber sections** and non‑linear hinges.  
- You can combine several uniaxial materials in a section to represent different materials (steel, concrete, reinforcement) in the same cross‑section.
- For standard elastic behavior, you can also generate equivalent uniaxial materials directly from the **Material Database** (see below).
