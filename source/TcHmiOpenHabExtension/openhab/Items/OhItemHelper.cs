using System;
using System.Globalization;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public static class OhItemHelper
    {
        /// <summary>
        /// Clean `inputStr` and converts the content to a double.
        /// In any case the `defaultResult` is returned.
        /// </summary>
        /// <param name="inputStr"></param>
        /// <param name="defaultResult"></param>
        /// <returns></returns>
        public static double ToDoubleWithOpenHabUnit(this string inputStr, double defaultResult = 0.0)
        {
            var localState = inputStr;
            var idx = localState.IndexOf(" ", StringComparison.OrdinalIgnoreCase);
            if (idx != -1)
                localState = localState.Substring(0, idx).Trim();
            if (double.TryParse(localState, NumberStyles.Any, CultureInfo.InvariantCulture, out var vv))
                return vv;
            return defaultResult;
        }
    }
}
