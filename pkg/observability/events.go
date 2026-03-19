package observability

// EventStream provides an asynchronous, non-blocking telemetry channel allowing injectors to propagate raw event metadata up to the WebSocket/REST Server bounds globally without forming cyclic package dependencies.
var EventStream = make(chan map[string]interface{}, 1000)
