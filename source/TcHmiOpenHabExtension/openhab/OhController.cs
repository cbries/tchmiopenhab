using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Sockets;
using System.Web;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TcHmiOpenHabExtension.openhab.Events;
using TcHmiOpenHabExtension.openhab.Items;
using TcHmiOpenHabExtension.openhab.SystemInfo;
using TcHmiSrv.Core;
using TcHmiSrv.Core.Tools.DynamicSymbols;
using TcHmiSrv.Core.General;

namespace TcHmiOpenHabExtension.openhab
{
    public class OhController : IOhController
    {
        public bool EnableItemFilter { get; set; } = true;

        #region IOhController
        public string HostAddr { get; set; } = string.Empty;
        public ushort HostPort { get; set; } = 8080;
        public string ApiKey { get; set; } = string.Empty;
        public string GroupFilter { get; set; } = string.Empty;
        #endregion

        private List<string> GetFilterGroupNames()
        {
            if (string.IsNullOrEmpty(GroupFilter))
                return new List<string>();
            var parts = GroupFilter.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 0)
                return new List<string>();
            for (var idx = 0; idx < parts.Length; ++idx)
            {
                if (string.IsNullOrEmpty(parts[idx])) continue;
                parts[idx] = parts[idx].Trim();
            }
            return parts.ToList();
        }

        private readonly DynamicSymbolsProvider _provider;

        private string AuthHttpHeader
        {
            get
            {
                var requestString = $"Authorization: Bearer {ApiKey}\r\n";
                requestString += $"Host: {HostAddr}\r\n";
                requestString += "Connection: keep-alive\r\n";
                return requestString;
            }
        }

        private enum UrlMode
        {
            Items,
            SystemInfo
        }

        public OhController(DynamicSymbolsProvider symbolsProvider)
        {
            _provider = symbolsProvider;
        }

        public void LogMessage(string message)
        {
            TcHmiAsyncLogger.Send(Severity.Info, message);
        }

        public void LogMessage(string msg, Exception ex)
        {
            var m = string.Format($"{msg} {ex.GetFullMessage()}");
            TcHmiAsyncLogger.Send(Severity.Info, $"{m}");
        }

        public void LogWarning(string message)
        {
            TcHmiAsyncLogger.Send(Severity.Warning, message);
        }
        public void LogWarning(string msg, Exception ex)
        {
            var m = string.Format($"{msg} {ex.GetFullMessage()}");
            TcHmiAsyncLogger.Send(Severity.Warning, $"{m}");
        }

        public void LogError(string message)
        {
            TcHmiAsyncLogger.Send(Severity.Error, message);
        }
        public void LogError(string msg, Exception ex)
        {
            var m = string.Format($"{msg} {ex.GetFullMessage()}");
            TcHmiAsyncLogger.Send(Severity.Error, $"{m}");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="req">e.g. "/items"</param>
        /// <returns></returns>
        private string GetUrl(string req)
        {
            if (string.IsNullOrEmpty(req)) return string.Empty;
            if (req[0] != '/') req = "/" + req;
            return $"http://{HostAddr}:{HostPort}/rest{req}";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mode"></param>
        /// <returns></returns>
        private string GetUrl(UrlMode mode)
        {
            switch (mode)
            {
                case UrlMode.Items:
                    return GetUrl("/items");
                case UrlMode.SystemInfo:
                    return GetUrl("/systeminfo");
            }

            return string.Empty;
        }

        public bool HasValidUrl()
        {
            var uriName = GetUrl(UrlMode.Items);
            return Uri.TryCreate(uriName, UriKind.Absolute, out var uriResult)
                   && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }

        /// <summary>
        /// https://stackoverflow.com/questions/4015324/send-http-post-request-in-net
        /// </summary>
        private HttpClient _ohHttpClient;

        private HttpClient GetHttpClient()
        {
            if (_ohHttpClient != null) return _ohHttpClient;

            _ohHttpClient = new HttpClient
            {
                DefaultRequestHeaders =
                {
                    Authorization = new AuthenticationHeaderValue("Bearer", ApiKey)
                }
            };

            return _ohHttpClient;
        }

        public void ReCreateHttpClient()
        {
            Shutdown();
        }

        public void Shutdown()
        {
            if (_ohHttpClient != null)
            {
                try
                {
                    _ohHttpClient.Dispose();
                    _ohHttpClient = null;
                }
                catch (Exception ex)
                {
                    Trace.WriteLine($"<Shutdown> {ex.Message}");
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public async System.Threading.Tasks.Task<List<IOhItem>> QueryItems()
        {
            var errorMessage = string.Empty;
            var items = new List<IOhItem>();

            try
            {
                var url = GetUrl(UrlMode.Items);
                var responseString = await GetHttpClient().GetStringAsync(url);
                var arr = JArray.Parse(responseString);
                foreach (var it in arr)
                {
                    var instance = OhItemCreate.Instance(it as JObject);
                    if (instance == null) continue;

                    if (instance.GroupNames.Count == 0) continue;
                    var useItem = false;
                    var groupFilterList = GetFilterGroupNames();
                    foreach (var itGroupName in instance.GroupNames)
                    {
                        if (string.IsNullOrEmpty(itGroupName)) continue;
                        useItem = groupFilterList.Contains(itGroupName);
                        if (useItem) break;
                    }

                    if (!useItem) continue;

                    items.Add(instance);
                }

                return items;
            }
            catch (Exception ex)
            {
                errorMessage = ex.GetFullMessage();
                LogMessage("Query items failed:", ex);
            }

            return items;
        }

        public async System.Threading.Tasks.Task<IOhSystemInfo> QuerySystemInfo()
        {
            var url = GetUrl(UrlMode.SystemInfo);
            var responseString = await GetHttpClient().GetStringAsync(url);
            try
            {
                var objInstance = JObject.Parse(responseString);
                var obj = objInstance["systemInfo"];
                if (obj == null) return null;
                return JsonConvert.DeserializeObject<OhSystemInfo>(obj.ToString(Formatting.None));
            }
            catch
            {
                // ignore
            }

            return null;
        }

        public object GetStateOf(string itemName)
        {
            if (string.IsNullOrEmpty(itemName)) return null;
            if (ItemData.TryGetValue(itemName, out var value))
                return value;
            return null;
        }

        public bool SendCommand(string itemName, string state)
        {
            if (string.IsNullOrEmpty(itemName)) return false;
            if (string.IsNullOrEmpty(state)) return false;

            var url = GetUrl(UrlMode.Items);
            var result = GetHttpClient().PostAsync($"{url}/{itemName}", new StringContent(state)).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            if (string.IsNullOrEmpty(resultContent))
                Trace.WriteLine($"<SendCommand> OK");
            else
                Trace.WriteLine($"<SendCommand> {resultContent.Trim()}");

            return true;
        }

        private ConcurrentDictionary<string, object> ItemData { get; } = new ConcurrentDictionary<string, object>();
        private BackgroundWorker _backgroundWorkerEventListener;
        private string _eventListenerPrefixMsg = "<EventListener>";
        private TimeSpan _eventListenerReconnectTimeout = TimeSpan.FromSeconds(10);

        public bool StopListenToEvent()
        {
            if (_backgroundWorkerEventListener == null) return true;
            if (!_backgroundWorkerEventListener.WorkerSupportsCancellation) return false;
            try
            {
                _backgroundWorkerEventListener.CancelAsync();
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"{_eventListenerPrefixMsg} {ex.Message}");

                return false;
            }

            return true;
        }

        public bool IsEventListenerRunning()
        {
            if (_backgroundWorkerEventListener == null) return false;
            if (_backgroundWorkerEventListener.IsBusy) return true;
            return false;
        }

        public bool StartListenToEvent()
        {
            if (IsEventListenerRunning()) return true;

            if (_backgroundWorkerEventListener == null)
            {
                _backgroundWorkerEventListener = new BackgroundWorker
                {
                    WorkerReportsProgress = true,
                    WorkerSupportsCancellation = true
                };
                _backgroundWorkerEventListener.DoWork += BackgroundWorkerEventListenerOnDoWork;
                _backgroundWorkerEventListener.ProgressChanged += BackgroundWorkerEventListenerOnProgressChanged;
                _backgroundWorkerEventListener.RunWorkerCompleted += BackgroundWorkerEventListenerOnRunWorkerCompleted;
            }

            try
            {
                _backgroundWorkerEventListener.RunWorkerAsync();
            }
            catch (Exception ex)
            {
                LogMessage($"{_eventListenerPrefixMsg}", ex);

                return false;
            }

            return true;
        }

        private void BackgroundWorkerEventListenerOnRunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            LogMessage($"{_eventListenerPrefixMsg} Completed");
        }

        private void BackgroundWorkerEventListenerOnProgressChanged(object sender, ProgressChangedEventArgs e)
        {

        }

        private const long _systemInfoUpdateIntervalSeconds = 5;
        private long _lastSystemInfoUpdate = -1;

        private bool IsSystemInfoUpdateNeeded()
        {
            if (_lastSystemInfoUpdate == -1)
            {
                _lastSystemInfoUpdate = (long)(DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
                return true;
            }

            var currentSeconds = (long)(DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
            var delta = currentSeconds - _lastSystemInfoUpdate;
            if (delta < _systemInfoUpdateIntervalSeconds)
                return false;

            _lastSystemInfoUpdate = (long)(DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
            return true;
        }

        private TcpClient _tcpClient; // have to be disposed

        private void CleanupEvents()
        {
            if (_tcpClient != null)
            {
                _tcpClient.Close();
                try
                {
                    _tcpClient.Dispose();
                }
                catch
                {
                    // ignore
                }

                _tcpClient = null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="SocketException"></exception>
        /// <exception cref="Exception"></exception>
        private TcpClient GetClientForEvents()
        {
            if (_tcpClient != null) return _tcpClient;

            try
            {
                _tcpClient = new TcpClient();

                do
                {
                    try
                    {
                        LogMessage($"{_eventListenerPrefixMsg} Try to connect: {HostAddr}:{HostPort}");
                        _tcpClient.Connect(HostAddr, HostPort);
                        if (_tcpClient.Connected)
                        {
                            LogMessage($"{_eventListenerPrefixMsg} Connected: {HostAddr}:{HostPort}");

                            break;
                        }
                    }
                    catch (Exception ex)
                    {
                        LogMessage($"{_eventListenerPrefixMsg}", ex);
                        Thread.Sleep(_eventListenerReconnectTimeout);
                    }
                } while (!_backgroundWorkerEventListener.CancellationPending);

                return _tcpClient;
            }
            catch (SocketException ex)
            {
                LogError("TcpClient", ex);

                throw;
            }
            catch (Exception ex)
            {
                LogError("TcpClient", ex);

                throw;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <exception cref=""></exception>
        private void HandleEventsReceiving()
        {
            var requestString = $"GET /rest/events HTTP/1.1\r\n{AuthHttpHeader}\r\n";

            try
            {
                _tcpClient = GetClientForEvents();

                using (var stream = _tcpClient.GetStream())
                {
                    // Send the request.
                    var writer = new StreamWriter(stream);
                    writer.Write(requestString);
                    writer.Flush();

                    // Process the response.
                    var rdr = new StreamReader(stream);

                    while (!rdr.EndOfStream)
                    {
                        if (_backgroundWorkerEventListener.CancellationPending)
                        {
                            try
                            {
                                rdr.Dispose();
                                writer.Dispose();
                            }
                            catch (Exception ex)
                            {
                                LogWarning($"{_eventListenerPrefixMsg} {ex.GetFullMessage()}");
                            }

                            return;
                        }

                        //
                        // check if query of updated systemInfo is needed
                        //
                        if (IsSystemInfoUpdateNeeded())
                        {
                            System.Threading.Tasks.Task.Run(async () =>
                            {
                                try
                                {
                                    await UpdateSystemInfoData();
                                }
                                catch (Exception ex)
                                {
                                    LogMessage($"{_eventListenerPrefixMsg} {ex.Message}");
                                }
                            });
                        }

                        var line = rdr.ReadLine();
                        if (string.IsNullOrEmpty(line?.Trim())) continue;
                        if (!line.StartsWith("event:", StringComparison.OrdinalIgnoreCase)) continue;
                        if (line.TrimEnd().EndsWith("message", StringComparison.OrdinalIgnoreCase))
                        {
                            var dataLine = rdr.ReadLine();
                            if (string.IsNullOrEmpty(dataLine)) continue;
                            if (!dataLine.StartsWith("data", StringComparison.OrdinalIgnoreCase)) continue;
                            var idx = dataLine.IndexOf(":", StringComparison.OrdinalIgnoreCase);
                            if (idx == -1) continue;
                            dataLine = dataLine.Substring(idx + 1)?.Trim();
                            if (string.IsNullOrEmpty(dataLine)) continue;

                            dataLine = HttpUtility.HtmlDecode(dataLine);
                            EventTopic obj = null;
                            try
                            {
                                obj = JsonConvert.DeserializeObject<EventTopic>(dataLine);
                                if (obj == null) continue;
                            }
                            catch(Exception ex)
                            {
                                LogError($"EventTopic deserialization failed: {ex.Message}{Environment.NewLine}Data: {dataLine}");

                                continue;
                            }

                            string oldValue;
                            string newValue;

                            var topicItemName = obj.TopicItemName;
                            try
                            {
                                oldValue = obj.GetPayload().OldValue;
                                newValue = obj.GetPayload().Value;
                            }
                            catch
                            {
                                continue;
                            }

                            switch (obj.Type)
                            {
                                case "ItemStateEvent":
                                    {
                                        if (ItemData.ContainsKey(topicItemName))
                                        {
                                            if (ItemData.TryGetValue(topicItemName, out var oldValue2))
                                                ItemData.TryUpdate(topicItemName, newValue, oldValue2);
                                        }
                                        else
                                        {
                                            ItemData.TryAdd(topicItemName, newValue);
                                        }
                                    }
                                    break;

                                case "ItemStateChangedEvent":
                                    {
                                        if (ItemData.ContainsKey(topicItemName))
                                        {
                                            ItemData.TryUpdate(topicItemName, newValue, oldValue);
                                        }
                                        else
                                        {
                                            ItemData.TryAdd(topicItemName, newValue);
                                        }
                                    }
                                    break;

                                case "ThingStatusInfoEvent":
                                    {
                                        Trace.WriteLine($"{_eventListenerPrefixMsg} {topicItemName} => {obj.GetPayload()}");
                                    }
                                    break;

                                default:
                                    Trace.WriteLine($"{_eventListenerPrefixMsg} no handled type: '{obj.Type}', {topicItemName} => {obj.GetPayload()}");
                                    break;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new ClientEventException("EventsReceiving failed", ex);
            }
        }

        private void TriggerQueryItems()
        {
            var adminContext = TcHmiApplication.Context;
            var refreshItemsCmd = new Command("TcHmiOpenHabExtension.RefreshItems");
            var readResult = TcHmiApplication.AsyncHost.Execute(ref adminContext, ref refreshItemsCmd);
            uint extensionResult = 0;
            Value readValue = null;
            if (readResult != ErrorValue.HMI_SUCCESS || refreshItemsCmd.Result != ErrorValue.HMI_SUCCESS)
            {
                extensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtFail);

                LogMessage($"{_eventListenerPrefixMsg} RefreshItems failed");
            }
            else
            {
                extensionResult = Convert.ToUInt32(TcHmiOpenHabExtensionErrorValue.HmiExtSuccess);
                readValue = refreshItemsCmd.ReadValue;

                LogMessage($"{_eventListenerPrefixMsg} RefreshItems executed successfully: {readValue}");
            }
        }

        private void BackgroundWorkerEventListenerOnDoWork(object sender, DoWorkEventArgs e)
        {
            while (!_backgroundWorkerEventListener.CancellationPending)
            {
                try
                {
                    HandleEventsReceiving();
                }
                catch (ClientEventException ex)
                {
                    LogWarning($"{_eventListenerPrefixMsg} {HostAddr}:{HostPort} collapsed", ex);
                    LogMessage($"{_eventListenerPrefixMsg} ReConnect to {HostAddr}:{HostPort}...");

                    CleanupEvents();
                }
                catch (Exception ex)
                {
                    LogWarning($"{_eventListenerPrefixMsg} {ex.GetFullMessage()}");
                }

                if (_backgroundWorkerEventListener.CancellationPending)
                    break;

                CleanupEvents();

                TriggerQueryItems();
            }

            CleanupEvents();
        }

        private async System.Threading.Tasks.Task UpdateSystemInfoData()
        {
            var systemInfo = await QuerySystemInfo();
            var systemInfoSymbol = new OhSystemInfoSymbol(systemInfo, this);
            _provider.AddOrUpdate("systemInfo", systemInfoSymbol);
        }
    }
}
