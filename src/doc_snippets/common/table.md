<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr>
    {%- if not disable.option -%}
      <th>option</th>
    {%- endif -%}
    {%- if not disable.description -%}
      <th>description</th>
    {%- endif -%}
    {%- if not disable.type -%}
      <th>type</th>
    {%- endif -%}
    {%- if not disable.required -%}
      <th>required</th>
    {%- endif -%}
    {%- if not disable.default -%}
      <th>default</th>
    {%- endif -%}
    {%- if not disable.example -%}
      <th>example</th>
    {%- endif -%}
    </tr>
  </thead>
  <tbody>
{%- for option in options %}
    <tr>
    {%- if not disable.option -%}
      <td>{{- option.name -}}</td>
    {%- endif -%}
    {%- if not disable.description -%}
      <td>
      {{- option.annotations | find: "tag", "@description" | map: "content" -}}
      {%- if option.annotations | find: "tag", "@remarks" -%}
        <blockquote>{{- option.annotations | find: "tag", "@remarks" | map: "content" -}}</blockquote>
      {%- endif -%}
      </td>
    {%- endif -%}
    {%- if not disable.type -%}
      <td>
      {%- if option.type.type == "reference" -%}
        Object
      {%- elsif option.type.type == "array" -%}
        Array
      {%- else -%}
        {{- option.type.name -}}
      {%- endif -%}
      </td>
    {%- endif -%}
    {%- if not disable.required -%}
      <td>{{- option.flags.isOptional | ternary: "no", "yes" -}}</td>
    {%- endif -%}
    {%- if not disable.default -%}
      <td>
      {%- if option.annotations | find: "tag", "@defaultValue" -%}
        {{- option.annotations | find: "tag", "@defaultValue" | map: "content" -}}
      {%- else -%}
        -
      {%- endif -%}
      </td>
    {%- endif -%}
    {%- if not disable.example -%}
      <td>
        <pre>
{{- option.annotations | find: "tag", "@example" | map: "content" -}}
        </pre>
      </td>
    {%- endif -%}
    </tr>
{%- endfor %}
  </tbody>
</table>

</details>
<br />
