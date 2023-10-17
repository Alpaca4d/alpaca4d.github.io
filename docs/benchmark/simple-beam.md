# 🍏 Simple Beams

{% file src="../.gitbook/assets/beam.gh" %}

## 1. Simply supported beam

Example properties

* line load (q): 5 kN/m
* span (l): 6 m
* modulus of elasticity (E): 235 N/mm²
* moment of inertia (I): -- mm⁴

#### 1.1 Bending moment

$$
M_{max} = \frac{1}{8}ql^2
$$

$$
M_{max} = \frac{1}{8}\cdot 6 \cdot  5^2 = \mathbf{22,5}\;  kNm
$$

#### 1.2 Shear force

$$
V_{max} = \frac{1}{2}ql
$$

$$
V_{max} = \frac{1}{2}\cdot 5\cdot6= \mathbf{15}\: kN
$$

#### 1.3 Displacement

$$
\delta _{max}=\frac{5\: ql^4}{384\: EI}
$$

$$
\delta _{max}=\frac{5\cdot 5\cdot 6^4}{384 \cdot E \cdot I} = 1\; mm
$$

#### 1.4 Benchmark

| simply supported | SBE | Alpaca4d | Difference |
| ---------------- | --- | -------- | ---------- |
| Bending moment   |     |          | 0%         |
| Shear force      |     |          | 0%         |
| Displacement     |     |          | 0%         |

## 2. Cantilever beam

{% file src="../.gitbook/assets/Alpaca4d_cantilever_example.gh" %}

