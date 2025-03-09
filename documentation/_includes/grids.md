{% capture disable_default %}
default: true
{% endcapture %}
{% assign disable_default = disable_default | fromYAML %}

{% capture disable_most %}
type: true
required: true
default: true
{% endcapture %}
{% assign disable_most = disable_most | fromYAML %}

{% assign grid_merge_strategy = site.data.types['src/util/types.ts'].GridMergeStrategy %}

{% assign base_row_options = site.data.types['src/util/types.ts'].BaseRowOptions %}
{% assign base_row_ref_options = site.data.types['src/util/types.ts'].BaseRowRefOptions %}

{% assign value_type = site.data.types['src/util/types.ts'].ValueType %}

## Grid Merge Strategy

The Merge Strategy controls how the "grids"-key gets merged if both the base config of a strategy and the user config contain it.

{% include table.md options=grid_merge_strategy disable=disable_most %}

## Grid

Every Grid consists the Grid with all the cards for the entities itself and an (optional) title.
The row is defined by:

{% include table.md options=base_row_options disable=disable_default %}

{% include example.md options=base_row_options %}

#### Grid Overwrites

You can reference grids and overwrite every option easily with gridRef overwrites.

{% include table.md options=base_row_ref_options disable=disable_default %}

{% include example.md options=base_row_ref_options %}

{% include filter.md %}

{% include sort.md %}

### Value Type

The value type is used to extract a value from the entity/area.

{% include table.md options=value_type disable=disable_most %}
