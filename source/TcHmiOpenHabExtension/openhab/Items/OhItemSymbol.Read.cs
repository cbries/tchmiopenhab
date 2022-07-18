using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using TcHmiSrv.Core;
using TcHmiSrv.Core.Tools.Json.Newtonsoft;
using TcHmiSrv.Core.Tools.Json.Newtonsoft.Converters;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public partial class OhItemSymbol
    {
        protected override async System.Threading.Tasks.Task<Value> ReadAsync(Queue<string> elements, Context context)
        {
            // Convert the entire machine to JSON because no sub-element is requested
            if (elements.Count == 0)
                return TcHmiJsonSerializer.Deserialize(ValueJsonConverter.DefaultConverter, JsonConvert.SerializeObject(Item));

            // Get the name if the requested sub-element
            var element = elements.Dequeue();

            // A sub-element of a sub-element cannot be requested because machines contain only top-level properties
            if (elements.Count > 0)
                throw new ArgumentException("Too many elements.", nameof(elements));

            switch (element)
            {
                #region IOhItem

                case "name":
                    return Item.Name;

                case "state":
                    {
                        var state = Controller?.GetStateOf(Item.Name);
                        if (state == null) return Item.State;
                        return state.ToString();
                    }

                case "transformedState":
                    return Item.TransformedState;

                case "type":
                    return Item.Type;

                case "isReadonly":
                    return Item.IsReadonly;

                case "pattern":
                    return Item.Pattern;

                case "groupNames":
                    {
                        var listOfGroups = new List<Value>();
                        var grpNames = Item.GroupNames;
                        foreach (var it in grpNames)
                            listOfGroups.Add(it);
                        return new Value(listOfGroups);
                    }

                #endregion

                #region IOhItemNumber

                case "value":
                    {
                        var state = Controller?.GetStateOf(Item.Name);
                        if (state == null)
                            return (Item as IOhItemNumber)?.Value ?? 0.0;
                        var sstate = state.ToString();
                        if(string.IsNullOrEmpty(sstate))
                            return (Item as IOhItemNumber)?.Value ?? 0.0;

                        return sstate.ToDouble();
                    }
                    break;

                case "minimum":
                    {
                        if (Item is IOhItemNumber itemNumber)
                            return itemNumber.Minimum;
                        return 0;
                    }

                case "maximum":
                    {
                        if (Item is IOhItemNumber itemNumner)
                            return itemNumner.Maximum;
                        return 0;
                    }

                case "step":
                    {
                        if (Item is IOhItemNumber itemNumner)
                            return itemNumner.Step;
                        return 0;
                    }

                #endregion

                #region IOhItemSwitch

                case "isOn":
                    {
                        var state = Controller?.GetStateOf(Item.Name);
                        if (state == null)
                            return (Item as IOhItemSwitch)?.IsOn ?? false;
                        var sstate = state.ToString();
                        if (string.IsNullOrEmpty(sstate))
                            return (Item as IOhItemSwitch)?.IsOn ?? false;

                        if (sstate.Equals("ON", StringComparison.OrdinalIgnoreCase))
                            return true;

                        return false;
                    }

                #endregion

                #region IOhSystemInfo

                case "systemInfo::configFolder":
                    {
                        var systemInfo = await Controller.QuerySystemInfo();
                        if (systemInfo == null) return null;
                        return new Value(systemInfo.ConfigFolder);
                    }

                #endregion

                default:
                    throw new ArgumentException(string.Concat("Unknown element: ", element), nameof(elements));
            }
        }
    }
}
