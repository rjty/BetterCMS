﻿/*jslint unparam: true, white: true, browser: true, devel: true */
/*global define, console */

define('bcms.pages.widgets', ['jquery', 'bcms', 'bcms.modal', 'bcms.datepicker', 'bcms.htmlEditor',
                              'bcms.dynamicContent', 'bcms.siteSettings', 'bcms.messages', 'bcms.preview', 'bcms.grid', 'bcms.inlineEdit', 'slides.jquery', 'bcms.redirect',
                              'bcms.pages.history'],
    function($, bcms, modal, datepicker, htmlEditor, dynamicContent, siteSettings, messages, preview, grid, editor, slides, redirect, contentHistory) {
        'use strict';

        var widgets = {},
            links = {
                loadSiteSettingsWidgetListUrl: null,                
                loadCreateHtmlContentWidgetDialogUrl: null,
                loadEditHtmlContentWidgetDialogUrl: null,
                loadCreateServerControlWidgetDialogUrl: null,
                loadEditServerControlWidgetDialogUrl: null,                               
                deleteWidgetUrl: null,
                loadPageContentOptionsDialogUrl: null
            },
            globalization = {
                createHtmlContentWidgetDialogTitle: null,
                editAdvancedContentDialogTitle: null,
                createWidgetDialogTitle: null,
                editWidgetDialogTitle: null,
                deleteWidgetConfirmMessage: null,
                deleteOptionConfirmMessage: null,
                editPageWidgetOptionsTitle: null,
                widgetStatusPublished: null,
                widgetStatusDraft: null,
                widgetStatusPublishedWithDraft: null
            },
            selectors = {                                
                enableCustomCss: '#bcms-enable-custom-css',
                customCssContainer: '#bcms-custom-css-container',
                enableCustomJs: '#bcms-enable-custom-js',
                customJsContainer: '#bcms-custom-js-container',
                enableCustomHtml: '#bcms-enable-custom-html',
                customHtmlContainer: '#bcms-custom-html-container',
                desirableStatus: '#bcmsWidgetDesirableStatus',
                destroyDraftVersionLink: '.bcms-messages-draft-destroy',
                contentId: '#bcmsContentId',
                
                widgetPreviewImageUrl: '#PreviewImageUrl',
                widgetPreviewImage: '#bcms-widget-preview-image',
                widgetPreviewPageContentId: '.bcms-preview-page-content-id',
                htmlContentWidgetContentHtmlEditor: 'bcms-advanced-contenthtml',

                htmlContentWidgetRowTemplate: '#bcms-advanced-content-list-row-template',
                htmlContentWidgetRowTemplateFirstRow: 'tr:first',
                htmlContentWidgetTableFirstRow: 'table.bcms-tables > tbody > tr:first',

                widgetsSearchButton: '#bcms-widget-search-btn',
                widgetCreateButton: '#bcms-create-widget-button',
                widgetRegisterButton: '#bcms-register-widget-button',
                widgetRowEditButton: '.bcms-grid-item-edit-button',
                widgetRowHistoryButton: '.bcms-grid-item-history-button',
                widgetsRowDeleteButtons: '.bcms-grid-item-delete-button',
                widgetParentRow: 'tr:first',
                widgetNameCell: '.bcms-widget-name',
                widgetCategoryNameCell: '.bcms-category-name',
                widgetStatusCell: '.bcms-widget-status',
                widgetRowDeleteButtons: '.bcms-grid-item-delete-button',
                widgetRowTemplate: '#bcms-widget-list-row-template',
                widgetRowCells: 'td',
                widgetRowTemplateFirstRow: 'tr:first',
                widgetsTableFirstRow: 'table.bcms-tables > tbody > tr:first',
                widgetInsertButtons: '.bcms-widget-insert-button',

                siteSettingsWidgetsListForm: '#bcms-widgets-form',

                addOptionLink: '#bcms-add-option-button',
                optionsTable: '#bcms-options-grid'
            },
            classes = {
                regionAdvancedContent: 'bcms-content-advanced',
                regionWidget: 'bcms-content-widget'
            };

        /**
        * Assign objects to module.
        */
        widgets.links = links;
        widgets.globalization = globalization;


        /**
        * Opens dialog with a create html content widget form.
        */
        widgets.openCreateHtmlContentWidgetDialog = function (postSuccess, availablePreviewOnPageContentId) {        
            modal.edit({
                isPreviewAvailable: availablePreviewOnPageContentId != null,
                title: globalization.createHtmlContentWidgetDialogTitle,
                onLoad: function(childDialog) {
                    dynamicContent.bindDialog(childDialog, links.loadCreateHtmlContentWidgetDialogUrl, {
                        contentAvailable: function (dialog) {
                            initializeEditHtmlContentWidgetForm(dialog, availablePreviewOnPageContentId);
                        },

                        beforePost: function() {
                            htmlEditor.updateEditorContent(selectors.htmlContentWidgetContentHtmlEditor);
                        },

                        postSuccess: postSuccess
                    });
                }
            });
        };

        /**
        * Opens dialog with an edit html content widget form.
        */
        widgets.openEditHtmlContentWidgetDialog = function (id, postSuccess, availablePreviewOnPageContentId, onCloseClick) {
            modal.edit({
                isPreviewAvailable: availablePreviewOnPageContentId != null,
                title: globalization.editAdvancedContentDialogTitle,
                onCloseClick: onCloseClick,
                onLoad: function(childDialog) {
                    dynamicContent.bindDialog(childDialog, $.format(links.loadEditHtmlContentWidgetDialogUrl, id), {
                        contentAvailable: function (dialog) {
                            initializeEditHtmlContentWidgetForm(dialog, availablePreviewOnPageContentId);
                        },

                        beforePost: function() {
                            htmlEditor.updateEditorContent(selectors.htmlContentWidgetContentHtmlEditor);
                        },

                        postSuccess: postSuccess
                    });
                }
            });
        };

        /**
        * Opens ServerControlWidget edit dialog.
        */
        widgets.openEditServerControlWidgetDialog = function (widgetId, onSaveCallback, availablePreviewOnPageContentId, onCloseClick) {
            modal.edit({
                isPreviewAvailable: availablePreviewOnPageContentId != null,
                title: globalization.editWidgetDialogTitle,
                onCloseClick: onCloseClick,
                onLoad: function(childDialog) {
                    dynamicContent.bindDialog(childDialog, $.format(links.loadEditServerControlWidgetDialogUrl, widgetId), {
                        contentAvailable: function (dialog) {
                            initializeEditServerControlWidgetForm(dialog, availablePreviewOnPageContentId);
                        },

                        beforePost: function(form) {
                            editor.resetAutoGenerateNameId();
                            editor.setInputNames(form);
                        },

                        postSuccess: onSaveCallback
                    });
                }
            });
        };
        
        /**
        * Opens widget create form from site settings widgets list
        */
        widgets.openCreateServerControlWidgetDialog = function (onSaveCallback, availablePreviewOnPageContentId) {
            modal.edit({
                isPreviewAvailable: availablePreviewOnPageContentId != null,
                title: globalization.createWidgetDialogTitle,
                onLoad: function (childDialog) {
                    dynamicContent.bindDialog(childDialog, links.loadCreateServerControlWidgetDialogUrl, {
                        contentAvailable: function (dialog) {
                            initializeEditServerControlWidgetForm(dialog, availablePreviewOnPageContentId);
                        },

                        postSuccess: onSaveCallback
                    });
                }
            });
        };
        
       /**
       * Initializes 'Edit Html Content Widget' dialog form.
       */
        function initializeEditHtmlContentWidgetForm(dialog, availablePreviewOnPageContentId) {
            if (availablePreviewOnPageContentId !== null) {
                dialog.container.find(selectors.widgetPreviewPageContentId).val(availablePreviewOnPageContentId);
            }
            
            dialog.container.find(selectors.enableCustomCss).on('click', function () {
                showHideCustomCssText(dialog);
            });

            dialog.container.find(selectors.enableCustomJs).on('click', function () {
                showHideCustomJsText(dialog);
            });

            dialog.container.find(selectors.enableCustomHtml).on('click', function () {
                showHideCustomHtmlText(dialog);
            });
            
            dialog.container.find(selectors.destroyDraftVersionLink).on('click', function () {
                var contentId = dialog.container.find(selectors.contentId).val();

                contentHistory.destroyDraftVersion(contentId, dialog.container, function (publishedId) {
                    dialog.close();

                    widgets.openEditHtmlContentWidgetDialog(publishedId, onEditContentSuccess, availablePreviewOnPageContentId, function () {
                        redirect.ReloadWithAlert();
                    });
                });
            });
            
            htmlEditor.initializeHtmlEditor(selectors.htmlContentWidgetContentHtmlEditor);
            htmlEditor.setSourceMode(selectors.htmlContentWidgetContentHtmlEditor);               
            
            showHideCustomCssText(dialog);
            showHideCustomJsText(dialog);
            showHideCustomHtmlText(dialog);
        };
       
        /**
        * Initializes widget form
        */
        function initializeEditServerControlWidgetForm(dialog, availablePreviewOnPageContentId) {
            if (availablePreviewOnPageContentId !== null) {
                dialog.container.find(selectors.widgetPreviewPageContentId).val(availablePreviewOnPageContentId);
            }
            
            editor.initialize(dialog.container, {
                deleteRowMessageExtractor: function () {
                    return globalization.deleteOptionConfirmMessage;
                }
            });

            dialog.container.find(selectors.addOptionLink).on('click', function () {
                editor.addNewRow(dialog.container, $(selectors.optionsTable));
            });

            dialog.container.find(selectors.widgetPreviewImageUrl).blur(function () {
                var url = dialog.container.find(selectors.widgetPreviewImageUrl).val();
                var webSiteUrlExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
                if (webSiteUrlExp.test(url)) {
                    dialog.container.find(selectors.widgetPreviewImage).attr({
                        src: url
                    });
                } else {
                    dialog.container.find(selectors.widgetPreviewImageUrl).val("");
                    dialog.container.find(selectors.widgetPreviewImage).attr({
                        src: ""
                    });
                }
            });
            
            dialog.container.find(selectors.destroyDraftVersionLink).on('click', function () {
                var contentId = dialog.container.find(selectors.contentId).val();

                contentHistory.destroyDraftVersion(contentId, dialog.container, function (publishedId) {
                    dialog.close();
                    
                    widgets.openEditServerControlWidgetDialog(publishedId, onEditContentSuccess, availablePreviewOnPageContentId, function () {
                        redirect.ReloadWithAlert();
                    });
                });
            });
        };

        /*
        * Open a widget edit dialog by the specified widget type.
        */
        widgets.editWidget = function (widgetId, widgetType, onSaveCallback, previewAvailableOnPageContentId) {
            if (widgetType === 'ServerControl') {
                widgets.openEditServerControlWidgetDialog(widgetId, onSaveCallback, previewAvailableOnPageContentId);
            }
            else if (widgetType === 'HtmlContent') {
                widgets.openEditHtmlContentWidgetDialog(widgetId, onSaveCallback, previewAvailableOnPageContentId);
            } else {
                throw new Error($.format('A widget type "{0}" is unknown and edit action is imposible.', widgetType));
            }                                
        };

        /**
        * Deletes widget.
        */
        widgets.deleteWidget = function(widgetId, widgetVersion, widgetName, onDeleteCallback, onErrorCallback) {
            var url = $.format(links.deleteWidgetUrl, widgetId, widgetVersion),
                message = $.format(globalization.deleteWidgetConfirmMessage, widgetName),
                onDeleteCompleted = function(json) {
                    try {
                        if (json.Success && $.isFunction(onDeleteCallback)) {
                            onDeleteCallback(json);
                        }
                        else if (!json.Success && $.isFunction(onErrorCallback)) {
                            onErrorCallback(json);
                        }
                    } finally {
                        confirmDialog.close();
                    }
                },
                confirmDialog = modal.confirm({
                    content: message,
                    onAccept: function() {
                        $.ajax({
                            type: 'POST',
                            url: url,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            cache: false
                        })
                        .done(function(json) {
                            onDeleteCompleted(json);
                        })
                        .fail(function(response) {
                            onDeleteCompleted(bcms.parseFailedResponse(response));
                        });
                        return false;
                    }
                });
        };
        
        /**
        * Opens dialog for editing widget options 
        */
        widgets.configureWidget = function (pageContentId, onSaveCallback) {
            modal.open({
                title: globalization.editPageWidgetOptionsTitle,
                onLoad: function (dialog) {
                    var url = $.format(links.loadPageContentOptionsDialogUrl, pageContentId);
                    dynamicContent.bindDialog(dialog, url, {
                        contentAvailable: function (contentDialog) {
                            editor.initialize(contentDialog.container, {});
                        },

                        postSuccess: function () {
                            if ($.isFunction(onSaveCallback)) {
                                onSaveCallback();
                            }
                        }
                    });
                }
            });
        };
        
        /**
        * Opens site settings widgets list dialog
        */
        widgets.loadSiteSettingsWidgetList = function() {
            dynamicContent.bindSiteSettings(siteSettings, links.loadSiteSettingsWidgetListUrl, {
                contentAvailable: initializeSiteSettingsWidgetsList
            });
        };

        /**
        * Initializes site settings widgets list and list items
        */
        function initializeSiteSettingsWidgetsList() {
            var dialog = siteSettings.getModalDialog(),
                container = dialog.container,
                onWidgetCreated = function(json) {
                    if (json.Success && json.Data != null) {
                        var template = $(selectors.widgetRowTemplate),
                            newRow = $(template.html()).find(selectors.widgetRowTemplateFirstRow);
                        setWidgetFields(newRow, json);
                        newRow.insertBefore($(selectors.widgetsTableFirstRow, container));
                        initializeSiteSettingsWidgetListEvents(newRow);
                        grid.showHideEmptyRow(container);
                    }
                };

            var form = dialog.container.find(selectors.siteSettingsWidgetsListForm);
            grid.bindGridForm(form, function(data) {
                siteSettings.setContent(data);
                widgets.initializeSiteSettingsWidgetsList(data);
            });

            form.on('submit', function(event) {
                event.preventDefault();
                searchSiteSettingsWidgets(form);
                return false;
            });

            form.find(selectors.widgetsSearchButton).on('click', function() {
                searchSiteSettingsWidgets(form);
            });

            container.find(selectors.widgetCreateButton).on('click', function () {
                widgets.openCreateHtmlContentWidgetDialog(onWidgetCreated, null);
            });

            container.find(selectors.widgetRegisterButton).on('click', function () {
                widgets.openCreateServerControlWidgetDialog(onWidgetCreated);
            });
            
            initializeSiteSettingsWidgetListEvents(container);
        };

        /**
        * Search site settings widgets.
        */
        function searchSiteSettingsWidgets(form) {
            grid.submitGridForm(form, function(data) {
                siteSettings.setContent(data);
                initializeSiteSettingsWidgetsList();
            });
        };

        /**
        * Initializes site settings widgets list items.
        */
        function initializeSiteSettingsWidgetListEvents(container) {
            container.find(selectors.widgetRowCells).on('click', function () {
                var editButton = $(this).parents(selectors.widgetParentRow).find(selectors.widgetRowEditButton);
                editSiteSettingsWidget(container, editButton);
            });

            container.find(selectors.widgetRowHistoryButton).on('click', function (event) {
                bcms.stopEventPropagation(event);
                
                var historyButton = $(this);
                var contentId = historyButton.parents(selectors.widgetParentRow).data('id');
                contentHistory.openPageContentHistoryDialog(contentId, null);
            });
            
            container.find(selectors.widgetsRowDeleteButtons).on('click', function (event) {
                bcms.stopEventPropagation(event);
                deleteSiteSettingsWidget(container, $(this));
            });
        };

        /**
        * Calls function, which opens dialog for a widget editing.
        */
        function editSiteSettingsWidget(container, self) {
            var row = self.parents(selectors.widgetParentRow),
                id = row.data('id'),
                widgetType = row.data('type');

            widgets.editWidget(id, widgetType, function(data) {
                if (data.Data != null) {
                    setWidgetFields(row, data);
                    grid.showHideEmptyRow(container);
                }
            }, null);
        };                     

        /**
        * Deletes widget from site settings widgets list.
        */
        function deleteSiteSettingsWidget(container, self) {
            var row = self.parents(selectors.widgetParentRow),
                id = row.data('id'),
                version = row.data('version'),
                name = row.find(selectors.widgetNameCell).html();

            widgets.deleteWidget(id, version, name,
                function(data) {
                    messages.refreshBox(container, data);
                    if (data.Success) {
                        row.remove();
                        grid.showHideEmptyRow(container);
                    }
                },
                function(data) {
                    messages.refreshBox(container, data);
                }
            );
        };
        
        /**
        * Set values, returned from server to row fields
        */
        function setWidgetFields(row, json) {
            row.data('id', json.Data.Id);
            row.data('version', json.Data.Version);
            row.data('type', json.Data.WidgetType);
            row.find(selectors.widgetNameCell).html(json.Data.WidgetName);
            row.find(selectors.widgetCategoryNameCell).html(json.Data.CategoryName);

            var status = '';
            if (json.Data.IsPublished && json.Data.HasDraft) {
                status = globalization.widgetStatusPublishedWithDraft;
            } else if (json.Data.IsPublished) {
                status = globalization.widgetStatusPublished;
            } else if (json.Data.HasDraft) {
                status = globalization.widgetStatusDraft;
            }
            row.find(selectors.widgetStatusCell).html(status);
        };
        
        /**
        * Shows/hides custom css field in a html content widget edit form
        */
        function showHideCustomCssText(dialog) {
            if (dialog.container.find(selectors.enableCustomCss).attr('checked')) {
                dialog.container.find(selectors.customCssContainer).show();
            } else {
                dialog.container.find(selectors.customCssContainer).hide();
            }
        };

        function showHideCustomJsText(dialog) {
            if (dialog.container.find(selectors.enableCustomJs).attr('checked')) {
                dialog.container.find(selectors.customJsContainer).show();
            } else {
                dialog.container.find(selectors.customJsContainer).hide();
            }
        };

        function showHideCustomHtmlText(dialog) {
            if (dialog.container.find(selectors.enableCustomHtml).attr('checked')) {
                dialog.container.find(selectors.customHtmlContainer).show();                
            } else {
                dialog.container.find(selectors.customHtmlContainer).hide();
            }
        };
        
        /**
        * Called when editing page content
        */
        function onEditContent(sender) {
            var element = $(sender),
                contentId = element.data('contentId'),
                pageContentId = element.data('pageContentId'),
                onSave = function (json) {
                    var result = json.Data;
                    if (result.DesirableStatus === bcms.contentStatus.preview) {
                        try {
                            preview.previewPageContent(bcms.pageId, result.PreviewOnPageContentId);
                        } finally {
                            return false;
                        }                        
                    } else {
                        redirect.ReloadWithAlert();
                    }                    
                };

            if (element.hasClass(classes.regionWidget)) {
                widgets.openEditServerControlWidgetDialog(contentId, onSave, pageContentId);
            } else if (element.hasClass(classes.regionAdvancedContent)) {
                widgets.openEditHtmlContentWidgetDialog(contentId, onSave, pageContentId);
            }
        }
        
        /**
        * Called on after successfull edit content save
        */
        function onEditContentSuccess() {
            redirect.ReloadWithAlert();
        }

        /**
        * Initializes widgets module.
        */
        widgets.init = function () {
            console.log('Initializing bcms.pages.widgets module.');

            /**
            * Subscribe to events
            */
            bcms.on(bcms.events.editContent, onEditContent);
        };

        /**
        * Register initialization
        */
        bcms.registerInit(widgets.init);

        return widgets;
    });

