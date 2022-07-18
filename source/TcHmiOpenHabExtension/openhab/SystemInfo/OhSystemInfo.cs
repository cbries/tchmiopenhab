using Newtonsoft.Json;

namespace TcHmiOpenHabExtension.openhab.SystemInfo
{
    public class OhSystemInfo : IOhSystemInfo
    {
        [JsonProperty("configFolder")] public string ConfigFolder { get; set; }
        [JsonProperty("userdataFolder")]  public string UserdataFolder { get; set; }
        [JsonProperty("logFolder")]  public string LogFolder { get; set; }
        [JsonProperty("javaVersion")]  public string JavaVersion { get; set; }
        [JsonProperty("javaVendor")]  public string JavaVendor { get; set; }
        [JsonProperty("osName")]  public string OsName { get; set; }
        [JsonProperty("osArchitecture")]  public string OsArchitecture { get; set; }
        [JsonProperty("availableProcessors")]  public int AvailableProcessors { get; set; }
        [JsonProperty("freeMemory")]  public long FreeMemory { get; set; }
        [JsonProperty("totalMemory")]  public long TotalMemory { get; set; }
    }
}
