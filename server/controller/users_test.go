package controller

import (
	"errors"
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
	userJSON                  = `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"A","department":"IT"}`
	userInvalidEmailJSON      = `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@invalid-domain","user_status":"A","department":"IT"}`
	userInvalidNoUserNameJSON = `{"user_name":"","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"A","department":"IT"}`
	userInvalidUserStatusJSON = `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"R","department":"IT"}`
	invalidJSON               = `{"user_name":"testuser","first_name":"Test","last_name":"User","email":"test@example.com","user_status":"A","department":"IT"`
	errFoo                    = errors.New("internal server error")
	mockGetAllUsers           = func() ([]model.User, error) {
		return []model.User{
			{UserId: 1, UserName: "testuser", FirstName: "Test", LastName: "User", Email: "test@example.com", UserStatus: "A", Department: "IT"},
		}, nil
	}
	mockGetAllUsersInternalServerError = func() ([]model.User, error) {
		return nil, errFoo
	}
	mockInsertUser = func(user model.User) error {
		return nil
	}
	mockInsertUserInternalServerError = func(user model.User) error {
		return errFoo
	}
	mockGetUser = func(userId int64) (model.User, error) {
		return model.User{UserId: 1, UserName: "testuser", FirstName: "Test", LastName: "User", Email: "test@example.com", UserStatus: "A", Department: "IT"}, nil
	}
	mockGetUserNotFound = func(userId int64) (model.User, error) {
		return model.User{}, model.ErrUserNotFound
	}
	mockGetUserInternalServerError = func(userId int64) (model.User, error) {
		return model.User{}, errFoo
	}
	mockUpdateUser = func(userId int64, user model.User) error {
		return nil
	}
	mockUpdateUserInternalServerError = func(userId int64, user model.User) error {
		return errFoo
	}
	mockDeleteUser = func(userId int64) error {
		return nil
	}
	mockDeleteUserNotFound = func(userId int64) error {
		return model.ErrUserNotFound
	}
	mockDeleteUserInternalServerError = func(userId int64) error {
		return errFoo
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

func TestGetAllUsersInternalServerError(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := GetAllUsers(mockGetAllUsersInternalServerError)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "internal server error")
	}
}

func TestInsertUser(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
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

func TestInsertUserInvalidEmail(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(userInvalidEmailJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "validation for 'Email' failed on the 'email' tag")
	}
}

func TestInsertUserInvalidNoUserName(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(userInvalidNoUserNameJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "validation for 'UserName' failed on the 'required' tag")
	}
}

func TestInsertUserInvalidUserStatus(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(userInvalidUserStatusJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "validation for 'UserStatus' failed on the 'oneof' tag")
	}
}

func TestInsertUserInvalidReqPayload(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(invalidJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid request payload")
	}
}

func TestInsertUserInternalServerError(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPost, "/users", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	handler := InsertUser(mockInsertUserInternalServerError)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "internal server error")
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

func TestGetUserInvalidUserId(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1-invalid")

	handler := GetUser(mockGetUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid user ID")
	}
}

func TestGetUserNotFound(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := GetUser(mockGetUserNotFound)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusNotFound, rec.Code)
		assert.Contains(t, rec.Body.String(), "User not found")
	}
}

func TestGetUserInternalServerError(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := GetUser(mockGetUserInternalServerError)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "internal server error")
	}
}

func TestUpdateUser(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
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

func TestUpdateUserInvalidUserId(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPut, "/users/:userId", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1-invalid")

	handler := UpdateUser(mockUpdateUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid user ID")
	}
}

func TestUpdateUserInvalidReqPayload(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPut, "/users/:userId", strings.NewReader(invalidJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := UpdateUser(mockUpdateUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid request payload")
	}
}

func TestUpdateUserInternalServerError(t *testing.T) {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	req := httptest.NewRequest(http.MethodPut, "/users/:userId", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := UpdateUser(mockUpdateUserInternalServerError)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "internal server error")
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

func TestDeleteUserInvalidUserId(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1-invalid")

	handler := DeleteUser(mockDeleteUser)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid user ID")
	}
}

func TestDeleteUserNotFound(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := DeleteUser(mockDeleteUserNotFound)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusNotFound, rec.Code)
		assert.Contains(t, rec.Body.String(), "User not found")
	}
}

func TestDeleteUserInternalServerError(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/:userId", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/users/:userId")
	c.SetParamNames("userId")
	c.SetParamValues("1")

	handler := DeleteUser(mockDeleteUserInternalServerError)
	if assert.NoError(t, handler(c)) {
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "internal server error")
	}
}
