using System;
using Newtonsoft.Json;

namespace TcHmiOpenHabExtension.openhab.Events
{
    public class EventTopic
    {
        //{
        //    "topic": "openhab/items/ShellyPlugSSHPLGS19216817877_Leistung/statechanged",
        //    "payload": {
        //        "type": "Quantity",
        //        "value": "58.49 W",
        //        "oldType": "Quantity",
        //        "oldValue": "8.05 W"
        //    },
        //    "type": "ItemStateChangedEvent"
        //}

        [JsonProperty("topic")]
        public string Topic
        {
            get => _topic;
            set
            {
                var parts = value.Split('/');
                _topicParts = new string[parts.Length];
                for (var i = 0; i < parts.Length; ++i)
                    _topicParts[i] = parts[i];
            }
        }

        private string _topic;
        private string[] _topicParts;

        public string Topic0 => _topicParts[0];
        public string Topic1 => _topicParts[1];
        public string Topic2 => _topicParts[2];
        public string Topic3 => _topicParts[3];

        public string TopicItemName => Topic2;
        public string TopicEventType => Topic3;

        [JsonProperty("payload")] public string Payload { get; set; }

        public EventPayload GetPayload()
        {
            try
            {
                var instance = JsonConvert.DeserializeObject<EventPayload>(Payload);
                instance.NativeData = Payload;
                return instance;
            }
            catch(Exception ex)
            {
#if DEBUG
                System.Diagnostics.Trace.WriteLine($"GetPayload() failed: {ex.Message}");
#endif

                return null;
            }
        }

        /// <summary>
        /// ItemStateEvent                  :   type, value
        /// ItemStateChangedEvent           :   type, value, oldType, oldValue
        /// RuleStatusInfoEvent             :   status, statusDetail
        /// GroupItemStateChangedEvent      :   type, value, oldType, oldValue
        /// </summary>
        [JsonProperty("type")] public string Type { get; set; }
    }

    public class EventPayload
    {
        [JsonIgnore]
        public string NativeData { get; set; }

        [JsonProperty("type")] public string Type { get; set; }
        [JsonProperty("value")] public string Value { get; set; }
        [JsonProperty("oldType")] public string OldType { get; set; }
        [JsonProperty("oldValue")] public string OldValue { get; set; }

        public override string ToString()
        {
            if (string.IsNullOrEmpty(Value) || string.IsNullOrEmpty(OldValue))
                return NativeData;
            return $"{OldValue}  -->  {Value}";
        }
    }
}
