# 🍏 Simple Beam

## 1. Simply supported beam

_Example properties:_

* line load (q): 6 kN/m
* span (l): 5 m
* modulus of elasticity (E): 2.07·10⁵ N/mm² &nbsp;(= 2.07·10¹¹ N/m²)
* moment of inertia (I): 6.75·10⁸ mm⁴ &nbsp;(= 6.75·10⁻⁴ m⁴)

#### 1.1 Bending moment

$$
M_{max} = \frac{1}{8}ql^2
$$

$$
M_{max} = \frac{1}{8}\cdot 6 \cdot 5^2 = \mathbf{18,75}\; kNm
$$

#### 1.2 Shear force

$$
V_{max} = \frac{1}{2}ql
$$

$$
V_{max} = \frac{1}{2}\cdot 6\cdot 5= \mathbf{15}\: kN
$$

#### 1.3 Displacement

$$
\delta _{max}=\frac{5\: ql^4}{384\: EI}
$$

$$
\delta _{max}=\frac{5\cdot 6\cdot 5^4}{384 \cdot 2.07e{+}11 \cdot 6.75e{-}4} = \mathbf{0.349}\; mm
$$

#### 1.4 Benchmark

<table><thead><tr><th>simply supported</th><th width="227">Standard Beam Equation</th><th width="129">Alpaca4d</th><th>Difference</th></tr></thead><tbody><tr><td>Shear force</td><td>15,0 kN</td><td>14,7 kN</td><td>2.04%</td></tr><tr><td>Bending moment</td><td>18,75 kNm</td><td>18,74 kNm</td><td>0.05%</td></tr><tr><td>Displacement</td><td>0.349 mm</td><td>0.353 mm</td><td>1.13%</td></tr></tbody></table>

#### 1.5 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Karamba3d.gh" %}

## 2. Cantilever beam

_Example properties as above:_ q = 6 kN/m, l = 5 m, E = 2.07·10⁵ N/mm², I = 6.75·10⁸ mm⁴.

#### 2.1 Bending moment

$$
M_{max} = \frac{1}{2}ql^2
$$

$$
M_{max} = \frac{1}{2}\cdot 6 \cdot 5^2 = \mathbf{75}\; kNm
$$

#### 2.2 Shear force

$$
V_{max} = ql
$$

$$
V_{max} = 6\cdot 5 = \mathbf{30}\: kN
$$

#### 2.3 Displacement

$$
\delta _{max}=\frac{ql^4}{8\: EI}
$$

$$
\delta _{max}=\frac{6\cdot 5^4}{8 \cdot 2.07e{+}11 \cdot 6.75e{-}4} = \mathbf{3.354}\; mm
$$

#### 2.4 Benchmark

<table><thead><tr><th>cantilever</th><th width="227">Standard Beam Equation</th><th width="129">Alpaca4d</th><th>Difference</th></tr></thead><tbody><tr><td>Shear force</td><td>30,0 kN</td><td>- kN</td><td>-%</td></tr><tr><td>Bending moment</td><td>75,0 kNm</td><td>- kNm</td><td>-%</td></tr><tr><td>Displacement</td><td>3.354 mm</td><td>- mm</td><td>-%</td></tr></tbody></table>

_The Alpaca4d column has not been run yet._

#### 2.5 Download Grasshopper benchmark file
