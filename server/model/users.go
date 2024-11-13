package model

import (
	"context"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgconn"
)

type (
	User struct {
		UserId     int64  `json:"user_id"`
		UserName   string `json:"user_name" validate:"required"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name"`
		Email      string `json:"email" validate:"omitempty,email"`
		UserStatus string `json:"user_status" validate:"omitempty,oneof=A I T"`
		Department string `json:"department"`
	}
)

var userStatusEnum = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
            CREATE TYPE user_status_enum AS ENUM ('I', 'A', 'T');
        END IF;
    END
    $$;
`

var usersTable = `
    CREATE TABLE IF NOT EXISTS USERS(
        user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_name VARCHAR(50) UNIQUE,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        user_status user_status_enum DEFAULT 'A',
        department VARCHAR(255)
    );
`

var psql = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

var ErrUserNotFound = errors.New("user not found")

func createUsersTableIfNotExists() error {
	_, err := db.Exec(context.Background(), userStatusEnum)
	if err != nil {
		return fmt.Errorf("failed to create user_status_enum type: %v", err)
	}
	ret, err := db.Exec(context.Background(), usersTable)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}
	fmt.Printf("Created users table: %v\n", ret)
	return nil
}

func GetAllUsers() ([]User, error) {
	sql, _, err := psql.Select("*").From("users").ToSql()
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
	sql, args, err := psql.
		Insert("users").
		Columns("user_name", "first_name", "last_name", "email", "user_status", "department").
		Values(user.UserName, user.FirstName, user.LastName, user.Email, "A", user.Department).
		Suffix("ON CONFLICT (user_name) DO NOTHING").
		ToSql()

	if err != nil {
		return fmt.Errorf("error constructing query: %v", err)
	}

	fmt.Printf("generated sql: %v with args %v\n", sql, args)

	response, err := db.Exec(context.Background(), sql, args...)

	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	rowsAffected := response.RowsAffected()

	if rowsAffected == 0 {
		return fmt.Errorf("no rows were inserted (user may already exist)")
	} else {
		fmt.Printf("Inserted %d row(s).\n", rowsAffected)
	}
	return nil
}

func UpdateUser(userId int64, user User) error {
	sql, args, err := psql.
		Update("users").
		Set("user_name", user.UserName).
		Set("first_name", user.FirstName).
		Set("last_name", user.LastName).
		Set("email", user.Email).
		Set("user_status", user.UserStatus).
		Set("department", user.Department).
		Where(sq.Eq{"user_id": userId}).
		ToSql()

	if err != nil {
		return fmt.Errorf("error constructing query: %v", err)
	}

	fmt.Printf("generated sql: %v with args %v\n", sql, args)

	response, err := db.Exec(context.Background(), sql, args...)
	if err != nil {
		return fmt.Errorf("failed to update user: %v", err)
	}

	rowsAffected := response.RowsAffected()
	if rowsAffected == 0 {
		return ErrUserNotFound
	}

	fmt.Printf("Updated %d row(s).\n", rowsAffected)
	return nil
}

func GetUser(userId int64) (User, error) {
	sql, args, err := psql.
		Select("*").
		From("users").
		Where(sq.Eq{"user_id": userId}).
		ToSql()

	if err != nil {
		return User{}, fmt.Errorf("error constructing query: %v", err)
	}

	fmt.Printf("generated sql: %v with args %v\n", sql, args)

	rows, err := db.Query(context.Background(), sql, args...)
	if err != nil {
		return User{}, fmt.Errorf("failed to get user: %v", err)
	}
	var user User
	if rows.Next() {
		err = rows.Scan(&user.UserId, &user.UserName, &user.FirstName, &user.LastName, &user.Email, &user.UserStatus, &user.Department)
		if err != nil {
			return User{}, fmt.Errorf("error parsing query result: %v", err)
		}
	} else {
		return User{}, ErrUserNotFound
	}
	return user, nil
}

func DeleteUser(userId int64) error {
	sql, args, err := psql.
		Delete("users").
		Where(sq.Eq{"user_id": userId}).
		ToSql()

	if err != nil {
		return fmt.Errorf("error constructing query: %v", err)
	}

	fmt.Printf("generated sql: %v with args %v\n", sql, args)

	response, err := db.Exec(context.Background(), sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete user: %v", err)
	}

	rowsAffected := response.RowsAffected()

	if rowsAffected == 0 {
		return ErrUserNotFound
	}

	fmt.Printf("Deleted %d row(s).\n", rowsAffected)
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
