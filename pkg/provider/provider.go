package provider

import (
	"net/rpc"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/hashicorp/go-plugin"
)

// ProviderRPC is an implementation that communicates over RPC
type ProviderRPC struct {
	client *rpc.Client
}

func (g *ProviderRPC) Init(config map[string]string) error {
	return g.client.Call("Plugin.Init", config, new(interface{}))
}

func (g *ProviderRPC) GetSecret(name string) (map[string]string, error) {
	var resp map[string]string
	err := g.client.Call("Plugin.GetSecret", name, &resp)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (g *ProviderRPC) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)

	go func() {
		ticker := time.NewTicker(interval)
		backoff := 2 * time.Second

		for range ticker.C {
			val, err := g.GetSecret(name)
			var errMsg string
			if err != nil {
				// Normalize network and credential timeouts reliably
				errMsg = "Provider timeout or failure: " + err.Error()
				ch <- api.SecretUpdate{Name: name, Data: nil, Error: errMsg}

				// Apply exponential jitter gracefully locally tracking failures
				ticker.Reset(interval + backoff)
				if backoff < 60*time.Second {
					backoff *= 2
				}
				continue
			}

			// Reset ticker natively bounds correctly mapping the interval precisely back to standard limits
			ticker.Reset(interval)
			backoff = 2 * time.Second

			ch <- api.SecretUpdate{Name: name, Data: val, Error: ""}
		}
	}()

	return ch, nil
}

// ProviderRPCServer is the RPC server that ProviderRPC talks to
type ProviderRPCServer struct {
	Impl api.SecretProvider
}

func (s *ProviderRPCServer) Init(config map[string]string, resp *interface{}) error {
	return s.Impl.Init(config)
}

func (s *ProviderRPCServer) GetSecret(name string, resp *map[string]string) error {
	v, err := s.Impl.GetSecret(name)
	*resp = v
	return err
}

// WatchSecret is not directly exposed via net/rpc due to stream limit.
func (s *ProviderRPCServer) WatchSecret(args interface{}, resp *interface{}) error {
	return nil
}

// SecretProviderPlugin is the implementation of plugin.Plugin
type SecretProviderPlugin struct {
	Impl api.SecretProvider
}

func (p *SecretProviderPlugin) Server(*plugin.MuxBroker) (interface{}, error) {
	return &ProviderRPCServer{Impl: p.Impl}, nil
}

func (p *SecretProviderPlugin) Client(b *plugin.MuxBroker, c *rpc.Client) (interface{}, error) {
	return &ProviderRPC{client: c}, nil
}

// Handshake
var Handshake = plugin.HandshakeConfig{
	ProtocolVersion:  1,
	MagicCookieKey:   "DSO_PLUGIN",
	MagicCookieValue: "hello",
}

var PluginMap = map[string]plugin.Plugin{
	"provider": &SecretProviderPlugin{},
}
