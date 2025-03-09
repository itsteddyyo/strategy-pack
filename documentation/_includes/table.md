<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr>
    {%- unless include.disable.option -%}
      <th>option</th>
    {%- endunless -%}
    {%- unless include.disable.description -%}
      <th style="min-width: 350px;">description</th>
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
      <th style="min-width: 350px;">example</th>
    {%- endunless -%}
    </tr>
  </thead>
  <tbody>
{%- assign rows = (include.options | deepSort: "annotations.tag", "@deprecated") -%}
{%- for option in rows %}
    <tr>
    {%- unless include.disable.option -%}
      <td>{{- option.name -}}</td>
    {%- endunless -%}
    {%- unless include.disable.description -%}
      <td>
      {{- option.annotations | where: "tag", "@description" | first | map: "content" -}}
      {%- assign deprecatedArr = option.annotations | where: "tag", "@deprecated" | default([]) -%}
      {%- if deprecatedArr.size > 0 -%}
        <blockquote class="warn"><p>Will be deprecated in: v{{- deprecatedArr[0].content -}}</p></blockquote>
      {%- endif -%}
      {%- assign remarksArr = option.annotations | where: "tag", "@remarks" | default([]) -%}
      {%- for remark in remarksArr %}
        <blockquote class="note"><p>{{- remark.content -}}</p></blockquote>
      {%- endfor %}
      </td>
    {%- endunless -%}
    {%- unless include.disable.type -%}
      <td>
      {%- if option.type.type == "reference" or option.type.type == "array" -%}
        {%- assign linkArr = option.annotations | where: "tag", "@link" | default([]) -%}
        {%- if linkArr.size > 0 -%}
          <a href='{{- linkArr[0].content -}}'>{{- option.type.type | capitalize -}}</a>
        {%- else -%}
          {{- option.type.type | capitalize -}}
        {%- endif -%}
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
        {%- if defaultArr[0].content contains 'https://' -%}
          <a href='{{- defaultArr[0].content -}}' target="_blank">base config</a>
        {%- else -%}
          {{- defaultArr[0].content -}}
        {%- endif -%}
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
