package model

import (
	"context"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/go-playground/validator"
	"github.com/jackc/pgx/v5/pgconn"
)

type (
	User struct {
		UserId     int64  `json:"user_id"`
		UserName   string `json:"user_name" validate:"required"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name"`
		Email      string `json:"email" validate:"email"`
		UserStatus string `json:"user_status"`
		Department string `json:"department"`
	}

	CustomValidator struct {
		validator *validator.Validate
	}
)

var usersTable = `
	CREATE TABLE IF NOT EXISTS USERS(
		user_id bigint generated always as identity primary key,
		user_name varchar(50) unique,
		first_name varchar(255),
		last_name varchar(255),
		email varchar(255),
		user_status varchar(1),
		department varchar(255)
	)
`

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return err
	}
	return nil
}

var psql = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

func createUsersTableIfNotExists() error {
	ret, err := db.Exec(context.Background(), usersTable)
	if err != nil {
		fmt.Printf("failed to create users table: %v\n", err)
	}
	fmt.Printf("Created users table: %v\n", ret)
	return nil
}

func GetAllUsers() ([]User, error) {
	sql, _, err := sq.Select("*").From("users").ToSql()
	if err != nil {
		return nil, fmt.Errorf("error constructing query: %v", err)
	}
	fmt.Printf("generated sql: %v\n", sql)
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
		err := rows.Scan(&user.UserId, &user.UserName, &user.FirstName, &user.LastName, &user.Email, &user.UserStatus, &user.Department)
		if err != nil {
			fmt.Printf("error querying db: %v", err)
		}
		users = append(users, user)
	}
	fmt.Printf("found users: %v\n", users)

	return users, nil
}

func InsertUser(user User) error {
	if user.UserName == "" {
		return errors.New("user_name required to create user")
	}

	sql, args, err := psql.
		Insert("users").
		Columns("user_name", "first_name", "last_name", "email", "user_status", "department").
		Values(user.UserName, user.FirstName, user.LastName, user.Email, "A", user.Department).
		Suffix("ON CONFLICT (user_name) DO NOTHING").
		ToSql()

	if err != nil {
		return fmt.Errorf("error constructing query: %v", err)
	}

	fmt.Printf("generated sql: %v\n", sql)

	response, err := db.Exec(context.Background(), sql, args...)

	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	rowsAffected := response.RowsAffected()

	if rowsAffected == 0 {
		fmt.Println("No rows were inserted (user may already exist).")
	} else {
		fmt.Printf("Inserted %d row(s).\n", rowsAffected)
	}
	return nil
}

func createTestUser() error {
	userToInsert := User{
		UserName:   "testuser",
		FirstName:  "bruce",
		LastName:   "wayne",
		Email:      "not@batman.com",
		UserStatus: "A",
		Department: "philantropy",
	}
	err := InsertUser(userToInsert)
	if err != nil {
		return fmt.Errorf("failed to insert test user: %v", err)
	}
	return nil
}
