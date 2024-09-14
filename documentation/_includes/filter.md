{% capture disable_default %}
default: true
{% endcapture %}

{% capture disable_most %}
type: true
required: true
default: true
{% endcapture %}

{% assign filter_config = site.data.types['src/util/types.ts'].FilterConfig %}
{% assign filter_type = site.data.types['src/util/types.ts'].FilterType %}
{% assign comparator = site.data.types['src/util/types.ts'].Comparator %}
{% assign disable_default = disable_default | fromYAML %}
{% assign disable_most = disable_most | fromYAML %}

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

### Filter Type

These are the options for filter type.

{% include table.md options=filter_type %}

### Filter Comparator

These are the options for filter comparator.

{% include table.md options=comparator %}
