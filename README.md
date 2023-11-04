# Special problem

There are 25 horses among which you need to find out the fastest 3 horses.
You can conduct a race among at most 5 to find out their relative speed.
At no point, you can find out the actual speed of the horse in a race.
Find out the minimum no. of races which are required to get the top 3 horses.

# General problem

There is a set of entities `E` that you need to determine the order of.

There is a function `f(F)` that returns the order for any subset `F ⊂ E`.

For a given `f(F)`, the size of `F` may be restricted, but is at least 2.

`f(F)` returns a sequence `e_1 → d_1,2 → e_2 → d_2,3 → … → e_n` with `e_i ∈ F`
and `d_i,j ∈ { ℝ+, ℝ-, <, >, =, ∅ }`. `d` is the distance and may be a positive
value `ℝ+`, an absolute 'greater than' `>`, or an 'undefined' `∅`. (The values
`ℝ-` and `<` are usually not returned by `f` because the elements are usually
returned in order.)

The order is not necessarily transitive, e.g. `E` may be "rock, paper, scissors".

# Representation

The ordering will be represented by an order list `G` and a distance matrix `D`.

`G` is an ordered list of the elements of `E`.

`D` is the distance matrix with the values `d_i,j` previously returned by `f(F)`.

- the order of the rows and columns of `D` corresponds to the order of `G`
- the matrix `D` is antisymmetric, `d_i,j = -d_j,i`

# Rounds

## Scoring round

A scoring round consists of evaluating `f(F)` for one input `F` and then
updating `D` with the values obtained.

## Normalization round

A normalization round consists of permutating the columns and rows of `G` and
`D`, such that the upper-right part of `D` is all-positive (does not contain
any `ℝ-` or `<`).
