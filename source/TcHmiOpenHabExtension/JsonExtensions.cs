using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension
{
    public static class JsonExtensions
    {
        public static int GetIntValue(this JToken tkn, int defaultValue = -1)
        {
            try
            {
                if (tkn == null) return defaultValue;
                var v = tkn.ToString()?.Trim();
                if (string.IsNullOrEmpty(v)) return defaultValue;
                int iv;
                if (int.TryParse(v, out iv))
                    return iv;
                return defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }
        public static double GetDoubleValue(this JToken tkn, double defaultValue = 0)
        {
            try
            {
                if (tkn == null) return defaultValue;
                var v = tkn.ToString()?.Trim();
                if (string.IsNullOrEmpty(v)) return defaultValue;
                double iv;
                if (double.TryParse(v, out iv))
                    return iv;
                return defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }
        
        public static bool GetBoolValue(this JToken tkn, bool defaultValue = false)
        {
            try
            {
                if (tkn == null) return defaultValue;
                var v = tkn.ToString()?.Trim();
                if (string.IsNullOrEmpty(v)) return defaultValue;
                bool iv;
                if (bool.TryParse(v, out iv))
                    return iv;
                return defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }

        public static string GetStringValue(this JToken tkn, string defaultValue = "")
        {
            try
            {
                if (tkn == null) return defaultValue;
                var v = tkn.ToString()?.Trim();
                if (string.IsNullOrEmpty(v)) return defaultValue;
                return v;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }

        public static int? GetIntValue(this JObject tkn, string propertyName, int? defaultValue = null)
        {
            try
            {
                if (tkn?[propertyName] == null) return defaultValue;
                var v = tkn[propertyName].ToString();
                if (int.TryParse(v, out var vv))
                    return vv;
                return defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }

        public static bool? GetBoolValue(this JObject tkn, string propertyName, bool? defaultValue = null)
        {
            try
            {
                if (tkn?[propertyName] == null) return defaultValue;
                var v = tkn[propertyName].ToString();
                if (bool.TryParse(v, out var vv))
                    return vv;
                return defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }

        public static string GetString(this JObject tkn, string propertyName, string defaultValue = null)
        {
            try
            {
                if (tkn?[propertyName] == null) return defaultValue;
                return tkn[propertyName]?.ToString() ?? defaultValue;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }

        public static JObject GetJObject(this JObject tkn, string propertyName, JObject defaultValue = null)
        {
            try
            {
                if (tkn?[propertyName] == null) return defaultValue;
                return tkn[propertyName] as JObject;
            }
            catch
            {
                // ignore
            }

            return defaultValue;
        }
    }
}
