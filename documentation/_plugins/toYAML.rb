require 'yaml'

module Jekyll
  module YamlFormatter
    def toYAML (input)
      YAML.dump(input)
    end
    def fromYAML (input)
      YAML.dump(input)
    end  
  end
end

Liquid::Template.register_filter(Jekyll::YamlFormatter)
