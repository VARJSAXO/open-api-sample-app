define([
    'knockout',
    'jquery',
    'Chart',
    'src/utils/config'
], function (ko, $, Chart, Config) {
    'use strict';

    ko.bindingHandlers.textTemplate = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var bindingValues = valueAccessor();
            require(['text!src/templates/' + bindingValues.name + '.html'], function(html) {
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

    ko.bindingHandlers.widget = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var bindingValues = valueAccessor();
            require(['src/widgets/' + bindingValues.name + '/' + bindingValues.name], function(Widget) {
                $(element).addClass(bindingValues.name);
                new Widget($(element));
            });
        }
    };

    return {
        init: function(translator, formatters) {
            var configRenderer = new Config(translator, formatters);
             ko.bindingHandlers.configSection = {
                 init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                     configRenderer.addModel(valueAccessor(), $(element));
                 }
            };

            ko.bindingHandlers.translateText = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    element.textContent = translator.translate(valueAccessor());
                },
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    element.textContent = translator.translate(valueAccessor());
                }
            };

            ko.bindingHandlers.translateTitle = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    element.title = translator.translate(valueAccessor());
                },
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    element.title = translator.translate(valueAccessor());
                }
            };
            ko.bindingHandlers.disableElement = {
                init: function (element, valueAccessor) {
                    var val = valueAccessor();
                    if(val){
                        element.disabled = val();
                        element.readOnly = val();
                    }
                },
                update: function (element, valueAccessor) {
                    var val = valueAccessor();
                    if(val){
                        element.disabled = val();
                        element.readOnly = val();
                    }
                }
            }
        }
    };
});
var model = {
            resize: _resize,
            chart: new ChartViewModel(chart, Chart.DefaultTranslator, formatters),
            config: new ConfigViewModel(chart)
        };

        Bindings.init(Chart.DefaultTranslator, formatters);
        ko.applyBindings(model, el.get(0));
