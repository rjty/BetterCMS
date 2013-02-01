﻿/*jslint unparam: true, white: true, browser: true, devel: true */
/*global define, console */

define('bcms.sitemap', ['jquery', 'bcms', 'bcms.modal', 'bcms.siteSettings', 'bcms.forms', 'bcms.dynamicContent', 'bcms.messages', 'knockout'],
    function ($, bcms, modal, siteSettings, forms, dynamicContent, messages, ko) {
        'use strict';

        var sitemap = {},
            selectors = {
                sitemapSearchDataBind: "#bcms-sitemap-form",
                sitemapAddNodeDataBind: "#bcms-sitemap-addnode",
                sitemapAddNewPageDataBind: "#bcms-sitemap-addnewpage",
                sitemapForm: "#bcms-sitemap-form",
            },
            links = {
                loadSiteSettingsSitemapUrl: null,
                saveSitemapNodeUrl: null,
                deleteSitemapNodeUrl: null,
                sitemapEditDialogUrl: null,
                sitemapAddNewPageDialogUrl: null,
            },
            globalization = {
                sitemapEditorDialogTitle: null,
                sitemapEditorDialogClose: null,
                sitemapEditorDialogCustomLinkTitle: null,
                sitemapAddNewPageDialogTitle: null,
                sitemapAddNewPageDialogClose: null,
            },
            defaultIdValue = '00000000-0000-0000-0000-000000000000',
            DropZoneTypes = {
                None: 'none',
                EmptyListZone: 'emptyListZone',
                TopZone: 'topZone',
                MiddleZone: 'middleZone',
                BottomZone: 'bottomZone'
            };

        /**
        * Assign objects to module.
        */
        sitemap.links = links;
        sitemap.globalization = globalization;
        sitemap.activeMapModel = null;
        sitemap.activeLoadingContainer = null;
        sitemap.activeMessageContainer = null;

        /**
        * Loads a sitemap view to the site settings container.
        */
        sitemap.loadSiteSettingsSitemap = function () {
            var sitemapController = new SiteSettingsMapController();
            
            dynamicContent.bindSiteSettings(siteSettings, links.loadSiteSettingsSitemapUrl, {
                contentAvailable: sitemapController.initialize
            });
        };

        /**
        * Loads a sitemap view to the add node dialog container.
        */
        sitemap.loadAddNodeDialog = function () {
            var addNodeController = new AddNodeMapController();
            modal.open({
                title: globalization.sitemapEditorDialogTitle,
                cancelTitle: globalization.sitemapEditorDialogClose,
                disableAccept: true,
                onLoad: function (dialog) {
                    dynamicContent.setContentFromUrl(dialog, links.sitemapEditDialogUrl, {
                        done: function (content) {
                            addNodeController.initialize(content, dialog);
                        },
                    });
                },
                onClose: function () {
                    sitemap.loadSiteSettingsSitemap();
                }
            });
        };

        /**
        * Shows add new page to sitemap dialog.
        */
        sitemap.loadAddNewPageDialog = function (data) {
            if (data && data.Data && data.Data.Title && data.Data.PageUrl) {
                var addPageController = new AddNewPageMapController(data.Data.Title, data.Data.PageUrl);
                modal.open({
                    title: globalization.sitemapAddNewPageDialogTitle,
                    cancelTitle: globalization.sitemapAddNewPageDialogClose,
                    disableAccept: true,
                    onLoad: function (dialog) {
                        dynamicContent.setContentFromUrl(dialog, links.sitemapAddNewPageDialogUrl, {
                            done: function (content) {
                                addPageController.initialize(content, dialog);
                            }
                        });
                    },
                    onClose: function() {
                    if (data.Callback && $.isFunction(data.Callback)) {
                        data.Callback(data);
                    }
                }
            });
            }
        };


        // --- Controllers ----------------------------------------------------
        /**
        * Controller for sitemap in site settings dialog.
        */
        function SiteSettingsMapController() {
            var self = this;
            self.container = null;
            self.sitemapSearchModel = null;

            self.initialize = function(content) {
                self.container = siteSettings.getModalDialog().container;
                sitemap.activeMessageContainer = self.container;
                sitemap.activeLoadingContainer = self.container.find(selectors.sitemapSearchDataBind);
                    
                sitemap.showMessage(content);
                if (content.Success) {
                    // Create data models.
                    var sitemapModel = new SitemapViewModel();
                    sitemapModel.parseJsonNodes(content.Data.RootNodes);
                    self.sitemapSearchModel = new SearchSitemapViewModel(sitemapModel);
                    sitemap.activeMapModel = sitemapModel;

                    // Bind models.
                    var context = self.container.find(selectors.sitemapSearchDataBind).get(0);
                    if (context) {
                        ko.applyBindings(self.sitemapSearchModel, context);

                        // Update validation.
                        var form = self.container.find(selectors.sitemapForm);
                        if ($.validator && $.validator.unobtrusive) {
                            form.removeData("validator");
                            form.removeData("unobtrusiveValidation");
                            $.validator.unobtrusive.parse(form);
                        }
                    }
                }
            };
        }
        
        /**
        * Controller for sitemap add node dialog.
        */
        function AddNodeMapController() {
            var self = this;
            self.container = null;
            self.pageLinksModel = null;

            self.initialize = function (content, dialog) {
                self.container = dialog.container;
                sitemap.activeMessageContainer = self.container;
                sitemap.activeLoadingContainer = self.container.find(selectors.sitemapAddNodeDataBind);

                messages.refreshBox(self.container, content);
                if (content.Success) {
                    // Create data models.
                    var sitemapModel = new SitemapViewModel();
                    sitemapModel.parseJsonNodes(content.Data.RootNodes);
                    self.pageLinksModel = new SearchPageLinksViewModel(sitemapModel);
                    self.pageLinksModel.parseJsonLinks(content.Data.PageLinks);
                    sitemap.activeMapModel = sitemapModel;

                    // Bind models.
                    var context = self.container.find(selectors.sitemapAddNodeDataBind).get(0);
                    if (context) {
                        ko.applyBindings(self.pageLinksModel, context);

                        // Update validation.
                        var form = self.container.find('FORM');
                        if ($.validator && $.validator.unobtrusive) {
                            form.removeData("validator");
                            form.removeData("unobtrusiveValidation");
                            $.validator.unobtrusive.parse(form);
                        }
                    }
                }
            };
        }
        
        /**
        * Controller for sitemap add new page dialog.
        */
        function AddNewPageMapController(title, url) {
            var self = this;
            self.container = null;
            self.newPageModel = null;
            
            self.pageLinkModel = new PageLinkViewModel();
            self.pageLinkModel.title(title);
            self.pageLinkModel.url(url);

            self.initialize = function (content, dialog) {
                self.container = dialog.container;
                sitemap.activeMessageContainer = self.container;
                sitemap.activeLoadingContainer = self.container.find(selectors.sitemapAddNewPageDataBind);

                messages.refreshBox(self.container, content);
                if (content.Success) {
                    var onSkip = function () {
                        dialog.close();
                    };
                    
                    // Create data models.
                    var sitemapModel = new SitemapViewModel();
                    sitemapModel.parseJsonNodes(content.Data.RootNodes);
                    self.newPageModel = new AddNewPageViewModel(sitemapModel, self.pageLinkModel, onSkip);
                    
                    sitemap.activeMapModel = sitemapModel;

                    // Bind models.
                    var context = self.container.find(selectors.sitemapAddNewPageDataBind).get(0);
                    if (context) {
                        ko.applyBindings(self.newPageModel, context);

                        // Update validation.
                        var form = self.container.find('FORM');
                        if ($.validator && $.validator.unobtrusive) {
                            form.removeData("validator");
                            form.removeData("unobtrusiveValidation");
                            $.validator.unobtrusive.parse(form);
                        }
                    }
                }
            };
        }
        // --------------------------------------------------------------------
        

        // --- Helpers --------------------------------------------------------
        /**
        * Helper function to show json messages.
        */
        sitemap.showMessage = function (content) {
            messages.refreshBox(sitemap.activeMessageContainer, content);
        };
        
        /**
        * Helper function to show loading.
        */
        sitemap.showLoading = function (loading) {
            if (loading) {
                $(sitemap.activeLoadingContainer).showLoading();
            } else {
                $(sitemap.activeLoadingContainer).hideLoading();
            }
        };
        
        /**
        * Helper function to add knockout binding 'draggable'.
        */
        function addDraggableBinding() {
            ko.bindingHandlers.draggable = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    var dragObject = viewModel,
                        setup = {
                            revert: true,
                            revertDuration: 0,
                            appendTo: "body",
                            helper: function () {
                                if (dragObject.isExpanded) {
                                    dragObject.isExpanded(false);
                                }
                                if (dragObject.isBeingDragged) {
                                    dragObject.isBeingDragged(true);
                                }
                                return $(this).clone().width($(this).width()).css({ zIndex: 9999 });
                            },
                            start: function() {
                                $(this).hide();
                            },
                            stop: function(event, ui) {
                                ui.helper.remove();
                                $(this).show();
                                if (dragObject.isBeingDragged) {
                                    dragObject.isBeingDragged(false);

                                }
                            }
                        };
                    $(element).draggable(setup).data("dragObject", dragObject);
                    $(element).disableSelection();
                }
            };
        }
        
        /**
        * Helper function to add knockout binding 'droppable'.
        */
        function addDroppableBinding() {
            ko.bindingHandlers.droppable = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    var dropZoneObject = viewModel,
                        dropZoneType = valueAccessor(),
                        setup = {
                            tolerance: "pointer",
                            over: function() {
                                dropZoneObject.activeZone(dropZoneType);
                            },
                            out: function() {
                                dropZoneObject.activeZone(DropZoneTypes.None);
                            },
                            drop: function (event, ui) {
                                var forFix = $(ui.draggable).data('draggable'),
                                    dragObject = $(ui.draggable).data("dragObject"),
                                    updateOrder = true;
                                ui.helper.remove();

                                if (dragObject.parentNode) {
                                    dragObject.parentNode.childNodes.remove(dragObject);
                                } else {
                                    // Create node from page link.
                                    var node = new NodeViewModel();
                                    node.title(dragObject.title());
                                    node.url(dragObject.url());
                                    if (dropZoneType == DropZoneTypes.EmptyListZone || dropZoneType == DropZoneTypes.MiddleZone) {
                                        node.parentNode = dropZoneObject;
                                    } else {
                                        node.parentNode = dropZoneObject.parentNode;
                                    }
                                    if (dragObject.isCustom()) {
                                        updateOrder = false;
                                        node.startEditSitemapNode();
                                        node.callbackAfterSuccessSaving = function () {
                                            sitemap.activeMapModel.updateNodesOrderAndParent();
                                        };
                                        node.callbackAfterFailSaving = function (newNode) {
                                            newNode.parentNode.childNodes.remove(newNode);
                                        };
                                    }
                                    dragObject = node;
                                }
                                
                                dragObject.isBeingDragged(false);
                                
                                // Add node to tree.
                                var index;
                                if (dropZoneType == DropZoneTypes.EmptyListZone) {
                                    dropZoneObject.childNodes.splice(0, 0, dragObject);
                                }
                                else if (dropZoneType == DropZoneTypes.TopZone) {
                                    index = dropZoneObject.parentNode.childNodes().indexOf(dropZoneObject);
                                    dropZoneObject.parentNode.childNodes.splice(index, 0, dragObject);
                                }
                                else if (dropZoneType == DropZoneTypes.MiddleZone) {
                                    dropZoneObject.childNodes.splice(0, 0, dragObject);
                                    dropZoneObject.isExpanded(true);
                                }
                                else if (dropZoneType == DropZoneTypes.BottomZone) {
                                    index = dropZoneObject.parentNode.childNodes().indexOf(dropZoneObject);
                                    dropZoneObject.parentNode.childNodes.splice(index + 1, 0, dragObject);
                                }
                                dropZoneObject.activeZone(DropZoneTypes.None);
                                
                                if (updateOrder) {
                                    sitemap.activeMapModel.updateNodesOrderAndParent();
                                }

                                // Fix for jQuery drag object.
                                $(ui.draggable).data('draggable', forFix);
                            }
                        };
                    $(element).droppable(setup);
                }
            };
        }
        // --------------------------------------------------------------------
        

        // --- View Models ----------------------------------------------------
        /**
        * Responsible for searching in sitemap.
        */
        function SearchSitemapViewModel(sitemapViewModel) {
            var self = this;
            self.searchQuery = ko.observable("");
            self.sitemap = sitemapViewModel;

            self.searchForNodes = function() {
                if (self.sitemap) {
                    var showAll = $.trim(self.searchQuery()).length === 0,
                        searchQuery = self.searchQuery().toLowerCase();

                    self.searchInNodes(self.sitemap.childNodes(), searchQuery, showAll);
                }
            };
            self.searchInNodes = function (nodes, searchQuery, showAll) {
                var hasResult = false;
                for (var i in nodes) {
                    var node = nodes[i];
                    if (showAll) {
                        node.isVisible(true);
                        self.searchInNodes(node.childNodes(), searchQuery, showAll);
                    } else {
                        node.isVisible(false);
                        node.isExpanded(false);
                        if (node.title().toLowerCase().indexOf(searchQuery) !== -1 || node.url().toLowerCase().indexOf(searchQuery) !== -1) {
                            node.isVisible(true);
                            self.searchInNodes(node.childNodes(), "", true);
                            hasResult = true;
                        } else {
                            if (self.searchInNodes(node.childNodes(), searchQuery, showAll)) {
                                node.isVisible(true);
                                node.isExpanded(true);
                                hasResult = true;
                            }
                        }
                    }
                }
                return hasResult;
            };

            self.editSitemapClicked = function() {
                sitemap.loadAddNodeDialog();
            };
        }
        
        /**
        * Responsible for sitemap structure.
        */
        function SitemapViewModel() {
            var self = this;
            self.id = function() { return defaultIdValue; };
            self.childNodes = ko.observableArray([]);
            self.someNodeIsOver = ko.observable(false);     // Someone is dragging some node over the sitemap, but not over the particular node.
            self.activeZone = ko.observable(DropZoneTypes.None);

            // Expanding or collapsing nodes.
            self.expandAll = function () {
                self.expandOrCollapse(self.childNodes(), true);
            };
            self.collapseAll = function () {
                self.expandOrCollapse(self.childNodes(), false);
            };
            self.expandOrCollapse = function (nodes, expand) {
                for (var i in nodes) {
                    var node = nodes[i];
                    node.isExpanded(expand);
                    self.expandOrCollapse(node.childNodes(), expand);
                }
            };
            
            // Updating display order and parent node info.
            self.updateNodesOrderAndParent = function () {
                self.updateNodes(self.childNodes(), self);
            };
            self.updateNodes = function (nodes, parent) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i],
                        saveIt = false;
                    
                    node.isFirstNode(i == 0);

                    if (node.displayOrder() != i) {
                        saveIt = true;
                        node.displayOrder(i);
                    }

                    if (node.parentNode != parent) {
                        saveIt = true;
                        node.parentNode = parent;
                    }

                    if (saveIt || node.id() == defaultIdValue) {
                        node.saveSitemapNode();
                    }

                    self.updateNodes(node.childNodes(), node);
                }
            };
            
            // Parse.
            self.parseJsonNodes = function (jsonNodes) {
                var nodes = [];
                for (var i = 0; i < jsonNodes.length; i++) {
                    var node = new NodeViewModel();
                    node.fromJson(jsonNodes[i]);
                    node.parentNode = self;
                    node.isFirstNode(i == 0);
                    nodes.push(node);
                }
                self.childNodes(nodes);
            };
        }
        
        /**
        * Responsible for sitemap node data.
        */
        function NodeViewModel() {
            var self = this;
            
            // Data fields.
            self.id = ko.observable(defaultIdValue);
            self.version = ko.observable(0);
            self.title = ko.observable();
            self.url = ko.observable();
            self.displayOrder = ko.observable(0);
            self.childNodes = ko.observableArray([]);
            self.parentNode = null;
            
            // For behavior.
            self.isActive = ko.observable(false);           // If TRUE - show edit fields.
            self.isExpanded = ko.observable(false);         // If TRUE - show child nodes.
            self.toggleExpand = function () {
                self.isExpanded(!self.isExpanded());
            };
            self.isBeingDragged = ko.observable(false);     // Someone is dragging the node.
            self.activeZone = ko.observable(DropZoneTypes.None);
            self.isFirstNode = ko.observable(false);
            self.hasChildNodes = function () {
                return self.childNodes().length > 0;
            };
            self.containerId = function () {
                // User for validation.
                return "id-" + self.id();
            };
            
            // For search results.
            self.isVisible = ko.observable(true);
            self.isSearchResult = ko.observable(false);
            
            // Data manipulation.
            self.startEditSitemapNode = function () {
                self.titleOldValue = self.title();
                self.urlOldValue = self.url();
                self.isActive(true);
            };
            self.cancelEditSitemapNode = function () {
                self.isActive(false);
                self.title(self.titleOldValue);
                self.url(self.urlOldValue);
                if (self.id() == defaultIdValue) {
                    self.parentNode.childNodes.remove(self);
                }
            };
            self.saveSitemapNodeWithValidation = function () {
                if ($('input', '#' + self.containerId()).valid()) {
                    self.saveSitemapNode();
                    self.isActive(false);
                }
            };
            self.saveSitemapNode = function () {
                var params = self.toJson(),
                    onSaveCompleted = function (json) {
                        sitemap.showMessage(json);
                        if (json.Success) {
                            if (json.Data) {
                                self.id(json.Data.Id);
                                self.version(json.Data.Version);
                                if (self.callbackAfterSuccessSaving && $.isFunction(self.callbackAfterSuccessSaving)) {
                                    self.callbackAfterSuccessSaving(self);
                                }
                            }
                        } else {
                            if (self.callbackAfterFailSaving && $.isFunction(self.callbackAfterFailSaving)) {
                                self.callbackAfterFailSaving(self);
                            }
                        }
                        sitemap.showLoading(false);
                    };
                sitemap.showLoading(true);
                $.ajax({
                    url: links.saveSitemapNodeUrl,
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: params
                })
                    .done(function (json) {
                        onSaveCompleted(json);
                    })
                    .fail(function (response) {
                        onSaveCompleted(bcms.parseFailedResponse(response));
                    });
            };
            self.deleteSitemapNode = function () {
                var params = self.toJson(),
                    onDeleteCompleted = function (json) {
                        sitemap.showMessage(json);
                        if (json.Success) {
                            self.parentNode.childNodes.remove(self);
                        }
                        sitemap.showLoading(false);
                    };
                sitemap.showLoading(true);
                $.ajax({
                    url: links.deleteSitemapNodeUrl,
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: params
                })
                    .done(function (json) {
                        onDeleteCompleted(json);
                    })
                    .fail(function (response) {
                        onDeleteCompleted(bcms.parseFailedResponse(response));
                    });
            };
            self.callbackAfterSuccessSaving = null;
            self.callbackAfterFailSaving = null;

            self.fromJson = function(jsonNode) {
                self.id(jsonNode.Id);
                self.version(jsonNode.Version);
                self.title(jsonNode.Title);
                self.url(jsonNode.Url);
                self.displayOrder(jsonNode.DisplayOrder);

                var nodes = [];
                if (jsonNode.ChildNodes != null) {
                    for (var i = 0; i < jsonNode.ChildNodes.length; i++) {
                        var node = new NodeViewModel();
                        node.fromJson(jsonNode.ChildNodes[i]);
                        node.parentNode = self;
                        node.isFirstNode(i == 0);
                        nodes.push(node);
                    }
                }
                self.childNodes(nodes);
            };
            self.toJson = function () {
                var params = {
                    Id: self.id(),
                    Version: self.version(),
                    Title: self.title(),
                    Url: self.url(),
                    DisplayOrder: self.displayOrder(),
                    ParentId: self.parentNode.id(),
                };
                return params;
            };
        }

        /**
        * Responsible for page searching.
        */
        function SearchPageLinksViewModel(sitemapViewModel) {
            var self = this;
            self.searchQuery = ko.observable("");
            self.pageLinks = ko.observableArray([]);
            self.sitemap = sitemapViewModel;

            self.searchForPageLinks = function () {
                var showAll = $.trim(self.searchQuery()).length === 0;
                var pageLinks = self.pageLinks();
                for (var i in pageLinks) {
                    if (showAll) {
                        pageLinks[i].isVisible(true);
                    } else {
                        var link = pageLinks[i],
                            searchQuery = self.searchQuery().toLowerCase(),
                            title = link.title().toLowerCase(),
                            url = link.url().toLowerCase();
                        link.isVisible(title.indexOf(searchQuery) !== -1 || url.indexOf(searchQuery) !== -1);
                    }
                }
            };
            
            // Parse.
            self.parseJsonLinks = function (jsonLinks) {
                var pageLinks = [],
                    customLink = new PageLinkViewModel();
                
                customLink.title(globalization.sitemapEditorDialogCustomLinkTitle);
                customLink.url('/../');
                customLink.isCustom(true);
                pageLinks.push(customLink);
                
                for (var i = 0; i < jsonLinks.length; i++) {
                    var link = new PageLinkViewModel();
                    link.fromJson(jsonLinks[i]);
                    pageLinks.push(link);
                }
                self.pageLinks(pageLinks);
            };
        }
        
        /**
        * Responsible for page link data.
        */
        function PageLinkViewModel() {
            var self = this;
            self.title = ko.observable();
            self.url = ko.observable();
            self.isVisible = ko.observable(true);
            self.isCustom = ko.observable(false);

            self.fromJson = function (json) {
                self.isVisible(true);
                self.title(json.Title);
                self.url(json.Url);
            };
        }
        
        /**
        * Responsible for new page data and sitemap.
        */
        function AddNewPageViewModel(sitemapViewModel, pageLinkViewModel, onSkip) {
            var self = this;
            self.pageLink = pageLinkViewModel;
            self.sitemap = sitemapViewModel;
            self.onSkipClick = onSkip;

            self.skipClicked = function () {
                if (self.onSkipClick && $.isFunction(self.onSkipClick)) {
                    self.onSkipClick();
                }
            };
        }
        // --------------------------------------------------------------------


        /**
        * Initializes module.
        */
        sitemap.init = function() {
            console.log('Initializing bcms.sitemap module.');
            
            // Bindings for sitemap nodes Drag'n'Drop.
            addDraggableBinding();
            addDroppableBinding();
            
            // Subscribe to events.
            bcms.on(bcms.events.pageCreated, sitemap.loadAddNewPageDialog);
        };
    
        /**
        * Register initialization.
        */
        bcms.registerInit(sitemap.init);
    
        return sitemap;
});