using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItemDateTime : OhItem
    {
        public override bool Parse(JToken tkn)
        {
            if (!base.Parse(tkn)) return false;

            return true;
        }
    }
}
