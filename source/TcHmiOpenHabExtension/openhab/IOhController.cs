using System.Collections.Generic;
using TcHmiOpenHabExtension.openhab.Items;
using TcHmiOpenHabExtension.openhab.SystemInfo;

namespace TcHmiOpenHabExtension.openhab
{
    public interface IOhController
    {
        string HostAddr { get; set; }
        ushort HostPort { get; set; }
        string ApiKey { get; set; }
        string GroupFilter { get; set; }

        void Shutdown();
        System.Threading.Tasks.Task<List<IOhItem>> QueryItems();
        System.Threading.Tasks.Task<IOhSystemInfo> QuerySystemInfo();
        object GetStateOf(string itemName);
        bool SendCommand(string itemName, string state);
        bool StopListenToEvent();
        bool IsEventListenerRunning();
        bool StartListenToEvent();
    }
}
