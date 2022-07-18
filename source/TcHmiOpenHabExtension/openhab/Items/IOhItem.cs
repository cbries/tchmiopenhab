using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public interface IOhItem
    {
        string Name { get; }
        string State { get; }
        string TransformedState { get; }
        string Type { get; }
        bool IsReadonly { get; }
        string Pattern { get; }
        IReadOnlyList<string> GroupNames { get; }

        bool Parse(JToken tkn);
    }

    public interface IOhItemNumber : IOhItem
    {
        double Value { get; }
        double Minimum { get; }
        double Maximum { get; }
        double Step { get; }
    }

    public interface IOhItemSwitch : IOhItem
    {
        bool IsOn { get; }
    }
}
