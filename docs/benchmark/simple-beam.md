# 🍏 Simple Beams

## 1. Simply supported beam

<figure><img src="../.gitbook/assets/benchmark_simply_supported_beam (1).PNG" alt="" width="375"><figcaption></figcaption></figure>

_Example properties:_

* line load (q): 5 kN/m
* span (l): 6 m
* modulus of elasticity (E): 2.1e10+7 N/mm²
* moment of inertia (I): 6.75e10+8 mm⁴

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
\delta _{max}=\frac{5\cdot 5\cdot 6^4}{384 \cdot 2.07e+11
 \cdot 6,75e-4} = 0.349\; mm
$$

#### 1.4 Benchmark

<table><thead><tr><th>simply supported</th><th width="227">Standard Beam Equation</th><th width="129">Alpaca4d</th><th>Difference</th></tr></thead><tbody><tr><td>Shear force</td><td>15,0 kN</td><td>14,7 kN</td><td>2.04%</td></tr><tr><td>Bending moment</td><td>18,75 kNm</td><td>18,74 kNm</td><td>0.05%</td></tr><tr><td>Displacement</td><td>0.349 mm</td><td>0.353 mm</td><td>1.13%</td></tr></tbody></table>

#### 1.5 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_simply_supported_beam_example.gh" %}

## 2. Cantilever beam

#### 2.1 Bending moment

#### 2.2 Shear force

#### 2.3 Displacement

#### 2.4 Benchmark

<table><thead><tr><th>simply supported</th><th width="227">Standard Beam Equation</th><th width="129">Alpaca4d</th><th>Difference</th></tr></thead><tbody><tr><td>Shear force</td><td>- kN</td><td>- kN</td><td>-%</td></tr><tr><td>Bending moment</td><td>- kNm</td><td>- kNm</td><td>-%</td></tr><tr><td>Displacement</td><td>- mm</td><td>- mm</td><td>-%</td></tr></tbody></table>

#### 2.5 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_cantilever_example.gh" %}

{% file src="../.gitbook/assets/beam.gh" %}

