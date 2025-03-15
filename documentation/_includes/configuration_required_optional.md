{% assign config_required = false %}

{% for option in include.options %}
  {% assign defaultArr = option.annotations | where: "tag", "@defaultValue" | default([]) %}
  {% unless option.flags.isOptional == true or defaultArr.size > 0 %}
    {% assign config_required = true %}
    {% break %}
  {% endunless %}
{% endfor %}

{% if config_required %}
{: .note }
>This Strategy needs you to configure it for it to work!
>
>Take a look at the Configuration Documentation for the required options!
{% else %}
{: .note }
>This Strategy has a sensible base configuration, which is the one i myself use!
>
>You can start without configuring anything. If you want to change something take a look at the Configuration Documentation.
{% endif %}
