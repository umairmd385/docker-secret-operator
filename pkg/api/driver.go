package api

// DockerV2SecretRequest matches the Docker V2 Plugin API for Secret Drivers
type DockerV2SecretRequest struct {
	Name string `json:"Name"`
}

// DockerV2SecretResponse matches the Docker V2 Plugin API for Secret Drivers
type DockerV2SecretResponse struct {
	Value []byte `json:"Value,omitempty"`
	Err   string `json:"Err,omitempty"`
}
