# 🧊 ND materials (multi‑dimensional)

An **NDMaterial** (n‑dimensional material) describes the full 2D/3D stress–strain relationship at the **Gauss point** of a continuum element.  
In Alpaca4d this is used by shell, solid and plate elements to compute stresses and strains through the thickness and in all directions.

The current ND implementations are **elastic**:

- **Elastic Isotropic**: same stiffness in all directions (e.g. standard steel or isotropic concrete).  
- **Elastic Orthotropic**: different stiffness along principal directions (e.g. timber, composite panels, plates with different in‑plane and out‑of‑plane stiffness).

These models are provided via the `nD` material sub‑components in Grasshopper:

- `nDElasticIsotropic` → `Alpaca4d.Material.ElasticIsotropicMaterial`
- `nDElasticOrthotropic` → `Alpaca4d.Material.ElasticOrthotropicMaterial`

## Typical inputs

For **Elastic Isotropic**:

- **E**: Young’s modulus \([Force/Length²]\).  
- **ν**: Poisson’s ratio.  
- **Rho**: Density \([Mass/Length³]\).

For **Elastic Orthotropic** (conceptually):

- **E1, E2, E3**: Young’s moduli along three orthogonal directions.  
- **ν12, ν23, ν31**: Poisson’s ratios.  
- **G12, G23, G31**: Shear moduli.  
- **Rho**: Density.

## Usage notes

- ND materials are assigned to **shells, solids and plate elements**, not to 1D beams.  
- For simple isotropic behavior, use the **Material Database** component to quickly obtain an elastic isotropic ND material from standard grades (steel, concrete, timber, plastic).  
- For advanced orthotropic behavior (e.g. timber panels or composite laminates) use the orthotropic ND sub‑component and carefully define local axes and stiffness values.
