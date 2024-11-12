package model

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type DB struct {
	*pgx.Conn
}

var db *DB

func Connect() error {
	connectionString, set := os.LookupEnv("DB_URL")
	if !set || connectionString == "" {
		return errors.New("environment variable DB_URL must be set")
	}

	var conn *pgx.Conn
	var err error

	for i := 0; i < 3; i++ {
		conn, err = pgx.Connect(context.Background(), connectionString)
		if err == nil {
			break
		}

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			fmt.Printf("PostgreSQL error: %v\n", pgErr)
		} else {
			fmt.Printf("Connection attempt %d failed: %v\n", i+1, err)
		}

		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("failed to connect to database after 3 attempts: %v", err)
	}
	var greeting string
	err = conn.QueryRow(context.Background(), "select 'Connected to PostgreSQL'").Scan(&greeting)
	if err != nil {
		return fmt.Errorf("queryRow failed %v", err)
	}

	fmt.Println(greeting)

	db = &DB{conn}

	initDB()

	return nil
}

func Close() error {
	return db.Close(context.Background())
}

func initDB() {
	err := createUsersTableIfNotExists()
	if err != nil {
		fmt.Printf("failed to init users table: %v\n", err)
		os.Exit(1)
	}
}
