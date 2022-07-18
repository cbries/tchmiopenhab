using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItemGroup : OhItem
    {
        public override bool Parse(JToken tkn)
        {
            if (!base.Parse(tkn)) return false;

            return true;
        }
    }
}
