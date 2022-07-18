using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItemNumber : OhItem, IOhItemNumber
    {
        [JsonProperty("value")] public double Value { get; set; } = 0.0;
        [JsonProperty("minimum")] public double Minimum { get; set; } = int.MinValue;
        [JsonProperty("maximum")] public double Maximum { get; set; } = int.MaxValue;
        [JsonProperty("step")] public double Step { get; set; }

        public override bool Parse(JToken tkn)
        {
            if (!base.Parse(tkn)) return false;

            if (!string.IsNullOrEmpty(State))
                Value = State.ToDouble();

            var o = tkn as JObject;
            if (o["stateDescription"] is JObject stateDescription)
            {
                Minimum = stateDescription["minimum"].GetDoubleValue(int.MinValue);
                Maximum = stateDescription["maximum"].GetDoubleValue(int.MaxValue);
                Step = stateDescription["step"].GetDoubleValue(0.1);
            }

            return true;
        }
    }
}
