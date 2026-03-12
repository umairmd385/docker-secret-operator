package auth

import (
	"crypto/subtle"
	"errors"
	"os"
)

var (
	ErrUnauthorized = errors.New("unauthorized: invalid or missing token")
)

// Authenticator handles token-based authentication
type Authenticator struct {
	token string
}

// NewAuthenticator creates a new authenticator using the DSO_AUTH_TOKEN env var
func NewAuthenticator() *Authenticator {
	token := os.Getenv("DSO_AUTH_TOKEN")
	return &Authenticator{token: token}
}

// Verify checks if the provided token matches the expected one
func (a *Authenticator) Verify(providedToken string) error {
	// If no token is configured, skip auth (default for backwards compatibility or local dev)
	if a.token == "" {
		return nil
	}

	if subtle.ConstantTimeCompare([]byte(providedToken), []byte(a.token)) != 1 {
		return ErrUnauthorized
	}

	return nil
}

// GetToken returns the current configured token (useful for clients)
func (a *Authenticator) GetToken() string {
	return a.token
}
