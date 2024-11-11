package models

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

type DB struct {
	*pgx.Conn
}

func Connect() (*DB, error) {
	connectionString, set := os.LookupEnv("DB_URL")
	if !set || connectionString == "" {
		return nil, errors.New("environment variable DB_URL must be set")
	}
	conn, err := pgx.Connect(context.Background(), connectionString)
	if err != nil {
		return nil, err
	}
	var greeting string
	err = conn.QueryRow(context.Background(), "select 'Connected to PostgreSQL'").Scan(&greeting)
	if err != nil {
		return nil, fmt.Errorf("queryRow failed %v", err)
	}

	fmt.Println(greeting)

	return &DB{conn}, nil
}

func Close(db *DB) error {
	return db.Close(context.Background())
}
