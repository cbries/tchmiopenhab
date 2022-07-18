using System;

namespace TcHmiOpenHabExtension.openhab.SystemInfo
{
    /*
{
  "systemInfo": {
    "configFolder": "/etc/openhab",
    "userdataFolder": "/var/lib/openhab",
    "logFolder": "/var/log/openhab",
    "javaVersion": "11.0.15",
    "javaVendor": "Debian",
    "osName": "Linux",
    "osVersion": "5.10.0-0.bpo.8-amd64",
    "osArchitecture": "amd64",
    "availableProcessors": 4,
    "freeMemory": 198358112,
    "totalMemory": 1091567616
  }
}     
     */
    public interface IOhSystemInfo
    {
        string ConfigFolder { get; }
        string UserdataFolder { get; }
        string LogFolder { get; }
        string JavaVersion { get; }
        string JavaVendor { get; }
        string OsName { get; }
        string OsArchitecture { get; }
        int AvailableProcessors { get; }
        long FreeMemory { get; }
        long TotalMemory { get; }
    }
}
