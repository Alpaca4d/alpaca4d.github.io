# 📚 Material database

The **Material Database** is provided by the Grasshopper component **`Material Library (Elastic)`**, implemented as `MaterialPresetElastic`.  
It allows you to quickly select **standard grades** (steel, concrete, timber, plastic) and automatically generate consistent **elastic material properties** for Alpaca4d.

## How it works

The component reads a set of JSON databases embedded in Alpaca4d:

- `steel_properties.json`
- `concrete_properties.json`
- `timber_properties.json`
- `plastic_properties.json`

Each database contains typical values for:

- **E**: Young’s modulus (stored in MPa, converted internally to \([kN/m²]\)).  
- **G**: Shear modulus (if provided).  
- **ρ**: Density \([kg/m³]\).  
- Additional information specific to each material type (e.g. characteristic / mean values for concrete and timber).

You select:

- **Model**: `Uniaxial` or `nD`.  
- **Type**: material family (e.g. Steel, Concrete, Timber, Plastic).  
- **Grade**: specific grade (e.g. `S235`, `C30/37`, etc.).

The component then creates:

- A **Uniaxial** elastic material (`UniaxialMaterialElastic`) when **Model = Uniaxial**.  
- An **nD** elastic isotropic material (`ElasticIsotropicMaterial`) when **Model = nD**.

## Inputs and outputs

- **DatabasePath** (optional): Path to a custom JSON material database with the same schema as the built‑in ones.  
  If provided, this custom database is merged into the available types and grades.
- **Material**: Resulting material object (Uniaxial or ND) ready to be connected to sections or elements.

## Usage notes

- Use the Material Database whenever you need **standard** elastic materials without manually entering \(E\), \(G\), \(ν\), and \(ρ\).  
- You can still override or create fully custom materials using the dedicated **Uniaxial** and **nD** material components.  
- Custom JSON databases are useful for company‑specific libraries or national standards not included in the default set.