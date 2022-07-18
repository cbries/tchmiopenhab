using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using TcHmiOpenHabExtension.openhab;
using TcHmiOpenHabExtension.openhab.Items;
using TcHmiOpenHabExtension.openhab.SystemInfo;
using TcHmiSrv.Core;
using TcHmiSrv.Core.General;
using TcHmiSrv.Core.Listeners;
using TcHmiSrv.Core.Listeners.ConfigListenerEventArgs;
using TcHmiSrv.Core.Listeners.ShutdownListenerEventArgs;
using TcHmiSrv.Core.Listeners.SubscriptionListenerEventArgs;
using TcHmiSrv.Core.Tools.DynamicSymbols;
using TcHmiSrv.Core.Tools.Management;
using TcHmiSrv.Core.Tools.Settings;
using OhItemSymbol = TcHmiOpenHabExtension.openhab.Items.OhItemSymbol;
using Task = System.Threading.Tasks.Task;

[assembly: TcHmiSrv.Core.Tools.TypeAttribute.ServerExtensionType(typeof(TcHmiOpenHabExtension.TcHmiOpenHabExtension))]

namespace TcHmiOpenHabExtension
{
    public class TcHmiOpenHabExtension : IServerExtension
    {
        private readonly ConfigListener _configListener = new ConfigListener();
        private readonly RequestListener _requestListener = new RequestListener();
        private readonly ShutdownListener _shutdownListener = new ShutdownListener();
        private readonly SubscriptionListener _subscriptionListener = new SubscriptionListener();

        private readonly OhCfg _ohCfg = new OhCfg();
        private DynamicSymbolsProvider _provider = null;
        private OhController _ohController = null;
        private readonly List<IOhItem> _ohItems = new List<IOhItem>();
        private bool _initialized = false;
        private bool _readyToUse = false;
        private readonly object _objectInitializationLock = new object();

        private string ApplicationContextDomain;

        private int _maxTriesOfInitQuery = 5;
        private TimeSpan _timeoutBetweenInitQueryTries = TimeSpan.FromSeconds(10);
        private bool _initIsCalled = false;

        private async Task _initAsync()
        {
            if (_initIsCalled) return;

            _initIsCalled = true;

            try
            {
                const int maxSeconds = 600;
                for (var i = 0; i < 600; ++i)
                {
                    if (_ohController.HasValidUrl()) break;
                    _ohController.LogMessage($"Extension not correctly initialized. No valid url to openHAB server. Initialization will be canceled in {maxSeconds - i} seconds.");
                    System.Threading.Thread.Sleep(TimeSpan.FromSeconds(1));
                }

                List<IOhItem> items = null;

                for (var iTry = 0; iTry < _maxTriesOfInitQuery; ++iTry)
                {
                    try
                    {
                        items = await _ohController.QueryItems();
                        break;
                    }
                    catch (Exception ex)
                    {
                        _ohController.LogMessage(ex.Message);
                    }


                    Thread.Sleep(_timeoutBetweenInitQueryTries);
                }

                if (items != null && items.Count > 0)
                {
                    _ohItems.AddRange(items);
                    if (_ohItems.Count > 0)
                    {
                        var localItems = new Dictionary<string, Symbol>();
                        foreach (var it in _ohItems)
                        {
                            var c = CreateComment(it);
                            var symInstance = new OhItemSymbol(it, _ohController, c);
                            localItems.Add(it.Name, symInstance);
                        }

                        if (_provider == null)
                        {
                            _provider = new DynamicSymbolsProvider(localItems);
                        }
                        else
                        {
                            foreach (var it in localItems)
                                _provider.Add(it.Key, it.Value);
                        }
                    }
                }

                var systemInfo = await _ohController.QuerySystemInfo();
                var systemInfoSymbol = new OhSystemInfoSymbol(systemInfo, _ohController);
                _provider?.AddOrUpdate("systemInfo", systemInfoSymbol);
            }
            catch
            {
                // ignore
            }
            finally
            {
                _initIsCalled = false;
            }
        }

        private string CreateComment(IOhItem it)
        {
            var comment = $"Groups({string.Join(", ", it.GroupNames)})";
            if (!string.IsNullOrEmpty(it.Pattern))
                comment += $", Pattern({it.Pattern.Trim()})";
            return comment;
        }

        private async Task InitOpenHab(bool cleanFirst = false)
        {
            if (_initialized) return;

            _initialized = true;

            lock (_objectInitializationLock)
                _provider = new DynamicSymbolsProvider();

            _ohController = new OhController(_provider)
            {
                HostAddr = _ohCfg.Host,
                HostPort = _ohCfg.Port,
                ApiKey = _ohCfg.ApiKey,
                GroupFilter = _ohCfg.GroupFilter
            };

            await _initAsync();

            _ohController?.StartListenToEvent();

            _readyToUse = true;
        }

        private void LoadCfg()
        {
            var hostAddr = TcHmiApplication.AsyncHost.GetConfigValue(TcHmiApplication.Context, "hostAddr");
            _ohCfg.Host = hostAddr.ToString();
            var hostPort = TcHmiApplication.AsyncHost.GetConfigValue(TcHmiApplication.Context, "hostPort");
            _ohCfg.Port = hostPort.ToUInt16();
            var apiKey = TcHmiApplication.AsyncHost.GetConfigValue(TcHmiApplication.Context, "apiKey");
            _ohCfg.ApiKey = apiKey.ToString();
            var groupFilter = TcHmiApplication.AsyncHost.GetConfigValue(TcHmiApplication.Context, "groupFilter");
            _ohCfg.GroupFilter = groupFilter.ToString();
        }

        // Called after the TwinCAT HMI server loaded the server extension.
        public ErrorValue Init()
        {
            try
            {
                //TcHmiApplication.AsyncDebugHost.WaitForDebugger();

                LoadCfg();

                Context context = TcHmiApplication.Context;
                ApplicationContextDomain = context.Domain;

                // Add event handlers
                _requestListener.OnRequestAsync += OnRequest;
                _shutdownListener.OnShutdown += ShutdownListenerOnShutdown;
                _subscriptionListener.OnSubscribe += SubscriptionListenerOnSubscribe;
                _subscriptionListener.OnUnsubscribe += SubscriptionListenerOnUnsubscribe;

                _configListener.OnChange += ConfigListenerOnChange;
                _configListener.OnDelete += ConfigListenerOnDelete;

                var settings = new ConfigListenerSettings();
                var filterPalindromes = new ConfigListenerSettingsFilter(
                    ConfigChangeType.OnChange |
                    ConfigChangeType.OnDelete,
                    new[] { "hostAddr", "hostPort", "apiKey", "groupFilter" }
                );
                settings.Filters.Add(filterPalindromes);

                TcHmiApplication.AsyncHost.RegisterListener(context, _configListener, settings);

                var r = InitOpenHab().Wait(TimeSpan.FromSeconds(10));
                if (!r) ; // TODO error handling

                return ErrorValue.HMI_SUCCESS;
            }
            catch (Exception ex)
            {
                TcHmiAsyncLogger.Send(Severity.Error, "ERROR_INIT", ex.ToString());
                return ErrorValue.HMI_E_EXTENSION_LOAD;
            }
        }

        private void ConfigListenerOnDelete(object sender, OnDeleteEventArgs e)
        {
            UpdateConfigurationHint();
        }

        private void ConfigListenerOnChange(object sender, OnChangeEventArgs e)
        {
            UpdateConfigurationHint();
        }

        private void UpdateConfigurationHint()
        {
            //#if DEBUG
            //            TcHmiAsyncLogger.Send(Severity.Info, "CFG_INIT", $"Target: http://{_ohController?.HostAddr}:{_ohController?.HostPort} with '{_ohController?.ApiKey}' (Filter: {_ohController.GroupFilter})");
            //#endif
            if (_ohController != null)
            {
                LoadCfg();

                _ohController.HostAddr = _ohCfg.Host;
                _ohController.HostPort = _ohCfg.Port;
                _ohController.ApiKey = _ohCfg.ApiKey;
                _ohController.GroupFilter = _ohCfg.GroupFilter;

                _ohController.ReCreateHttpClient();
            }
        }

        private void ShutdownListenerOnShutdown(object sender, OnShutdownEventArgs e)
        {
            Trace.WriteLine($"<OnShutdown> {e.Context.Domain}  {e.Context}");

            _readyToUse = false;

            _ohController?.StopListenToEvent();
            _ohController?.Shutdown();
        }

        private void SubscriptionListenerOnUnsubscribe(object sender, OnUnsubscribeEventArgs e)
        {
            Trace.WriteLine($"<OnUnsubscribe> {e.Context.Domain}  {e.Context}");

            //_ohController?.StopListenToEvent();
        }

        private void SubscriptionListenerOnSubscribe(object sender, OnSubscribeEventArgs e)
        {
            Trace.WriteLine($"<OnSubscribe> {e.Context.Domain}  {e.Context}");

            InitOpenHab();
        }

        // Called when a client requests a symbol from the domain of the TwinCAT HMI server extension.
        private async Task OnRequest(object sender, TcHmiSrv.Core.Listeners.RequestListenerEventArgs.OnRequestEventArgs e)
        {
            if (!_readyToUse) return;

            var ret = ErrorValue.HMI_SUCCESS;
            var context = e.Context;
            var commands = e.Commands;

            try
            {
                commands.Result = TcHmiOpenHabExtensionErrorValue.HmiExtSuccess;

                //lock (_objectInitializationLock)
                //{
                    foreach (Command command in _provider.HandleCommands(commands))
                        ret = await HandleCommand(command, context);
                //}
            }
            catch (Exception ex)
            {
                commands.Result = TcHmiOpenHabExtensionErrorValue.HmiExtFail;
                throw new TcHmiException(ex.ToString(), (ret == ErrorValue.HMI_SUCCESS) ? ErrorValue.HMI_E_EXTENSION : ret);
            }
        }

        private async System.Threading.Tasks.Task< ErrorValue > HandleCommand(Command command, Context context)
        {
            var mapping = command.Mapping;

            var ret = ErrorValue.HMI_SUCCESS;

            try
            {
                switch (mapping)
                {
                    case "StartEventListening":
                        {
                            if (_ohController == null) command.ReadValue = false;
                            else if (_ohController.IsEventListenerRunning()) command.ReadValue = true;
                            else
                            {
                                var rStop = _ohController.StopListenToEvent();
                                var rStart = _ohController.StartListenToEvent();
                                command.ReadValue = rStop && rStart;
                            }
                            command.ExtensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                            ret = ErrorValue.HMI_SUCCESS;
                        }
                        break;

                    case "StopEventListening":
                        {
                            if (_ohController == null) command.ReadValue = false;
                            else if (!_ohController.IsEventListenerRunning()) command.ReadValue = true;
                            else
                            {
                                command.ReadValue = _ohController.StopListenToEvent();
                            }
                            command.ExtensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                            ret = ErrorValue.HMI_SUCCESS;
                        }
                        break;

                    case "IsEventListenStarted":
                        {
                            if (_ohController == null) command.ReadValue = false;
                            else if (_ohController.IsEventListenerRunning()) command.ReadValue = true;
                            else command.ReadValue = false;
                            command.ExtensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                            ret = ErrorValue.HMI_SUCCESS;
                        }
                        break;

                    case "ItemCount":
                        {
                            lock (_objectInitializationLock)
                            {
                                if (_provider == null) command.ReadValue = -1;
                                else command.ReadValue = _provider.Count;
                                command.ExtensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                                ret = ErrorValue.HMI_SUCCESS;
                            }
                        }
                        break;

                    case "RefreshItems":
                        {
                            TcHmiAsyncLogger.Send(Severity.Info, $"RefreshItems() started");

                            List<IOhItem> items = null;
                            try
                            {
                                items = await _ohController?.QueryItems();
                            }
                            catch
                            {
                                // ignore 
                                // TODO error handling
                            }

                            if (items == null)
                            {
                                command.ReadValue = false;
                            }
                            else
                            {
                                command.ReadValue = items.Count > 0;

                                var localItems = new Dictionary<string, Symbol>();
                                foreach (var it in items)
                                {
                                    var c = CreateComment(it);
                                    localItems.Add(it.Name, new OhItemSymbol(it, _ohController, c));
                                }

                                lock (_objectInitializationLock)
                                {
                                    _provider.Clear();
                                    foreach (var it in localItems)
                                        _provider.Add(it.Key, it.Value);
                                }
                            }

                            command.ExtensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                            ret = ErrorValue.HMI_SUCCESS;

                            TcHmiAsyncLogger.Send(Severity.Info, $"RefreshItems() finished");
                        }
                        break;

                    // TODO to be defined of needed

                    default:
                        command.ExtensionResult = TcHmiOpenHabExtensionErrorValue.HmiExtFail;
                        ret = ErrorValue.HMI_E_EXTENSION;
                        break;
                }

                // if (ret != ErrorValue.HMI_SUCCESS)
                //   Handle error
            }
            catch (Exception ex)
            {
                command.ExtensionResult = TcHmiOpenHabExtensionErrorValue.HmiExtFail;
                command.ResultString = TcHmiAsyncLogger.Localize(context, "ERROR_CALL_COMMAND", new string[] { mapping, ex.ToString() });
            }

            return ret;
        }
    }
}
