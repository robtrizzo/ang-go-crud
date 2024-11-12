package models

import (
	"context"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgconn"
)

type User struct {
	UserName   string `json:"user_name"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email"`
	UserStatus string `json:"user_status"`
	Department string `json:"department"`
}

var usersTable = `
	CREATE TABLE IF NOT EXISTS USERS(
		user_name varchar(50),
		first_name varchar(255),
		last_name varchar(255),
		email varchar(255),
		user_status varchar(1),
		department varchar(255)
	)
`

func createUsersTableIfNotExists() error {
	ret, err := db.Exec(context.Background(), usersTable)
	if err != nil {
		fmt.Printf("failed to create users table: %v\n", err)
	}
	fmt.Printf("Created users table: %v\n", ret)
	return nil
}

func GetAllUsers() ([]User, error) {
	fmt.Printf("find all users")
	sql, _, err := sq.Select("*").From("users").ToSql()
	if err != nil {
		return nil, fmt.Errorf("error constructing query: %v", err)
	}
	rows, err := db.Query(context.Background(), sql)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			return nil, fmt.Errorf("error querying db[%v]: %v", pgErr.Code, pgErr.Message)
		} else {
			return nil, fmt.Errorf("error querying db: %v", err)
		}
	}
	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.UserName, &user.FirstName, &user.LastName, &user.Email, &user.UserStatus, &user.Department)
		if err != nil {
			fmt.Printf("error querying db: %v", err)
		}
		users = append(users, user)
	}

	return users, nil
}

func createTestUser() error {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sql, args, err := psql.
		Insert("users").
		Columns("user_name", "first_name", "last_name", "email", "user_status", "department").
		Values("testuser", "bruce", "wayne", "not@batman.com", "A", "philanthropy").
		ToSql()

	if err != nil {
		return fmt.Errorf("error constructing query: %v", err)
	}

	response, err := db.Exec(context.Background(), sql, args...)
	if err != nil {
		return fmt.Errorf("failed to insert test user: %v", err)
	}
	fmt.Printf("insert response: %v\n", response)
	return nil
}
