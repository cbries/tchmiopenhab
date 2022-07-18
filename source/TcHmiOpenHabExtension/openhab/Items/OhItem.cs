using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItem : IOhItem
    {
        protected List<string> _groupNames = new List<string>();

        [JsonProperty("name")] public string Name { get; set; }
        [JsonProperty("state")] public string State { get; set; }
        [JsonProperty("transformedState")] public string TransformedState { get; set; }
        [JsonProperty("type")] public string Type { get; set; }
        [JsonProperty("isReadonly")] public bool IsReadonly { get; set; } = false;
        [JsonProperty("pattern")] public string Pattern { get; set; } = string.Empty;
        [JsonProperty("groupNames")] public IReadOnlyList<string> GroupNames => _groupNames;

        public virtual bool Parse(JToken tkn)
        {
            var o = tkn as JObject;
            if (o == null) return false;
            State = o["state"].GetStringValue(string.Empty);
            TransformedState = o["transformedState"].GetStringValue(string.Empty);

            if (o["stateDescription"] is JObject stateDescription)
            {
                IsReadonly = stateDescription["readOnly"].GetBoolValue();
                Pattern = stateDescription["pattern"].GetStringValue();
            }

            Type = o["type"].GetStringValue();
            Name = o["name"].GetStringValue();

            if (o["groupNames"] is JArray groupNames)
            {
                foreach (var grpName in groupNames)
                {
                    var s = grpName?.ToString();
                    if (string.IsNullOrEmpty(s)) continue;
                    if (GroupNames.Contains(s)) continue;
                    _groupNames.Add(s);
                }
            }

            return true;
        }
    }
}