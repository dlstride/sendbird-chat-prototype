using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(nowProto1.UI.Startup))]
namespace nowProto1.UI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
