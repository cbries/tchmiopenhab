using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using TcHmiSrv.Core;
using TcHmiSrv.Core.Tools.DynamicSymbols;
using TcHmiSrv.Core.Tools.Json.Newtonsoft;
using TcHmiSrv.Core.Tools.Json.Newtonsoft.Converters;

namespace TcHmiOpenHabExtension.openhab.SystemInfo
{
    public class OhSystemInfoSymbol : AsyncSymbol
    {
        public static TcHmiJSchemaGenerator CustomGenerator { get; } = CreateGenerator();

        public IOhController Controller { get; }

        public IOhSystemInfo Item { get; }

        private static TcHmiJSchemaGenerator CreateGenerator()
        {
            // The default JSON schema generator does not contain a 'JSchemaGenerationProvider' for enumerations by default
            // You can implement a custom 'JSchemaGenerationProvider' for enumerations, create a 'JSchemaGenerationProvider' for a specific type by calling 'TcHmiSchemaGenerator.CreateEnumGenerationProvider' or use the 'TcHmiJSchemaGenerator.DefaultEnumGenerationProvider' for all enum types
            var generator = TcHmiJSchemaGenerator.DefaultGenerator;
            generator.GenerationProviders.Add(TcHmiJSchemaGenerator.DefaultEnumGenerationProvider);
            return generator;
        }

        public OhSystemInfoSymbol(IOhSystemInfo item, IOhController controller, string comment = null)
            : base(item is null
                ? throw new ArgumentNullException(nameof(item))
                : CustomGenerator.Generate(item.GetType()),
                 null,
                new System.Collections.Generic.Dictionary<string, TcHmiSrv.Core.Value>
                {
                    {"comment", comment ?? "The system information provides operating system and hardware information." }
                })
        {
            Controller = controller;

            Item = item;
        }

        protected override async System.Threading.Tasks.Task<Value> ReadAsync(Queue<string> elements, Context context)
        {
            if (elements.Count == 0)
                return TcHmiJsonSerializer.Deserialize(ValueJsonConverter.DefaultConverter, JsonConvert.SerializeObject(Item));

            // Get the name if the requested sub-element
            var element = elements.Dequeue();

            // A sub-element of a sub-element cannot be requested because machines contain only top-level properties
            if (elements.Count > 0)
                throw new ArgumentException("Too many elements.", nameof(elements));

            switch (element)
            {
                #region IOhSystemInfo

                case "configFolder":
                    return Item.ConfigFolder;

                case "userdataFolder":
                    return Item.UserdataFolder;

                case "logFolder":
                    return Item.LogFolder;

                case "javaVersion":
                    return Item.JavaVersion;

                case "javaVendor":
                    return Item.JavaVersion;

                case "osName":
                    return Item.OsName;

                case "osArchitecture":
                    return Item.OsArchitecture;

                case "availableProcessors":
                    return Item.AvailableProcessors;

                case "freeMemory":
                    return Item.FreeMemory;

                case "totalMemory":
                    return Item.TotalMemory;

                #endregion

                default:
                    throw new ArgumentException(string.Concat("Unknown element: ", element), nameof(elements));
            }
        }

        protected override async System.Threading.Tasks.Task<Value> WriteAsync(Queue<string> elements, Value value, Context context)
        {
            throw new NotImplementedException();
        }
    }
}
