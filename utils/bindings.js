define(['knockout', 'jquery'], function(ko, $) {
    'use strict';
    
    ko.bindingHandlers.textTemplate = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var bindingValues = valueAccessor();
            $.get('views/' + bindingValues.name + '.html', function(html) {
                var templateElement = $(html);
                ko.cleanNode(element);
                $(element).unbind();
                $(element).replaceWith(templateElement);
                ko.applyBindings(bindingValues.data || viewModel, templateElement[0]);
                if (bindingValues.afterRender) {
                    bindingValues.afterRender();
                }
            });
        }
    };
});

