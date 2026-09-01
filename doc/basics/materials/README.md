# 💐 Materials

Everything in the model needs a material. Alpaca4d has two families, and they are not
interchangeable — a component that wants one will refuse the other.

| Family | For | Component |
| --- | --- | --- |
| **Uniaxial** | 1D stress–strain. Beam sections, fibres, hinges. | [Uniaxial](Uniaxial.md) |
| **nD** | The full 2D/3D stress–strain law at a Gauss point. Shells, bricks, tetrahedra. | [nD](ND.md) |

Both can also be pulled from the [Material Database](MaterialDatabase.md), which fills in
standard grades of steel, concrete, timber and plastic so you do not have to type *E*, *G*,
*ν* and *ρ* by hand.

For the non-linear materials used by fibre sections — `Concrete01`, `Steel01`,
`ReinforcingSteel` — see [Moment Curvature](../moment-curvature/README.md).

## Which goes where

| You are building | Give it |
| --- | --- |
| A beam cross-section (rectangle, circle, I, 2L, hollow, generic) | a **Uniaxial** material |
| A [Plate Fiber Section](../sections/plate-fiber.md) for shells | an **nD** material |
| An [SSP Brick](../elements/brick.md) or [Tetrahedron](../elements/four-node-tetrahedron.md) | an **nD** material |
| A fibre in a [Fiber Section](../moment-curvature/fiber-section.md) | a **Uniaxial** material |

## Units

`E`, `G` and stresses are in **kN/m²**; density `Rho` is in **kg/m³**; strains and Poisson's
ratios are dimensionless.
