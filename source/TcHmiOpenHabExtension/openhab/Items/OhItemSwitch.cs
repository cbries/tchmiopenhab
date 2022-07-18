using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItemSwitch : OhItem, IOhItemSwitch
    {
        [JsonProperty("isOn")] public bool IsOn { get; set; } = false;

        public override bool Parse(JToken tkn)
        {
            if (!base.Parse(tkn)) return false;

            if (!string.IsNullOrEmpty(State))
                IsOn = State.Equals("ON", StringComparison.OrdinalIgnoreCase);

            return true;
        }
    }
}
