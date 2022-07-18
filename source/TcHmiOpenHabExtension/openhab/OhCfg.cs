using System;

namespace TcHmiOpenHabExtension.openhab
{
    internal class OhCfg
    {
        public string Host { get; set; }
        public UInt16 Port { get; set; } = 8080;
        public string ApiKey { get; set; }
        public string GroupFilter { get; set; }
    }
}
