## Usage

{% if include.type contains "-dashboard-" -%}
You need to create a new empty Dashboard for this Strategy Dashboard.
{%- endif %}
{% if include.type contains "-view-" -%}
You add this to already existing dashboards as an extra view.
{%- endif %}

`Dashboard` -> `Edit Dashboard` -> `Kebap Menu` -> `Raw Configuration Editor` -> `Paste the following`

```yaml
{% if include.type contains "-dashboard-" -%}
strategy:
  type: custom:{{ include.type }}
  config: #Your Config here
{%- endif %}
{% if include.type contains "-view-" -%}
... (existing dashboard)
views:
  - strategy:
      type: custom:{{ include.type }}
      config: #Your Config here
    title: YourTitle
    icon: mdi:youricon
    path: yourpath
{%- endif %}
```
