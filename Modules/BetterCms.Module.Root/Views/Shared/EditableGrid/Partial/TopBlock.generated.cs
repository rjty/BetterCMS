﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.34209
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
    
    #line 1 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    using BetterCms.Module.Root.Content.Resources;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/Shared/EditableGrid/Partial/TopBlock.cshtml")]
    public partial class _Views_Shared_EditableGrid_Partial_TopBlock_cshtml : System.Web.Mvc.WebViewPage<BetterCms.Module.Root.ViewModels.Shared.EditableGridViewModel>
    {
        public _Views_Shared_EditableGrid_Partial_TopBlock_cshtml()
        {
        }
        public override void Execute()
        {
WriteLiteral("\r\n");

WriteLiteral("<div");

WriteAttribute("class", Tuple.Create(" class=\"", 126), Tuple.Create("\"", 154)
            
            #line 5 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
, Tuple.Create(Tuple.Create("", 134), Tuple.Create<System.Object, System.Int32>(Model.TopBlockClass
            
            #line default
            #line hidden
, 134), false)
);

WriteLiteral(">\r\n");

            
            #line 6 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    
            
            #line default
            #line hidden
            
            #line 6 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
     if (!string.IsNullOrWhiteSpace(Model.TopBlockTitle))
    {

            
            #line default
            #line hidden
WriteLiteral("        <div");

WriteLiteral(" class=\"bcms-large-titles\"");

WriteLiteral(">");

            
            #line 8 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
                                  Write(Model.TopBlockTitle);

            
            #line default
            #line hidden
WriteLiteral("</div>\r\n");

            
            #line 9 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    }

            
            #line default
            #line hidden
WriteLiteral("\r\n");

WriteLiteral("    ");

            
            #line 11 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
Write(Html.Partial(Model.TopBlockAddItemView, Model));

            
            #line default
            #line hidden
WriteLiteral("\r\n\r\n");

            
            #line 13 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    
            
            #line default
            #line hidden
            
            #line 13 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
     if (Model.ShowSearch)
    {

            
            #line default
            #line hidden
WriteLiteral("        <div");

WriteLiteral(" class=\"bcms-search-block\"");

WriteLiteral(">\r\n            <input");

WriteLiteral(" data-bind=\"value: options().searchQuery, valueUpdate: \'afterkeydown\', enterPress" +
": searchItems, hasfocus: options().hasFocus\"");

WriteLiteral(" type=\"text\"");

WriteLiteral(" class=\"bcms-editor-field-box\"");

WriteAttribute("placeholder", Tuple.Create(" placeholder=\"", 616), Tuple.Create("\"", 665)
            
            #line 16 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
                                                                                                                        , Tuple.Create(Tuple.Create("", 630), Tuple.Create<System.Object, System.Int32>(RootGlobalization.WaterMark_Search
            
            #line default
            #line hidden
, 630), false)
);

WriteLiteral(" />\r\n            <div");

WriteLiteral(" data-bind=\"click: searchItems\"");

WriteLiteral(" class=\"bcms-btn-search\"");

WriteLiteral(">");

            
            #line 17 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
                                                                   Write(RootGlobalization.Button_Search);

            
            #line default
            #line hidden
WriteLiteral("</div>\r\n        </div>\r\n");

            
            #line 19 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    }

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 21 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    
            
            #line default
            #line hidden
            
            #line 21 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
     if (Model.AddPaging)
    {

            
            #line default
            #line hidden
WriteLiteral("        <!-- ko with: options().paging -->\r\n");

WriteLiteral("        <div");

WriteLiteral(" class=\"bcms-featured-grid bcms-clearfix\"");

WriteLiteral(">\r\n");

WriteLiteral("            ");

            
            #line 25 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
       Write(Html.Partial(Model.PagingView, Model));

            
            #line default
            #line hidden
WriteLiteral("\r\n        </div>\r\n");

WriteLiteral("        <!-- /ko -->\r\n");

            
            #line 28 "..\..\Views\Shared\EditableGrid\Partial\TopBlock.cshtml"
    }

            
            #line default
            #line hidden
WriteLiteral("</div>");

        }
    }
}
#pragma warning restore 1591
