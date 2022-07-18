using System;
using TcHmiSrv.Core.Tools.DynamicSymbols;

namespace TcHmiOpenHabExtension.openhab.Items
{
    public partial class OhItemSymbol : AsyncSymbol
    {
        public static TcHmiJSchemaGenerator CustomGenerator { get; } = CreateGenerator();

        public IOhController Controller { get; }

        public IOhItem Item { get; }

        private static TcHmiJSchemaGenerator CreateGenerator()
        {
            // The default JSON schema generator does not contain a 'JSchemaGenerationProvider' for enumerations by default
            // You can implement a custom 'JSchemaGenerationProvider' for enumerations, create a 'JSchemaGenerationProvider' for a specific type by calling 'TcHmiSchemaGenerator.CreateEnumGenerationProvider' or use the 'TcHmiJSchemaGenerator.DefaultEnumGenerationProvider' for all enum types
            var generator = TcHmiJSchemaGenerator.DefaultGenerator;
            generator.GenerationProviders.Add(TcHmiJSchemaGenerator.DefaultEnumGenerationProvider);
            return generator;
        }

        public OhItemSymbol(IOhItem item, IOhController controller, string comment = null)
            : base(
                item is null
                ? throw new ArgumentNullException(nameof(item))
                : CustomGenerator.Generate(item.GetType()),
                null,
                new System.Collections.Generic.Dictionary<string, TcHmiSrv.Core.Value>
                {
                    {"comment", comment ?? string.Empty }
                }
                //null,
                //new bool?(),
                //string.Empty
                  )
        {
            Controller = controller;

            Item = item;
        }
    }
}
