### Filter

Filters can be defined for more fine-grained control which entities should be matched.
You can use both include and exclude as keys.

<table>
  <thead>
    <tr>
      <th>option</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>default</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
{%- for option in FilterConfig %}
    <tr>
      <td>{{ option.name }}</td>
      <td>{{ option.annotations | find: "tag", "@description" | map: "content" }}</td>
      <td>
      {%- if option.type.type == "reference" -%}
        Object
      {%- elsif option.type.type == "array" -%}
        Array
      {%- else -%}
        {{- option.type.name -}}
      {%- endif -%}
      </td>
      <td>{{ option.flags.isOptional | ternary: "yes", "no" }}</td>
      <td>{{- option.annotations | find: "tag", "@defaultValue" | map: "content" -}}</td>
      <td>
        <pre>
{{- option.annotations | find: "tag", "@example" | map: "content" -}}
        </pre>
      </td>
    </tr>
{%- endfor %}
  </tbody>
</table>

Both accept the same types and syntax.

The filter object looks like this.

<<<FILTER_CONFIGURATION_OPTIONS>>>
