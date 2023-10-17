# 🍏 Simple Beams

{% file src="../.gitbook/assets/beam.gh" %}

## Simply supported beam

Example properties

* line load (q): 5 kN/m
* span (l): 6 m
* modulus of elasticity (E): 235 N/mm²
* moment of inertia (I): -- mm⁴

#### Bending moment

$$
M_{max} = \frac{1}{8}ql^2
$$

$$
M_{max} = \frac{1}{8}\cdot 6 \cdot  4^2 = \mathbf{22,5}\;  kNm
$$

#### Shear force

$$
V_{max} = \frac{1}{2}ql
$$

$$
V_{max} = \frac{1}{2}\cdot q\cdot l= \mathbf{6}\: kN
$$

#### Displacement

{% file src="../.gitbook/assets/Alpaca4d_cantilever_example.gh" %}

