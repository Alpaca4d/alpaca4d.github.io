# 🧩 Load pattern

A **load pattern** groups one or more loads and defines **how they vary in time** through a time series.  
It is the object that Alpaca4d actually uses during analysis to apply loads to the structure.

In Grasshopper, load patterns are created with the **Load Pattern** component, which exposes sub‑components such as **`PlainPattern`** and **`UniformExcitation`** and produces an `Alpaca4d.Loads.LoadPattern` object.

## Plain pattern

The **PlainPattern** sub‑component is used for static and quasi‑static load cases.

- **Inputs**
  - **TimeSeries**: A time series object (e.g. `Constant`, `Linear`) that controls how the pattern factor evolves over analysis time.
  - **Loads**: List of load objects (point, beam/line, shell/mesh, gravity, etc.) to be included in this pattern.
  - **Factor** (optional): Constant scalar applied to all loads in the pattern (default = `1.0`).

- **Behaviour**
  - The pattern factor is obtained from the time series and multiplied by `Factor` and by each individual load magnitude.
  - Used for typical load cases like **Dead**, **Live**, **Snow**, **Wind**, etc.

## Uniform excitation pattern

The **UniformExcitation** sub‑component is used to apply base acceleration (e.g. earthquake ground motion) to the entire model.

- **Inputs**
  - **Dof**: Degree of freedom where the ground motion acts (X, Y, Z, XX, YY, ZZ).
  - **TimeSeries**: Time series describing the ground motion (usually acceleration vs. time).
  - **Velocity** (optional): Initial velocity of the base, in \([Length/time]\).
  - **Factor** (optional): Constant scale factor for the excitation.

- **Behaviour**
  - Internally creates a `LoadPattern` of type `UniformExcitation` that applies the same base motion to all support nodes in the selected direction.

## Workflow

1. Create individual **load objects** (point, beam/line, shell/mesh, gravity, etc.).  
2. Group them in one or more **Load Pattern** components (Plain or UniformExcitation).  
3. Connect the load patterns to the **Assemble** component together with the model and analysis settings.

This separation between **loads** and **load patterns** allows you to reuse the same loads in different patterns and to clearly organize load cases and dynamic excitations.