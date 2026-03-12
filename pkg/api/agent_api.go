package api

type AgentRequest struct {
	Provider string
	Config   map[string]string
	Secret   string
}

type AgentResponse struct {
	Data  map[string]string
	Error string
}

// AgentAPI is the interface exposed by the dso-agent daemon over Unix socket.
type AgentAPI interface {
	GetSecret(req *AgentRequest, resp *AgentResponse) error
}
