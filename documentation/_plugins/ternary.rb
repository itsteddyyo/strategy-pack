module Jekyll
  module Ternary
    def ternary (input, truthyValue, falsyValue)
        input ? truthyValue : falsyValue
    end
  end
end

Liquid::Template.register_filter(Jekyll::Ternary)
