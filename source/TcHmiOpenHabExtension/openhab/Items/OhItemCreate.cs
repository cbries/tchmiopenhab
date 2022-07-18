using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public static class OhItemCreate
    {
        public static OhItem Instance(JObject obj)
        {
            OhItem instance = null;
            var type = obj?["type"]?.ToString().Trim();
            if (string.IsNullOrEmpty(type)) return null;
            switch (type)
            {
                case "Contact":
                    var constactInstance = new OhItemContact();
                    if (constactInstance.Parse(obj))
                        instance = constactInstance;
                    break;

                case "Switch":
                    var switchInstance = new OhItemSwitch();
                    if (switchInstance.Parse(obj))
                        instance = switchInstance;
                    break;

                case "Group":
                    var groupInstance = new OhItemGroup();
                    if (groupInstance.Parse(obj))
                        instance = groupInstance;
                    break;

                case "Number:ElectricPotential":
                case "Number:Temperature":
                case "Number:Power":
                case "Number:Angle":
                case "Number:Dimensionless":
                case "Number:Energy":
                case "Number:Illuminance":
                case "Number:Time":
                case "Number:Intensity":
                case "Number:Length":
                case "Number:Speed":
                case "Number":
                case "Rollershutter":
                case "Dimmer":
                    var numberInstance = new OhItemNumber();
                    if (numberInstance.Parse(obj))
                        instance = numberInstance;
                    break;

                case "String":
                    var stringInstance = new OhItemString();
                    if (stringInstance.Parse(obj))
                        instance = stringInstance;
                    break;

                case "DateTime":
                    var dateTimeInstance = new OhItemDateTime();
                    if (dateTimeInstance.Parse(obj))
                        instance = dateTimeInstance;
                    break;

                    // TODO tbd
            }

            return instance;
        }
    }
}