﻿using System.Web.Optimization;

namespace nowProto1.UI
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {

            // Vendor scripts
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.1.1.min.js"));

            // jQuery Validation
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            "~/Scripts/jquery.validate.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js"));

            // Inspinia script
            bundles.Add(new ScriptBundle("~/bundles/inspinia").Include(
                      "~/Scripts/app/inspinia.js"));

            // SlimScroll
            bundles.Add(new ScriptBundle("~/plugins/slimScroll").Include(
                      "~/Scripts/plugins/slimScroll/jquery.slimscroll.min.js"));

            // jQuery plugins
            bundles.Add(new ScriptBundle("~/plugins/metsiMenu").Include(
                      "~/Scripts/plugins/metisMenu/metisMenu.min.js"));

            bundles.Add(new ScriptBundle("~/plugins/pace").Include(
                      "~/Scripts/plugins/pace/pace.min.js"));

            // CSS style (bootstrap/inspinia)
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/animate.css",
                      "~/Content/style.css"));

            // Font Awesome icons
            bundles.Add(new StyleBundle("~/font-awesome/css").Include(
                      "~/fonts/font-awesome/css/font-awesome.min.css", new CssRewriteUrlTransform()));

            //Application script
            bundles.Add(new ScriptBundle("~/bundles/sendbirdapplication").Include(
                    "~/app/app.js",
                    "~/app/main/common.services.js",
                    "~/app/main/navigation.js",
                    "~/app/main/homeview.js",
                    "~/app/directives/enterpressed-directive.js",
                    "~/app/main/sendbirdservice.js",
                    "~/app/login/sendbirdlogin.js",
                    "~/app/main/shareddata.js",
                    "~/app/join/joinchannel.js",
                    "~/app/join/joindm.js"
                ));
        }
    }
}