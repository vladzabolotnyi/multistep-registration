-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    phone_number VARCHAR(20),

    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,

    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash BYTEA NOT NULL,

    accept_terms BOOLEAN NOT NULL DEFAULT false,
    newsletter BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT now(),

    version INTEGER NOT NULL DEFAULT 1
);

-- Create indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
