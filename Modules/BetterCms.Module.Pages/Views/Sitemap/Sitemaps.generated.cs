﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    
    #line 1 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Pages.Content.Resources;
    
    #line default
    #line hidden
    
    #line 2 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Pages.Controllers;
    
    #line default
    #line hidden
    
    #line 3 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Pages.ViewModels.SiteSettings;
    
    #line default
    #line hidden
    
    #line 4 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Root.Content.Resources;
    
    #line default
    #line hidden
    
    #line 5 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Root.Mvc.Grids.Extensions;
    
    #line default
    #line hidden
    
    #line 6 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Root.Mvc.Grids.TableRenderers;
    
    #line default
    #line hidden
    
    #line 7 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using BetterCms.Module.Root.Mvc.Helpers;
    
    #line default
    #line hidden
    
    #line 8 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using Microsoft.Web.Mvc;
    
    #line default
    #line hidden
    
    #line 9 "..\..\Views\Sitemap\Sitemaps.cshtml"
    using MvcContrib.UI.Grid;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/Sitemap/Sitemaps.cshtml")]
    public partial class _Views_Sitemap_Sitemaps_cshtml : System.Web.Mvc.WebViewPage<BetterCms.Module.Pages.ViewModels.Filter.SitemapsGridViewModel<SiteSettingSitemapViewModel>>
    {
        public _Views_Sitemap_Sitemaps_cshtml()
        {
        }
        public override void Execute()
        {
            
            #line 11 "..\..\Views\Sitemap\Sitemaps.cshtml"
  
    Action<ColumnBuilder<SiteSettingSitemapViewModel>> columns = column =>
    {
        column.EditButtonColumn();
        column.For(m => m.Title)
            .Named(NavigationGlobalization.SiteSettings_Sitemaps_TitleColumn)
            .SortColumnName("Title")
            .Attributes(@class => "bcms-sitemap-title");
        column.HistoryButtonColumn();
        column.DeleteButtonColumn();
    };

            
            #line default
            #line hidden
WriteLiteral("\n");

            
            #line 23 "..\..\Views\Sitemap\Sitemaps.cshtml"
 using (Html.BeginForm<SitemapController>(f => f.Sitemaps(null), FormMethod.Post, new { @id = "bcms-sitemaps-form", @class = "bcms-ajax-form" }))
{

            
            #line default
            #line hidden
WriteLiteral("    <div");

WriteLiteral(" class=\"bcms-modal-frame-holder\"");

WriteLiteral(">\r\n");

WriteLiteral("        ");

            
            #line 26 "..\..\Views\Sitemap\Sitemaps.cshtml"
   Write(Html.SiteSettingsMessagesBox());

            
            #line default
            #line hidden
WriteLiteral("\r\n");

WriteLiteral("        ");

            
            #line 27 "..\..\Views\Sitemap\Sitemaps.cshtml"
   Write(Html.HiddenGridOptions(Model.GridOptions));

            
            #line default
            #line hidden
WriteLiteral("\r\n        <div");

WriteLiteral(" class=\"bcms-top-block-holder\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"bcms-large-titles\"");

WriteLiteral(">");

            
            #line 29 "..\..\Views\Sitemap\Sitemaps.cshtml"
                                      Write(NavigationGlobalization.SiteSettings_Sitemaps_Title);

            
            #line default
            #line hidden
WriteLiteral("</div>\r\n\r\n            <div");

WriteLiteral(" class=\"bcms-btn-links-main\"");

WriteLiteral(" id=\"bcms-create-sitemap-button\"");

WriteLiteral(">");

            
            #line 31 "..\..\Views\Sitemap\Sitemaps.cshtml"
                                                                        Write(NavigationGlobalization.SiteSettings_Sitemaps_AddNew);

            
            #line default
            #line hidden
WriteLiteral("</div>\r\n\r\n            <div");

WriteLiteral(" class=\"bcms-search-block\"");

WriteLiteral(">\r\n");

WriteLiteral("                ");

            
            #line 34 "..\..\Views\Sitemap\Sitemaps.cshtml"
           Write(Html.TextBoxFor(m => m.SearchQuery, new { @class = "bcms-editor-field-box bcms-search-query", @placeholder = RootGlobalization.WaterMark_Search }));

            
            #line default
            #line hidden
WriteLiteral("\r\n                <div");

WriteLiteral(" class=\"bcms-btn-search\"");

WriteLiteral(" id=\"bcms-sitemaps-search-btn\"");

WriteLiteral(">");

            
            #line 35 "..\..\Views\Sitemap\Sitemaps.cshtml"
                                                                      Write(NavigationGlobalization.SiteSettings_Sitemaps_Search);

            
            #line default
            #line hidden
WriteLiteral("</div>\r\n            </div>\r\n\r\n            <div");

WriteLiteral(" class=\"bcms-featured-grid bcms-clearfix\"");

WriteLiteral(">\r\n");

WriteLiteral("                ");

            
            #line 39 "..\..\Views\Sitemap\Sitemaps.cshtml"
           Write(Html.RenderPaging(Model));

            
            #line default
            #line hidden
WriteLiteral("\r\n            </div>\r\n        </div>\r\n     \r\n");

WriteLiteral("        ");

            
            #line 43 "..\..\Views\Sitemap\Sitemaps.cshtml"
   Write(Html.Grid(Model.Items).Sort(Model.GridOptions).Columns(columns).Attributes(@class => "bcms-tables").RenderUsing(new EditableHtmlTableGridRenderer<SiteSettingSitemapViewModel>()));

            
            #line default
            #line hidden
WriteLiteral("\r\n    </div>\r\n");

            
            #line 45 "..\..\Views\Sitemap\Sitemaps.cshtml"
}

            
            #line default
            #line hidden
WriteLiteral("\r\n<script");

WriteLiteral(" type=\"text/html\"");

WriteLiteral(" id=\"bcms-sitemap-list-row-template\"");

WriteLiteral(">\r\n");

WriteLiteral("    ");

            
            #line 48 "..\..\Views\Sitemap\Sitemaps.cshtml"
Write(Html.Grid(new List<SiteSettingSitemapViewModel> { new SiteSettingSitemapViewModel() }).Columns(columns).Attributes(@class => "bcms-tables").RenderUsing(new HtmlTableGridSingleRowRenderer<SiteSettingSitemapViewModel>()));

            
            #line default
            #line hidden
WriteLiteral("\r\n</script>\r\n");

        }
    }
}
#pragma warning restore 1591
