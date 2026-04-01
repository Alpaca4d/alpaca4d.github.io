# 🌍 Gravity load

A **gravity load** represents the self‑weight of the structure due to gravity.  
In Alpaca4d this is handled by the **`Gravity Load (Alpaca4d)`** component, which creates an `Alpaca4d.Loads.Gravity` object.

## Inputs

- **Factor** (optional): Dimensionless multiplier for the gravity acceleration, default = `1.0`.  
  - `Factor = 1.0` → standard self‑weight.  
  - `Factor = 0.0` → self‑weight disabled.  
  - `Factor > 1.0` → amplified gravity (e.g. to include additional permanent loads not modelled explicitly).

The direction and value of gravity (e.g. acting in \(-Z\)) are defined in the global Alpaca4d settings / analysis model, not in this component.

## Output

- **Load**: A gravity `Load` object that can be connected to a **load pattern** and then to the **Assemble** component.

## Usage notes

- Gravity loads are usually included in a separate **permanent load pattern** (e.g. “G”) and combined with other patterns for design combinations.
- For many models, self‑weight plus a few distributed shell or beam loads is enough to capture the full permanent loading.
- In the current beam implementation, the gravity-load algorithm creates **equivalent concentrated nodal loads at the beam ends** (rather than a continuously distributed load along the element length).
- To better represent the action of gravity on beams, it is recommended to **discretize beams into multiple elements** so the equivalent nodal loads are distributed over more points.
