### Filter

Filters can be defined for more fine-grained control which entities should be matched.
You can use both include and exclude as keys.

```yaml
filter:
  include:
    - ...
  exclude:
    - ...
```

Both accept the same types and syntax.

>[!NOTE]
>A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!

The filter object looks like this.