using System;
using System.Collections.Generic;
using TcHmiSrv.Core;
using TcHmiSrv.Core.General;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public partial class OhItemSymbol
    {
        protected override async System.Threading.Tasks.Task<Value> WriteAsync(Queue<string> elements, Value value, Context context)
        {
            if (elements.Count == 0)
                throw new ArgumentException("Missing elements because the entire machine cannot be overwritten.", nameof(elements));

            var element = elements.Dequeue();

            if (elements.Count > 0)
                throw new ArgumentException("Too many elements.", nameof(elements));

            var itemName = Item?.Name;
            var itemState = value.ToString();

            switch (element)
            {
                case "value":
                    {
                        TcHmiAsyncLogger.Send(Severity.Info, $"write value: {itemName} => {itemState}");

                        if (itemState.Trim().IndexOf("-1", StringComparison.OrdinalIgnoreCase) != -1)
                            Controller?.SendCommand(itemName, "STOP");
                        else
                            Controller?.SendCommand(itemName, itemState);
                    }
                    return value;

                case "state":
                    Controller?.SendCommand(itemName, itemState);
                    return value;

                case "isOn":
                    if (!string.IsNullOrEmpty(itemState))
                    {
                        if (bool.TryParse(itemState, out var boolValue))
                        {
                            if (boolValue)
                                Controller?.SendCommand(itemName, "ON");
                            else
                                Controller?.SendCommand(itemName, "OFF");
                        }
                    }
                    return value;

                default:
                    throw new ArgumentException(string.Concat("Element is read-only or unknown: ", element), nameof(elements));
            }
        }

    }
}
