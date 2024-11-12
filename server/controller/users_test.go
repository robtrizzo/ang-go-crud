package controller

import (
	"net/http"
	"net/http/httptest"
	"server/model"
	"strings"
	"testing"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return err
	}
	return nil
}

var (
	mockGetAllUsers = func() ([]model.User, error) {
		return []model.User{
			{UserId: 1, UserName: "testuser", FirstName: "Test", LastName: "User", Email: "test@example.com", UserStatus: "A", Department: "IT"},
		}, nil
	}
	mockInsertUser = func(user model.User) error {
		return nil
	}
	mockGetUser = func(userId int64) (model.User, error) {
		return model.User{UserId: 1, UserName: "testuser", FirstName: "Test", LastName: "User", Email: "test@example.com", UserStatus: "A", Department: "IT"}, nil
	}
	mockUpdateUser = func(userId int64, user model.User) error {
		return nil
	}
	mockDeleteUser = func(userId int64) error {
		return nil
	}
)

func TestGetAllUsers(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := GetAllUsers(mockGetAllUsers)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "testuser")
	}
}

func TestInsertUser(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	userJSON := `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"A","department":"IT"}`
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "User inserted")
	}
}

func TestGetUser(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := GetUser(mockGetUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "testuser")
	}
}

func TestUpdateUser(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	userJSON := `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"A","department":"IT"}`
	req := httptest.NewRequest(http.MethodPut, "/users/:userId", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := UpdateUser(mockUpdateUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "User updated")
	}
}

func TestDeleteUser(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := DeleteUser(mockDeleteUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "User deleted")
	}
}
