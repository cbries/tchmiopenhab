﻿using Newtonsoft.Json.Linq;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public class OhItemContact : OhItem
    {
        public override bool Parse(JToken tkn)
        {
            if (!base.Parse(tkn)) return false;

            return true;
        }
    }
}
