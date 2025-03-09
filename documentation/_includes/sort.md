{% capture disable_most %}
type: true
required: true
default: true
{% endcapture %}
{% assign disable_most = disable_most | fromYAML %}

{% assign sort_config = site.data.types['src/util/types.ts'].SortConfig %}
{% assign sort_comparator = site.data.types['src/util/types.ts'].SortComparator %}

### Sort

Sort can can be defined for fine-grained control in which order the entities should be in the grid.

```yaml
sort:
  - ...
```

The sort object looks like this.

{% include table.md options=sort_config %}

{% include example.md options=sort_config %}

#### Sort Comparator

{% include table.md options=sort_comparator disable=disable_most %}
