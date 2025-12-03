package repository

import (
	"context"
	"fmt"
	sqlc "multistep-registration/internal/database/sqlc"
	"multistep-registration/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *domain.User) error
	GetUserByEmail(ctx context.Context, email string) (*domain.User, error)
	GetUserByUsername(ctx context.Context, username string) (*domain.User, error)
	CheckEmailExists(ctx context.Context, email string) (bool, error)
	CheckUsernameExists(ctx context.Context, username string) (bool, error)
}

type userRepository struct {
	db *sqlc.Queries
}

func NewUserRepository(conn sqlc.DBTX) UserRepository {
	return &userRepository{
		db: sqlc.New(conn),
	}
}

func (r *userRepository) CreateUser(ctx context.Context, user *domain.User) error {
	params := sqlc.CreateUserParams{
		FirstName:     user.FirstName,
		LastName:      user.LastName,
		Email:         user.Email,
		PhoneNumber:   pgtype.Text{String: *user.PhoneNumber},
		StreetAddress: user.StreetAddress,
		City:          user.City,
		State:         user.State,
		Country:       user.Country,
		Username:      user.Username,
		PasswordHash:  user.PasswordHash,
		AcceptTerms:   user.AcceptTerms,
		Newsletter:    user.Newsletter,
	}

	dbUser, err := r.db.CreateUser(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	user.ID = dbUser.ID
	user.CreatedAt = dbUser.CreatedAt.Time
	user.UpdatedAt = dbUser.UpdatedAt.Time
	user.Version = int(dbUser.Version)

	return nil
}

func (r *userRepository) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	dbUser, err := r.db.GetUserByEmail(ctx, email)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return r.toDomainUser(dbUser), nil
}

func (r *userRepository) GetUserByUsername(ctx context.Context, username string) (*domain.User, error) {
	dbUser, err := r.db.GetUserByUsername(ctx, username)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}

	return r.toDomainUser(dbUser), nil
}

func (r *userRepository) CheckEmailExists(ctx context.Context, email string) (bool, error) {
	exists, err := r.db.CheckEmailExists(ctx, email)
	if err != nil {
		return false, fmt.Errorf("failed to check email existence: %w", err)
	}
	return exists, nil
}

func (r *userRepository) CheckUsernameExists(ctx context.Context, username string) (bool, error) {
	exists, err := r.db.CheckUsernameExists(ctx, username)
	if err != nil {
		return false, fmt.Errorf("failed to check username existence: %w", err)
	}
	return exists, nil
}

func (r *userRepository) toDomainUser(dbUser sqlc.Users) *domain.User {
	return &domain.User{
		ID:            dbUser.ID,
		FirstName:     dbUser.FirstName,
		LastName:      dbUser.LastName,
		Email:         dbUser.Email,
		PhoneNumber:   &dbUser.PhoneNumber.String,
		StreetAddress: dbUser.StreetAddress,
		City:          dbUser.City,
		State:         dbUser.State,
		Country:       dbUser.Country,
		Username:      dbUser.Username,
		PasswordHash:  dbUser.PasswordHash,
		AcceptTerms:   dbUser.AcceptTerms,
		Newsletter:    dbUser.Newsletter,
		CreatedAt:     dbUser.CreatedAt.Time,
		UpdatedAt:     dbUser.UpdatedAt.Time,
		Version:       int(dbUser.Version),
	}
}
