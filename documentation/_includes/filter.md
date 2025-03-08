{% capture disable_most %}
type: true
required: true
default: true
{% endcapture %}
{% assign disable_most = disable_most | fromYAML %}

{% assign filter_config = site.data.types['src/util/types.ts'].FilterConfig %}
{% assign filter_comparator = site.data.types['src/util/types.ts'].FilterComparator %}

## Filter

Filters can be defined for fine-grained control which entities should be matched.
You can use both include and exclude as keys. Both are optional.

```yaml
filter:
  include:
    - ...
  exclude:
    - ...
```

Both accept the same types and syntax.

{: .note }
> An entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!

The filter object looks like this.

{% include table.md options=filter_config %}

{% include example.md options=filter_config %}

### Filter Comparator

{% include table.md options=filter_comparator disable=disable_most %}
