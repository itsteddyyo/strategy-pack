<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr>
    {%- unless include.disable.option -%}
      <th>option</th>
    {%- endunless -%}
    {%- unless include.disable.description -%}
      <th style="min-width: 250px;">description</th>
    {%- endunless -%}
    {%- unless include.disable.type -%}
      <th>type</th>
    {%- endunless -%}
    {%- unless include.disable.required -%}
      <th>required</th>
    {%- endunless -%}
    {%- unless include.disable.default -%}
      <th style="min-width: 100px;">default</th>
    {%- endunless -%}
    {%- unless include.disable.example -%}
      <th style="min-width: 250px;">example</th>
    {%- endunless -%}
    </tr>
  </thead>
  <tbody>
{%- for option in include.options %}
    <tr>
    {%- unless include.disable.option -%}
      <td>{{- option.name -}}</td>
    {%- endunless -%}
    {%- unless include.disable.description -%}
      <td>
      {{- option.annotations | where: "tag", "@description" | first | map: "content" -}}
      {%- assign remarksArr = option.annotations | where: "tag", "@remarks" | default([]) -%}
      {%- if remarksArr.size > 0 -%}
        <blockquote class="note"><p>{{- option.annotations | find: "tag", "@remarks" | map: "content" -}}</p></blockquote>
      {%- endif -%}
      </td>
    {%- endunless -%}
    {%- unless include.disable.type -%}
      <td>
      {%- if option.type.type == "reference" -%}
        Object
      {%- elsif option.type.type == "array" -%}
        Array
      {%- else -%}
        {{- option.type.name -}}
      {%- endif -%}
      </td>
    {%- endunless -%}
    {%- unless include.disable.required -%}
      <td>{{- option.flags.isOptional | ternary: "no", "yes" -}}</td>
    {%- endunless -%}
    {%- unless include.disable.default -%}
      <td>
      {%- assign defaultArr = option.annotations | where: "tag", "@defaultValue" | default([]) -%}
      {%- if defaultArr.size > 0 -%}
        {{- option.annotations | find: "tag", "@defaultValue" | map: "content" -}}
      {%- else -%}
        -
      {%- endif -%}
      </td>
    {%- endunless -%}
    {%- unless include.disable.example -%}
      <td>
        <pre>{{- option.annotations | where: "tag", "@example" | first | map: "content" -}}</pre>
      </td>
    {%- endunless -%}
    </tr>
{%- endfor %}
  </tbody>
</table>

</details>
